import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomRequests = () => {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await axios.get("http://localhost:8000/custom-designs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequests(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(
      `http://localhost:8000/custom-designs/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchRequests();
  };

  return (
    <div>
      <h2>Custom T-Shirt Requests</h2>
      {requests.map((req) => (
        <div key={req.id} style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}>
          <p><strong>User ID:</strong> {req.user_id}</p>
          <p><strong>Text:</strong> {req.text}</p>
          <p><strong>Color:</strong> {req.selected_color}</p>
          <p><strong>Status:</strong> {req.status}</p>
          {req.status === "pending" && (
            <>
              <button onClick={() => updateStatus(req.id, "approved")}>Approve</button>
              <button onClick={() => updateStatus(req.id, "rejected")}>Reject</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomRequests;
