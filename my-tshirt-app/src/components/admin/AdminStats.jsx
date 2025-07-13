import React, { useEffect, useState } from "react";
import "../../styles/AdminStats.css";

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/admin/sales-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStats();
  }, []);

  if (error) return <p className="admin-stats-error">{error}</p>;

  return (
    <div className="admin-stats-container">
      <h2>📊 Sales Overview</h2>

      {!stats ? (
        <p>Loading stats...</p>
      ) : (
        <>
          {/* Total Sales Cards */}
          <div className="sales-summary">
            <div className="sales-card">
              <h4>This Month</h4>
              <p>{stats.total_sales.this_month}</p>
            </div>
            <div className="sales-card">
              <h4>Last Month</h4>
              <p>{stats.total_sales.last_month}</p>
            </div>
            <div className="sales-card">
              <h4>This Year</h4>
              <p>{stats.total_sales.this_year}</p>
            </div>
          </div>

          {/* Top Selling T-Shirts */}
          <div className="top-selling-section">
            <h3>🔥 Top 5 Best-Selling T-Shirts</h3>
            <div className="top-tshirts-grid">
              {stats.top_5_tshirts.map((tshirt, index) => (
                <div key={tshirt.id} className="tshirt-card">
                  <div className="tshirt-rank">#{index + 1}</div>
                  <img
                    src={tshirt.image}
                    alt={tshirt.name}
                    className="tshirt-image"
                  />
                  <h4>{tshirt.name}</h4>
                  <p>{tshirt.total_sold} sold</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminStats;
