// src/pages/Cart.jsx
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";


const FALLBACK_CART_IMAGE = "/image.png";

const Cart = () => {
  const {
    items,
    subtotal,
    itemCount,
    loading,
    error,
    loadCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    loadCart();
  }, []);

  const handleIncrease = (item) => {
    const productId = item.productId;
    const newQty = item.quantity + 1;
    updateCartItem(productId, newQty);
  };

  const handleDecrease = (item) => {
    const productId = item.productId;
    const newQty = item.quantity - 1;
    if (newQty < 1) return;
    updateCartItem(productId, newQty);
  };

  const handleRemove = (item) => {
    const productId = item.productId;
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    clearCart();
  };

  if (loading && items.length === 0) {
    return (
      <div>
        <h2 className="page-header-title">Your Cart</h2>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div>
        <h2 className="page-header-title">Your Cart</h2>
        <p style={{ color: "red" }}>{error}</p>
        <button className="btn btn-secondary btn-sm" onClick={loadCart}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header-title">Your Cart</h2>
          <p className="page-header-subtitle">
            Review your items before placing an order.
          </p>
        </div>
      </div>

      {error && <p style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>}

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-summary">
            <p>
              <strong>Items:</strong> {itemCount}
            </p>
            <p>
              <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
            </p>
          </div>

          <div className="cart-items">
            {items.map((item) => {
              const product = item.product || {};
              const name = product.name || "No name";
              const price =
                typeof product.price === "number"
                  ? product.price
                  : product.price || 0;

              // Decide backend image vs fallback
              const rawImage =
                (Array.isArray(product.images) && product.images[0]) ||
                product.image ||
                "";

              const hasBackendImage = !!rawImage;
              const imageUrl = hasBackendImage ? rawImage : FALLBACK_CART_IMAGE;

              const lineTotal = price * item.quantity;

              const handleImgError = (e) => {
                console.log("Cart image failed, using fallback for:", name);
                e.target.src = FALLBACK_CART_IMAGE;
                e.target.onerror = null;
              };

              return (
                <div key={item.id} className="cart-item">
                  <img
                    src={imageUrl}
                    alt={name}
                    className="cart-item-image"
                    onError={handleImgError} //  fallback here
                  />

                  <div className="cart-item-main">
                    <div className="cart-item-title">{name}</div>
                    <div className="cart-item-meta">
                      <span>Price: ${price.toFixed(2)}</span> ·{" "}
                      <span>Line total: ${lineTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleDecrease(item)}
                      disabled={item.quantity <= 1 || loading}
                    >
                      -
                    </button>
                    <span className="cart-qty">{item.quantity}</span>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleIncrease(item)}
                      disabled={loading}
                    >
                      +
                    </button>

                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleRemove(item)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="btn btn-danger"
            onClick={handleClearCart}
            disabled={loading || items.length === 0}
            style={{ marginTop: "1rem" }}
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
