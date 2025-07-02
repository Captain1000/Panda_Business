import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import { useCart } from "../context/CartContext";


const Home = () => {
  const navigate = useNavigate();
  const observer = useRef();

  const [tshirts, setTshirts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [page, setPage] = useState(0);
  const [reset, setReset] = useState(false); // NEW
  const limit = 8;
  const { addToCart } = useCart();
  0

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    color: "",
    size: "",
    max_price: "",
  });


  // useEffect(() => {
  //   console.log("Rendering Home Page");
  // }, []);


  // Debounced search -> update filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset tshirt list when filters change
  useEffect(() => {
    setTshirts([]);
    setPage(0);
    setHasMore(true);
    setReset(true); // trigger fresh fetch
  }, [filters]);

  // Main fetch logic
  const fetchTshirts = async (fetchPage) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/tshirts", {
        params: {
          skip: fetchPage * limit,
          limit,
          search: filters.search || undefined,
          color: filters.color || undefined,
          size: filters.size || undefined,
          max_price: filters.max_price || undefined,
        },
      });

      const newData = response.data;

      // Deduplicate by ID
      const existingIds = new Set(tshirts.map((t) => t.id));
      const uniqueData = newData.filter((t) => !existingIds.has(t.id));

      if (uniqueData.length < limit) setHasMore(false);

      setTshirts((prev) => [...prev, ...uniqueData]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error fetching t-shirts", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial / reset fetch
  useEffect(() => {
    if (reset) {
      fetchTshirts(0);
      setReset(false);
    }
  }, [reset]);

  // Infinite scroll observer
  const lastTshirtRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchTshirts(page);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page]
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTshirts([]);
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="home-container">
      <h2>Browse T-Shirts</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select name="color" value={filters.color} onChange={handleFilterChange}>
          <option value="">All Colors</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
        </select>

        <select name="size" value={filters.size} onChange={handleFilterChange}>
          <option value="">All Sizes</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>

        <input
          type="number"
          name="max_price"
          placeholder="Max Price"
          value={filters.max_price}
          onChange={handleFilterChange}
        />
      </div>

      {tshirts.length === 0 && !loading && (
        <div className="no-results">😕 No T-shirts found.</div>
      )}

      <div className="tshirt-grid">
        {tshirts.map((t, i) => (
          <div
            key={t.id}
            ref={i === tshirts.length - 1 ? lastTshirtRef : null}
            className="tshirt-card"
          >
            <img src={t.image} alt={t.name} />
            <h3>{t.name}</h3>
            <p>₹{t.price}</p>

            <div className="size-row">
              <strong>Sizes:</strong> {t.sizes?.join(", ")}
            </div>

            <div className="color-row">
              <strong>Colors:</strong>{" "}
              {t.colors?.map((clr, index) => (
                <span
                  key={index}
                  className="color-box"
                  style={{ backgroundColor: clr }}
                  title={clr}
                ></span>
              ))}
            </div>

            {/* <button onClick={() => navigate(`/customize/${t.id}`)}>
              Customize
            </button> */}
            <button onClick={() => addToCart(t)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {loading && <div className="loading">🚀 Loading more T-shirts...</div>}
    </div>
  );
};

export default Home;
