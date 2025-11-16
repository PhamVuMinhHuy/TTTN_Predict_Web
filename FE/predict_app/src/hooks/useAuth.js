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

        if (result.success) {
          // Lưu token
          setToken(result.data.access);

          // Đảm bảo user object có đầy đủ thông tin
          const userData = result.data.user || {
            id: Date.now(), // Temporary ID until backend returns user ID
            email: credentials.email,
            name: credentials.email.split("@")[0], // Tạo tên từ email
            role: "student",
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
      setLoading(true);
      setError(null);

      try {
        const result = await authService.register(userData);

        if (result.success) {
          // Sau khi đăng ký thành công, tự động đăng nhập
          const loginResult = await login({
            email: userData.email,
            password: userData.password,
          });

          return loginResult;
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
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
