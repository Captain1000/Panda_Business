import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
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

    if (cartItems.some((item) => item.quantity < 10)) {
      setMessage("❌ Minimum quantity for each T-shirt is 10.");
      setLoading(false);
      return;
    }

    try {
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
            size: item.selectedSize,
            color: item.selectedColor,
          })),
          address,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Order creation failed");
      }

      const orderData = await res.json();

      navigate("/payment", {
        state: {
          orderId: orderData.id,
          amount: total,
          name: address.full_name,
          email: "customer@example.com",
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
      <h2 className="cart-heading">🛒 Your Cart</h2>
      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-card fade-slide-in">
            <div className="cart-img">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="cart-info">
              <h4>{item.name}</h4>

              <div className="cart-meta">
                <span className="badge">Size: {item.selectedSize || "Not selected"}</span>
                <span className="badge">Color: {item.selectedColor || "Default"}</span>
                <div className="qty-control">
                  <label>Qty:</label>
                  <div className="qty-buttons">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, Math.max(10, item.quantity - 1))}
                      disabled={item.quantity <= 10}
                    >
                      −
                    </button>
                    <span className="qty-display pulse">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <span className="badge">₹ {item.price * item.quantity}</span>
              </div>

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
