import React, { useEffect, useState } from "react";
import "../styles/PersonalInfo.css";

const PersonalInfo = () => {
  const [user, setUser] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newAddress, setNewAddress] = useState({
    full_name: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: ""
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Failed to fetch user", err));
  }, []);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditForm({ ...user.addresses[index] });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleNewChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      await fetch(`http://localhost:8000/address/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      setEditingIndex(null);
      window.location.reload();
    } catch (err) {
      alert("Failed to update address");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this address?");
    if (!confirm) return;

    try {
      console.log("Deleting address ID:", id);
      await fetch(`http://localhost:8000/address/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (err) {
      alert("Failed to delete address");
    }
  };

  const handleAddNew = async () => {
    try {
      await fetch("http://localhost:8000/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAddress),
      });
      setNewAddress({
        full_name: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        phone: ""
      });
      window.location.reload();
    } catch (err) {
      alert("Failed to add address");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="personal-info-container">
      <h2>👤 Personal Info</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <h3>📍 Saved Addresses</h3>
      {user.addresses?.length ? (
        user.addresses.map((addr, i) => (
          <div key={i} className="address-card">
            {editingIndex === i ? (
              <div className="edit-form">
                {["full_name", "street", "city", "state", "pincode", "phone"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    value={editForm[field] || ""}
                    onChange={handleEditChange}
                    placeholder={field.replace("_", " ")}
                  />
                ))}
                <button onClick={() => handleUpdate(addr.id)}>💾 Save</button>
                <button onClick={() => setEditingIndex(null)}>❌ Cancel</button>
              </div>
            ) : (
              <>
                <p><strong>Full Name:</strong> {addr.full_name}</p>
                <p><strong>Street:</strong> {addr.street}</p>
                <p><strong>City:</strong> {addr.city}</p>
                <p><strong>State:</strong> {addr.state}</p>
                <p><strong>Pincode:</strong> {addr.pincode}</p>
                <p><strong>Phone:</strong> {addr.phone}</p>
                <div className="action-btns">
                  <button onClick={() => handleEditClick(i)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(addr.id)}>🗑 Delete</button>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p>No address saved yet.</p>
      )}

      <h3>➕ Add New Address</h3>
      <div className="add-form">
        {["full_name", "street", "city", "state", "pincode", "phone"].map((field) => (
          <input
            key={field}
            name={field}
            value={newAddress[field]}
            onChange={handleNewChange}
            placeholder={field.replace("_", " ")}
          />
        ))}
        <button onClick={handleAddNew}>✅ Add Address</button>
      </div>
    </div>
  );
};

export default PersonalInfo;
