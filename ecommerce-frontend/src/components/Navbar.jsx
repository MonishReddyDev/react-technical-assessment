import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { itemCount, loadCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      loadCart().catch((err) =>
        console.error("Failed to load cart on navbar mount:", err)
      );
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/products" className="navbar-brand">
          MyShop
        </Link>

        <div className="navbar-links">
          {isAuthenticated && (
            <Link
              to="/products"
              className={
                "navbar-link" +
                (isActive("/products") ? " navbar-link-active" : "")
              }
            >
              Products
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/profile"
              className={
                "navbar-link" +
                (isActive("/profile") ? " navbar-link-active" : "")
              }
            >
              Profile
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/cart"
              className={
                "navbar-link" + (isActive("/cart") ? " navbar-link-active" : "")
              }
            >
              Cart{itemCount > 0 ? ` (${itemCount})` : ""}
            </Link>
          )}

          {!isAuthenticated && (
            <Link
              to="/login"
              className={
                "navbar-link" +
                (isActive("/login") ? " navbar-link-active" : "")
              }
            >
              Login
            </Link>
          )}

          {isAuthenticated && (
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
