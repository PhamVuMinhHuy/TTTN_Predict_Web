import { API_ENDPOINTS } from "../config/api.js";

class AuthService {
  async login(credentials) {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: credentials.email.split("@")[0], // Sử dụng phần trước @ làm username
          Password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error || "Đăng nhập thất bại");
      }

      return {
        success: true,
        data: {
          access: data.access,
          refresh: data.refresh,
          user: data.user,
          message: data.message,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async register(userData) {
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: userData.email.split("@")[0],
          Password: userData.password,
          Email: userData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.Username?.[0] ||
            data.Email?.[0] ||
            data.error ||
            "Đăng ký thất bại"
        );
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export const authService = new AuthService();
