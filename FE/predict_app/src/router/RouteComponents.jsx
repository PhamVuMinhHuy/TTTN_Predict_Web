import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Protected Route Component - Chỉ cho phép user đã đăng nhập
export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }
  
  return children;
};

// Public Route Component - Chỉ cho phép user chưa đăng nhập
export const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};