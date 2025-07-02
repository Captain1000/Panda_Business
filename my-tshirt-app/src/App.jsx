import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetail";
import Customize from "./pages/customize";
import MyCustomizations from "./pages/MyCustomizations";
import PlaceOrder from "./pages/PlaceOrder";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import Cart from "./pages/Cart";
import Layout from "./components/Layout";

const isAuthenticated = () => !!localStorage.getItem("token");

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes (no layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* All Protected Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={isAuthenticated() ? <Home /> : <Navigate to="/login" />} />
          <Route path="/product/:id" element={isAuthenticated() ? <ProductDetails /> : <Navigate to="/login" />} />
          <Route path="/customize/:id" element={isAuthenticated() ? <Customize /> : <Navigate to="/login" />} />
          <Route path="/my-customizations" element={isAuthenticated() ? <MyCustomizations /> : <Navigate to="/login" />} />
          <Route path="/place-order/:id" element={isAuthenticated() ? <PlaceOrder /> : <Navigate to="/login" />} />
          <Route path="/my-orders" element={isAuthenticated() ? <MyOrders /> : <Navigate to="/login" />} />
          <Route path="/cart" element={isAuthenticated() ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/admin" element={isAuthenticated() ? <AdminDashboard /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
