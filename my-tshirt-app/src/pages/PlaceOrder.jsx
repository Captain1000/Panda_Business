import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/PlaceOrder.css";

const PlaceOrder = () => {
  const { cartItems, clearCart } = useCart();
  const [addressId, setAddressId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      const res = await fetch("http://localhost:8000/addresses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setAddresses(data);
      if (data.length) setAddressId(data[0].id);
    };

    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      for (let item of cartItems) {
        const payload = {
          item_type: "tshirt", // You can enhance this to support "custom"
          item_id: item.id,
          address_id: addressId,
        };

        await fetch("http://localhost:8000/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      clearCart();
      alert("✅ Order placed successfully!");
      navigate("/my-orders");
    } catch (err) {
      console.error("Order failed:", err);
      alert("❌ Failed to place order.");
    }
  };

  if (!cartItems.length) {
    return <h3 style={{ textAlign: "center" }}>🛒 Cart is empty</h3>;
  }

  return (
    <div className="placeorder-container">
      <h2>Confirm Your Order</h2>

      <div className="address-section">
        <label>Select Address:</label>
        <select
          value={addressId}
          onChange={(e) => setAddressId(Number(e.target.value))}
        >
          {addresses.map((addr) => (
            <option key={addr.id} value={addr.id}>
              {addr.line1}, {addr.city}, {addr.state}
            </option>
          ))}
        </select>
      </div>

      <div className="summary">
        <h3>Items Summary:</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="summary-item">
            <img src={item.image} alt={item.name} />
            <div>
              <strong>{item.name}</strong> x{item.quantity}
              <p>₹{item.price * item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="confirm-btn" onClick={handlePlaceOrder}>
        ✅ Place Order
      </button>
    </div>
  );
};

export default PlaceOrder;
