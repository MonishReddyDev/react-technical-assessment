// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getProducts();
      console.log("Raw products response:", res.data);

      const body = res.data || {};
      const inner = body.data || {};
      const list = inner.products || [];

      setProducts(list);
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    const productId = product.id;
    if (!productId) return;
    await addToCart(productId, 1);
  };

  const handleViewDetails = (id) => {
    if (!id) return;
    navigate(`/products/${id}`);
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h2 className="page-header-title">Products</h2>
        </div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="page-header">
          <h2 className="page-header-title">Products</h2>
        </div>
        <p style={{ color: "red" }}>{error}</p>
        <button className="btn btn-secondary btn-sm" onClick={fetchProducts}>
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

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
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
    </div>
  );
};

export default Products;
