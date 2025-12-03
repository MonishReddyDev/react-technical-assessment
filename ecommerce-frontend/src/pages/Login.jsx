// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("john.doe@example.com"); // default test email
  const [password, setPassword] = useState("password123"); // default test password
  const [formError, setFormError] = useState("");

  const from = location.state?.from || "/products";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Email and password are required");
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="form-card">
      <h2 className="page-title">Welcome back</h2>
      <p className="page-subtitle">
        Sign in to view products and manage your cart.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            value={email}
            placeholder="user@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          {formError && !email && (
            <p className="form-error">Email is required</p>
          )}
        </div>

        <div className="form-field">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            value={password}
            placeholder="P@ssw0rd"
            onChange={(e) => setPassword(e.target.value)}
          />
          {formError && !password && (
            <p className="form-error">Password is required</p>
          )}
        </div>

        {error && <p className="form-error">{error}</p>}
        {formError && !error && <p className="form-error">{formError}</p>}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ marginTop: "0.25rem" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
