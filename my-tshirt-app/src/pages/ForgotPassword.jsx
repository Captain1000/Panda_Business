import React, { useState } from "react";
import "../styles/Login.css"; // Reuse same styles for consistency

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:8000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Password reset instructions sent to your email.");
      } else {
        setError("Failed to send reset link. Check your email.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      {message && <p style={{ color: "lightgreen", textAlign: "center" }}>{message}</p>}
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Link</button>
      </form>
      <p>
        Remember your password? <a href="/login">Back to Login</a>
      </p>
    </div>
  );
};

export default ForgotPassword;
