// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const Products = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast(); // ✅ get toast helper

  const fetchProducts = async (pageToLoad = 1) => {
    setLoading(true);
    setError("");

    try {
      // Ask backend for this page with a fixed limit (e.g. 8 items per page)
      const res = await getProducts(pageToLoad, 8);
      console.log("Raw products response:", res.data);

      const body = res.data || {};
      const inner = body.data || {};

      const list = inner.products || [];

      setProducts(list);

      // Try to read pagination meta if backend sends it
      const currentPage = inner.page || pageToLoad;
      const pagesFromBackend = inner.totalPages || inner.totalPage || null;

      setPage(currentPage);

      if (pagesFromBackend) {
        setTotalPages(pagesFromBackend);
      } else {
        // Fallback: at least show current page even if backend
        // does not send totalPages
        setTotalPages(currentPage);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to load products.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever `page` changes
  useEffect(() => {
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleAddToCart = async (product) => {
    const productId = product.id;
    if (!productId) return;

    try {
      await addToCart(productId, 1);
      // ✅ success toast
      showToast(`Added "${product.name}" to cart`, "success");
    } catch (err) {
      console.error("Add to cart failed:", err);
      // ✅ error toast
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to add item to cart.";
      showToast(msg, "error");
    }
  };

  const handleViewDetails = (id) => {
    if (!id) return;
    navigate(`/products/${id}`);
  };

  if (loading && products.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h2 className="page-header-title">Products</h2>
        </div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h2 className="page-header-title">Products</h2>
        </div>
        <p style={{ color: "red" }}>{error}</p>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => fetchProducts(page)}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header-title">Products</h2>
          <p className="page-header-subtitle">
            Browse items from the marketplace.
          </p>
        </div>
      </div>

      {products.length === 0 && !loading && !error && <p>No products found.</p>}

      {products.length > 0 && (
        <div className="grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {/* 🔹 Pagination controls */}
      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
        }}
      >
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page <= 1 || loading}
        >
          Previous
        </button>

        <span style={{ fontSize: "0.9rem", color: "#4b5563" }}>
          Page <strong>{page}</strong>
          {totalPages && totalPages > 1 ? ` of ${totalPages}` : ""}
        </span>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={loading || (totalPages && page >= totalPages)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Products;
