import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  // You can also handle a loading state here if you want
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render any child route(s)
  return <Outlet />;
};

export default ProtectedRoute;
