import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Protected Route Component - Chỉ cho phép user đã đăng nhập
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log("DEBUG: ProtectedRoute - user:", user, "loading:", loading);

  // Nếu đang loading thì chờ
  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!user) {
    console.log("DEBUG: ProtectedRoute - redirecting to auth");
    return <Navigate to="/auth?mode=login" replace />;
  }

  console.log("DEBUG: ProtectedRoute - allowing access");
  return children;
};

// Public Route Component - Chỉ cho phép user chưa đăng nhập
export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log("DEBUG: PublicRoute - user:", user, "loading:", loading);

  // Nếu đang loading thì chờ
  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (user) {
    console.log("DEBUG: PublicRoute - redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("DEBUG: PublicRoute - allowing access");
  return children;
};
