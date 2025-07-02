import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/MyOrders.css';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You're not logged in.");
      return;
    }

    axios.get("http://localhost:8000/orders/my", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setOrders(res.data))
    .catch(err => {
      console.error("❌ Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    });
  }, []);

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>

      {error && <p className="error-message">{error}</p>}

      {orders.length === 0 && !error ? (
        <p className="no-orders">No orders yet.</p>
      ) : (
        <div className="order-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-status">{order.status}</span>
                <span className="order-date">
                  {new Date(order.order_date).toLocaleString()}
                </span>
              </div>

              <div className="order-address">
                <h4>Shipping Address</h4>
                <p>{order.address.full_name}</p>
                <p>{order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
                <p>📞 {order.address.phone}</p>
              </div>

              <div className="order-items">
                <h4>Items</h4>
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx} className="order-item">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || "Item"}
                          className="order-item-image"
                        />
                      ) : (
                        <div className="order-item-placeholder">No Image</div>
                      )}

                      <div className="order-item-details">
                        <p className="item-name">{item.name || "Unnamed Item"}</p>
                        <p>{item.item_type.toUpperCase()} ID: {item.item_id}</p>
                        <p>Qty: {item.quantity}</p>
                        {item.price !== undefined && (
                          <p>Price: ₹{item.price}</p>
                        )}
                        {item.subtotal !== undefined && (
                          <p>Subtotal: ₹{item.subtotal}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-total">
                <strong>Total Price:</strong> ₹{order.total_price?.toFixed(2) || "0.00"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
