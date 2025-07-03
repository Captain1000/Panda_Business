import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState({
    full_name: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleContinueToPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ Please login to place an order.");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create the order in the backend
      const res = await fetch("http://localhost:8000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            item_type: "tshirt",
            item_id: item.id,
            quantity: item.quantity,
          })),
          address,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Order creation failed");
      }

      const orderData = await res.json();

      // Step 2: Redirect to Payment.jsx with order info
      navigate("/payment", {
        state: {
          orderId: orderData.id,
          amount: total,
          name: address.full_name,
          email: "customer@example.com", // Replace with real user email
        },
      });
    } catch (err) {
      console.error("❌ Error:", err);
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container empty">
        <h2>🛒 Your cart is empty.</h2>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-card">
            <img src={item.image} alt={item.name} />
            <div className="cart-info">
              <h4>{item.name}</h4>
              <p>Qty: {item.quantity}</p>
              <p>₹ {item.price * item.quantity}</p>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <h3>Total: ₹{total}</h3>
        <div className="cart-buttons">
          <button className="clear-btn" onClick={clearCart}>
            Clear Cart
          </button>
          <button className="checkout-btn" onClick={() => setShowForm(true)}>
            Checkout
          </button>
        </div>
      </div>

      {showForm && (
        <form className="checkout-form" onSubmit={handleContinueToPayment}>
          <h3>Shipping Details</h3>
          <input
            type="text"
            placeholder="Full Name"
            value={address.full_name}
            onChange={(e) => setAddress({ ...address, full_name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Street"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="State"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Continue to Payment"}
          </button>
        </form>
      )}

      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default Cart;
