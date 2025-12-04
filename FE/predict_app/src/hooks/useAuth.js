import { useState, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { authService } from "../services/authService";

export const useAuth = () => {
  const [user, setUser] = useLocalStorage("user", null);
  const [token, setToken] = useLocalStorage("token", null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      setError(null);

      try {
        const result = await authService.login(credentials);
        console.log("DEBUG: useAuth.login - result:", result);

        if (result.success) {
          setToken(result.data.access);

          const backendUser = result.data.user || {};
          const userData = {
            id: backendUser.id || Date.now(),
            email: backendUser.email || credentials.email,
            name:
              backendUser.name ||
              backendUser.username ||
              (backendUser.email && backendUser.email.split("@")[0]) ||
              credentials.email.split("@")[0],
            username: backendUser.username || null,
            role: backendUser.role || "student",
            class_name: backendUser.class_name || null,
          };

          setUser(userData);
          return { success: true };
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        const errorMessage = err.message || "Đăng nhập thất bại";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setUser, setToken]
  );

  const register = useCallback(
    async (userData) => {
      console.log("DEBUG: Starting registration for:", userData.email);
      setLoading(true);
      setError(null);

      try {
        const result = await authService.register(userData);
        console.log("DEBUG: Registration result:", result);

        if (result.success) {
          console.log("DEBUG: Registration successful, attempting auto-login");
          // Sau khi đăng ký thành công, tự động đăng nhập
          const loginResult = await login({
            email: userData.email,
            password: userData.password,
          });
          console.log("DEBUG: Auto-login result:", loginResult);
          return loginResult;
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        console.error("DEBUG: Registration error:", err);
        const errorMessage = err.message || "Đăng ký thất bại";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    // Redirect to login page
    window.location.href = '/auth';
  }, [setUser, setToken]);

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call - bạn có thể implement API cho forgot password sau
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!email) {
        throw new Error("Vui lòng nhập email");
      }

      return { success: true, message: "Email khôi phục mật khẩu đã được gửi" };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    clearError: () => setError(null),
  };
};
