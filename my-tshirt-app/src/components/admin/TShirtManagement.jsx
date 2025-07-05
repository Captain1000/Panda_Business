import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/TShirtManagement.css";

const TShirtManagement = () => {
  const [tshirts, setTshirts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    image: "",
    price: "",
    colors: "",
    sizes: "",
  });
  const [editId, setEditId] = useState(null); // for edit mode
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTshirts();
  }, []);

  const fetchTshirts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/tshirts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTshirts(res.data);
    } catch (err) {
      console.error("Failed to fetch T-shirts", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price),
      colors: form.colors.split(",").map((c) => c.trim()),
      sizes: form.sizes.split(",").map((s) => s.trim()),
    };

    try {
      if (editId) {
        // Update mode
        await axios.put(`http://localhost:8000/tshirts/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Add mode
        await axios.post("http://localhost:8000/tshirts", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({ name: "", image: "", price: "", colors: "", sizes: "" });
      setEditId(null);
      fetchTshirts();
    } catch (err) {
      alert("Error saving T-shirt");
    }
  };

  const handleEdit = (tshirt) => {
    setForm({
      name: tshirt.name,
      image: tshirt.image,
      price: tshirt.price,
      colors: tshirt.colors.join(", "),
      sizes: tshirt.sizes.join(", "),
    });
    setEditId(tshirt.id);
  };

  const handleCancelEdit = () => {
    setForm({ name: "", image: "", price: "", colors: "", sizes: "" });
    setEditId(null);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this T-shirt?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8000/tshirts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTshirts();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="tshirt-mgmt-container">
      <h2>🛠 T-Shirt Management</h2>

      <form className="tshirt-form" onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          required
        />
        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          placeholder="Colors (comma separated)"
          value={form.colors}
          onChange={(e) => setForm({ ...form, colors: e.target.value })}
        />
        <input
          placeholder="Sizes (comma separated)"
          value={form.sizes}
          onChange={(e) => setForm({ ...form, sizes: e.target.value })}
        />

        <div className="form-buttons">
          <button type="submit">
            {editId ? "✏️ Update T-Shirt" : "➕ Add T-Shirt"}
          </button>
          {editId && (
            <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
              ❌ Cancel
            </button>
          )}
        </div>
      </form>

      <div className="tshirt-grid">
        {tshirts.map((t) => (
          <div key={t.id} className="tshirt-card">
            <img src={t.image} alt={t.name} />
            <h3>{t.name}</h3>
            <p>₹{t.price}</p>
            <div className="chip-group">
              <strong>Colors:</strong>{" "}
              {t.colors?.map((clr, i) => (
                <span
                  key={i}
                  className="color-chip"
                  style={{ backgroundColor: clr }}
                />
              ))}
            </div>
            <div className="chip-group">
              <strong>Sizes:</strong>{" "}
              {t.sizes?.map((sz, i) => (
                <span key={i} className="size-chip">
                  {sz}
                </span>
              ))}
            </div>
            <div className="card-actions">
              <button className="edit-btn" onClick={() => handleEdit(t)}>
                ✏️ Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(t.id)}>
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TShirtManagement;
