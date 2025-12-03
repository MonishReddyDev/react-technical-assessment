import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { useToast } from "./context/ToastContext";

const App = () => {
  const { toast, hideToast } = useToast();
  return (
    <div>
      <Navbar />

      {toast && (
        <div
          className={`toast toast-${toast.type}`}
          onClick={hideToast} // click to close manually
        >
          {toast.message}
        </div>
      )}

      <main style={{ padding: "1rem" }}>
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/products" replace />} />

          {/* Public route */}
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

//Nesting
