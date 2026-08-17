import { BrowserRouter, Routes, Route } from "react-router-dom";

// CUSTOMER
import Home from "../pages/Home";
import Menu from "../pages/Menu";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import MyOrders from "../pages/MyOrders";
import FindOrder from "../pages/FindOrder";

// ORDER
import OrderSuccess from "../pages/OrderSuccess";
import OrderTracking from "../pages/OrderTracking";

// ADMIN
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";

import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

// ERROR
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* CUSTOMER */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/find-order" element={<FindOrder />} />

        {/* ORDER */}
        <Route
          path="/order-success/:orderId"
          element={<OrderSuccess />}
        />

        <Route
          path="/order-tracking/:orderId"
          element={<OrderTracking />}
        />

        {/* LOGIN */}
        <Route
          path="/admin/login"
          element={<Login />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}