// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../services/api";
import { useCart } from "../context/CartContext";

// Public folder asset: always referenced with a leading slash
const FALLBACK_DETAIL_IMAGE = "/image.png";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load product by id
  const fetchProduct = async () => {
    if (!id) return;
    setLoading(true);
    setError("");

    try {
      const res = await getProduct(id);
      console.log("Product detail response:", res.data);

      // Handle shapes:
      // { success, data: { product: {...} } }
      // { success, data: {...} }
      // { product: {...} }
      const body = res.data;
      const item = body?.data?.product || body?.data || body?.product || body;

      setProduct(item);
    } catch (err) {
      console.error("Error fetching product detail:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to load product detail.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();

  }, [id]);

  const handleAddToCart = async () => {
    if (!product?.id) return;
    await addToCart(product.id, 1);
  };

  if (loading) {
    return (
      <div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h2 className="page-header-title">Product Detail</h2>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h2 className="page-header-title">Product Detail</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h2 className="page-header-title">Product Detail</h2>
        <p>No product found.</p>
      </div>
    );
  }

  const name = product.name || "No name";
  const description = product.description || "No description available.";

  const price =
    typeof product.price === "number"
      ? product.price.toFixed(2)
      : product.price || "N/A";

  const stock =
    typeof product.stock === "number" ? product.stock : product.stock || "N/A";

  // 🔹 Same logic as ProductCard: backend image vs placeholder
  const rawImage =
    (Array.isArray(product.images) && product.images[0]) || product.image || "";

  const hasBackendImage = !!rawImage;
  const imageUrl = hasBackendImage ? rawImage : FALLBACK_DETAIL_IMAGE;

  console.log("Product detail imageUrl:", imageUrl);

  const handleImgError = (e) => {
    console.log("Detail image failed, using fallback for:", name);
    e.target.src = FALLBACK_DETAIL_IMAGE;
    e.target.onerror = null;
  };

  return (
    <div>
      <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div style={{ marginTop: "1rem" }} className="product-detail">
        {/* LEFT: image */}
        <img
          src={imageUrl}
          alt={name}
          className="product-detail-image"
          onError={handleImgError}
        />

        {/* RIGHT: info */}
        <div className="product-detail-body">
          <h2 className="page-header-title">{name}</h2>

          <div className="product-detail-meta">
            <span>
              <strong>Price:</strong> ${price}
            </span>
            <span>
              <strong>Stock:</strong> {stock}
            </span>
          </div>

          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.95rem",
              maxWidth: "40rem",
            }}
          >
            {description}
          </p>

          {/* Small label like in Products */}
          <p
            style={{
              fontSize: "0.75rem",
              color: "#6B7280",
              marginTop: "0.4rem",
            }}
          >
            Image source:{" "}
            {hasBackendImage
              ? "Using backend image"
              : "Using placeholder image"}
          </p>

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <button className="btn btn-primary" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
