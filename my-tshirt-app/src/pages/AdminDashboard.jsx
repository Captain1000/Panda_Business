import React, { useState } from "react";
import TShirtManagement from "../components/admin/TShirtManagement";
import CustomRequests from "../components/admin/CustomRequests";
import AllOrders from "../components/admin/AllOrders";
import AdminStats from "../components/admin/AdminStats";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [section, setSection] = useState("tshirts");

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => setSection("tshirts")}>T-Shirts</li>
          <li onClick={() => setSection("customs")}>Custom Requests</li>
          <li onClick={() => setSection("orders")}>Orders</li>
          <li onClick={() => setSection("Stats")}>Stats</li>
        </ul>
      </aside>

      <main className="admin-content">
        {section === "tshirts" && <TShirtManagement />}
        {section === "customs" && <CustomRequests />}
        {section === "orders" && <AllOrders />}
        {section === "Stats" && <AdminStats />}
      </main>
    </div>
  );
};

export default AdminDashboard;
