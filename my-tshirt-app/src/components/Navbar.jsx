// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useCart } from "../context/CartContext";
import {
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaBars,
  FaTimes,
  FaTshirt,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const totalCartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Handle dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector(".navbar");
      if (window.scrollY > 10) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          <FaTshirt /> T-Shirt Store
        </Link>
      </div>

      <div className={`navbar-right ${menuOpen ? "open" : ""}`}>
        <Link to="/cart" className="cart-link">
          <FaShoppingCart />
          {totalCartCount > 0 && <span>{totalCartCount}</span>}
        </Link>

        {user ? (
          <>
            <Link to="/my-orders"><FaUser /> Orders</Link>
            <Link to="/my-customizations"><FaTshirt /> Custom</Link>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"><FaSignInAlt /> Login</Link>
            <Link to="/register"><FaUser /> Register</Link>
          </>
        )}
        <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
          {darkMode ? <FaMoon /> : <FaSun />}
        </button>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
}
