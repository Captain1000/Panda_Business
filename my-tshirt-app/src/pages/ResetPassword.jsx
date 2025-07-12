// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/Login.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Reset failed");
      }

      setMessage("Password has been reset. Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
