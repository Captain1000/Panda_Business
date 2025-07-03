import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/AllOrders.css"; // ✅ Create this CSS file

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to fetch orders. Please try again.");
    }
  };

  return (
    <div className="admin-orders-container">
      <h2 className="admin-orders-title">All Orders</h2>

      {error && <p className="admin-error">{error}</p>}

      {orders.length === 0 ? (
        <p className="admin-no-orders">No orders found.</p>
      ) : (
        <div className="admin-order-list">
          {orders.map((order) => {
            const totalPrice = order.items.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
            return (
              <div key={order.id} className="admin-order-card">
                <div className="admin-order-header">
                  <span><strong>Order ID:</strong> {order.id}</span>
                  <span><strong>Status:</strong> {order.status}</span>
                  <span><strong>Placed:</strong> {new Date(order.order_date).toLocaleString()}</span>
                </div>

                {order.user && (
                  <p><strong>User:</strong> {order.user.name || order.user.email}</p>
                )}

                <div className="admin-address">
                  <strong>Shipping Address:</strong>
                  <p>{order.address.full_name}</p>
                  <p>{order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
                  <p>📞 {order.address.phone}</p>
                </div>

                <div className="admin-items">
                  <strong>Items:</strong>
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx} className="admin-item">
                        {item.image ? (
                          <img src={item.image} alt={item.name || "Item"} className="admin-item-image" />
                        ) : (
                          <div className="admin-placeholder-image">No Image</div>
                        )}
                        <div className="admin-item-details">
                          <p><strong>{item.name || "Unnamed Item"}</strong></p>
                          <p>{item.item_type.toUpperCase()} ID: {item.item_id}</p>
                          <p>Qty: {item.quantity}</p>
                          {item.price && <p>Price: ₹{item.price}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="admin-total"><strong>Total Price:</strong> ₹{totalPrice.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllOrders;
