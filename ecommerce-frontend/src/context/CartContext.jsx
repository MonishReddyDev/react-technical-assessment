import React, { createContext, useContext, useState } from "react";
import {
  getCart,
  addToCartApi,
  updateCartItemApi,
  removeFromCartApi,
  clearCartApi,
} from "../services/api";

const defaultCartValue = {
  items: [],
  subtotal: 0,
  itemCount: 0,
  loading: false,
  error: "",
  loadCart: async () => {},
  addToCart: async () => {},
  updateCartItem: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
};

const CartContext = createContext(defaultCartValue);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Apply full cart data from GET /cart
  const applyCartResponse = (cartData) => {
    setItems(cartData.items || []);
    setSubtotal(cartData.subtotal || 0);
    setItemCount(cartData.itemCount ?? (cartData.items?.length || 0));
  };

  // 👉 Internal helper: call GET /cart and update state
  const fetchCartAndApply = async () => {
    const res = await getCart();
    console.log("GET /cart response:", res.data);

    // Your GET /cart shape: { success: true, data: { items, subtotal, itemCount } }
    const body = res.data;
    const cartData = body.data || body;
    applyCartResponse(cartData);
  };

  // --- Load cart (used by Navbar and Cart page) ---
  const loadCart = async () => {
    setLoading(true);
    setError("");
    try {
      await fetchCartAndApply();
    } catch (err) {
      console.error("Error loading cart:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to load cart.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- Add product to cart ---
  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await addToCartApi(productId, quantity);
      console.log("POST /cart response:", res.data);

      // After successful POST, reload full cart via GET
      await fetchCartAndApply();
    } catch (err) {
      console.error("Error adding to cart:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to add item to cart.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- Update quantity ---
  const updateCartItem = async (productId, quantity) => {
    setLoading(true);
    setError("");
    try {
      const res = await updateCartItemApi(productId, quantity);
      console.log("PUT /cart response:", res.data);

      await fetchCartAndApply();
    } catch (err) {
      console.error("Error updating cart item:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update cart item.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- Remove one item ---
  const removeFromCart = async (productId) => {
    setLoading(true);
    setError("");
    try {
      const res = await removeFromCartApi(productId);
      console.log("DELETE /cart/:id response:", res.data);

      await fetchCartAndApply();
    } catch (err) {
      console.error("Error removing cart item:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to remove item from cart.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- Clear entire cart ---
  const clearCart = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await clearCartApi();
      console.log("DELETE /cart response:", res.data);

      await fetchCartAndApply();
    } catch (err) {
      console.error("Error clearing cart:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to clear cart.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    items,
    subtotal,
    itemCount,
    loading,
    error,
    loadCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
