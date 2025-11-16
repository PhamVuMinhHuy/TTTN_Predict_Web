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
      console.log("DEBUG: authService.register called with:", userData);

      const payload = {
        Username: userData.email.split("@")[0],
        Password: userData.password,
        Email: userData.email,
        Name: userData.name,
      };

      console.log("DEBUG: Sending payload to API:", payload);
      console.log("DEBUG: API endpoint:", API_ENDPOINTS.REGISTER);

      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("DEBUG: Response status:", response.status);
      console.log("DEBUG: Response ok:", response.ok);

      const data = await response.json();
      console.log("DEBUG: Response data:", data);

      if (!response.ok) {
        const errorMessage =
          data.Username?.[0] ||
          data.Email?.[0] ||
          data.Name?.[0] ||
          data.error ||
          "Đăng ký thất bại";
        console.log("DEBUG: Registration failed with error:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("DEBUG: Registration successful");
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("DEBUG: authService.register error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export const authService = new AuthService();
