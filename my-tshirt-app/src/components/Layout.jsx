import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="p-4">
        <Outlet /> {/* Required to show routed content */}
      </main>
    </>
  );
};

export default Layout;
