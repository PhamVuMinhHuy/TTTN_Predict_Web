import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Protected Route Component - Chỉ cho phép user đã đăng nhập
export const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  console.log(
    "DEBUG: ProtectedRoute - user:",
    user,
    "token:",
    token ? "exists" : "null",
    "loading:",
    loading
  );

  // Nếu đang loading thì chờ
  if (loading) {
    return <div>Đang tải...</div>;
  }

  // Kiểm tra token từ localStorage (fallback)
  const tokenFromStorage = localStorage.getItem("token");
  const hasToken = token || tokenFromStorage;

  // Cho phép vào nếu có token (ngay cả khi chưa có user - user sẽ được load từ API)
  if (!hasToken) {
    console.log("DEBUG: ProtectedRoute - No token found, redirecting to auth");
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

// Admin Route Component - Chỉ cho phép user đã đăng nhập và có vai trò admin
export const AdminRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <div>Đang tải...</div>;
  }

  const tokenFromStorage = localStorage.getItem("token");
  const hasToken = token || tokenFromStorage;

  if (!hasToken) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};
