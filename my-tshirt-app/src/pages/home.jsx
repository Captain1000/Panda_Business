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
  const [reset, setReset] = useState(false);
  const limit = 8;

  const { addToCart } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    color: "",
    size: "",
    max_price: "",
  });

  const [selectedSizes, setSelectedSizes] = useState({});
  const [errors, setErrors] = useState({});

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setTshirts([]);
    setPage(0);
    setHasMore(true);
    setReset(true);
  }, [filters]);

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

  useEffect(() => {
    if (reset) {
      fetchTshirts(0);
      setReset(false);
    }
  }, [reset]);

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
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddToCart = (tshirt) => {
    const size = selectedSizes[tshirt.id];
    if (!size) {
      setErrors((prev) => ({
        ...prev,
        [tshirt.id]: "❗ Please select a size before adding to cart.",
      }));
      setTimeout(() => {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy[tshirt.id];
          return copy;
        });
      }, 3000);
      return;
    }

    addToCart({ ...tshirt, selectedSize: size });
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
          <option value="Black">Black</option>
          <option value="White">White</option>
          <option value="Red">Red</option>
          <option value="Blue">Blue</option>
          <option value="Yellow">Yellow</option>
          <option value="Sky">Sky</option>
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
              <label>Select Size:</label>
              <div className="size-options">
                {t.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-option ${selectedSizes[t.id] === size ? "selected" : ""
                      }`}
                    onClick={() =>
                      setSelectedSizes({ ...selectedSizes, [t.id]: size })
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>


            <div className="color-row">
              <label>Color:</label>
              <span
                className="color-box"
                style={{ backgroundColor: t.colors?.[0]?.toLowerCase() || "#ccc" }}
                title={t.colors?.[0]}
              ></span>
              <span>{t.colors?.[0]}</span>
            </div>

            {errors[t.id] && (
              <p style={{ color: "red", fontSize: "13px" }}>{errors[t.id]}</p>
            )}

            <button onClick={() => handleAddToCart(t)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {loading && <div className="loading">🚀 Loading more T-shirts...</div>}
    </div>
  );
};

export default Home;
