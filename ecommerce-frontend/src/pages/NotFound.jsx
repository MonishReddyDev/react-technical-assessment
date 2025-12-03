// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-code">404</div>
      <h2 className="not-found-title">Page not found</h2>
      <p className="not-found-text">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <div className="not-found-actions">
        <Link to="/products" className="btn btn-primary">
          Go to Products
        </Link>
        <Link to="/login" className="btn btn-secondary">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
