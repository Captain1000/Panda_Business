import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, amount, name, email } = location.state || {};

  useEffect(() => {
    if (!orderId || !amount) {
      navigate("/cart");
      return;
    }

    const loadRazorpay = async () => {
      const token = localStorage.getItem("token");

      try {
        // Request backend to create Razorpay order
        const res = await axios.post(
          "http://localhost:8000/create-razorpay-order",
          { amount },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { id: razorpayOrderId } = res.data;

        const options = {
          key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay key
          amount: amount * 100,
          currency: "INR",
          name: "My T-shirt Store",
          description: `Payment for Order #${orderId}`,
          order_id: razorpayOrderId,
          handler: async function (response) {
            // On successful payment
            try {
              await axios.post(
                "http://localhost:8000/payment/verify",
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: orderId,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              alert("✅ Payment successful!");
              navigate("/my-orders");
            } catch (err) {
              console.error("Payment verification failed", err);
              alert("❌ Payment verification failed");
            }
          },
          prefill: {
            name,
            email,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Failed to initiate Razorpay:", error);
        alert("❌ Unable to initiate payment.");
        navigate("/cart");
      }
    };

    loadRazorpay();
  }, [orderId, amount, name, email, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Loading Razorpay...</h2>
      <p>Please do not refresh the page.</p>
    </div>
  );
};

export default Payment;
