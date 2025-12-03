import { createContext, useContext, useState } from "react";
import { login as loginApi } from "../services/api";

// Default value so useAuth never crashes even if Provider isn't wrapped properly
const defaultAuthValue = {
  token: null,
  user: null,
  loading: false,
  error: null,
  // default login does nothing and returns false
  login: async () => false,
  // default logout does nothing
  logout: () => {},
  isAuthenticated: false,
};

// Create the context with safe default value
const AuthContext = createContext(defaultAuthValue);

export const AuthProvider = ({ children }) => {
  // Initialize token from localStorage so refresh keeps user logged in
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  // Initialize user from localStorage (stored as JSON string)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false); // for login in progress
  const [error, setError] = useState(null); // for login errors

  // Login function - calls backend and stores token & user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginApi(email, password);
      console.log("Raw login response (AuthContext):", res.data);

      // Be flexible with response shape:
      // - { success, data: { token, user } }
      // - { token, user }
      const body = res.data || {};
      const data = body.data || body;

      const jwtToken = data.token;
      const userData = data.user;

      console.log("Parsed token (AuthContext):", jwtToken);
      console.log("Parsed user (AuthContext):", userData);

      if (!jwtToken) {
        throw new Error("Token not found in response");
      }

      // Update state
      setToken(jwtToken);
      setUser(userData || null);

      // Persist in localStorage
      localStorage.setItem("token", jwtToken);
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        localStorage.removeItem("user");
      }

      return true; // success
    } catch (err) {
      console.error("Login error in AuthContext:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";
      setError(message);
      return false; // failure
    } finally {
      setLoading(false);
    }
  };

  // Logout function - clear everything
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    token,
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Simple hook, no throwing – always returns *something*
export const useAuth = () => useContext(AuthContext);
