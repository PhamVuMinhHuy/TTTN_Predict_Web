import { API_ENDPOINTS } from "../config/api.js";

class AuthService {
  async login(credentials) {
    try {
      // Gửi email đầy đủ hoặc username - backend sẽ tự động tìm bằng cả hai
      const loginIdentifier = credentials.email || credentials.username;
      console.log("DEBUG: Login attempt with identifier:", loginIdentifier);
      
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: loginIdentifier, // Gửi email đầy đủ hoặc username - backend hỗ trợ cả hai
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

  async getUserProfile() {
    try {
      let token = localStorage.getItem("token");
      console.log("DEBUG: getUserProfile - Token from localStorage (raw):", token ? `${token.substring(0, 50)}...` : "null");
      
      if (!token) {
        console.log("DEBUG: getUserProfile - No token found");
        throw new Error("No authentication token found");
      }

      // Loại bỏ dấu ngoặc kép nếu có (trim và remove quotes)
      token = token.trim().replace(/^["']|["']$/g, '');
      console.log("DEBUG: getUserProfile - Token after cleanup:", token ? `${token.substring(0, 50)}...` : "null");

      console.log("DEBUG: getUserProfile - Making request to:", API_ENDPOINTS.PROFILE);
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("DEBUG: getUserProfile - Response status:", response.status);
      console.log("DEBUG: getUserProfile - Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log("DEBUG: getUserProfile - Error data:", errorData);
        
        if (response.status === 401) {
          // Token expired or invalid
          console.log("DEBUG: getUserProfile - 401 Unauthorized, clearing tokens");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          throw new Error("Authentication expired. Please login again.");
        }
        throw new Error(errorData.error || errorData.details || "Failed to fetch user profile");
      }

      const data = await response.json();
      console.log("DEBUG: getUserProfile - Success, user data:", data);
      return { success: true, data };
    } catch (error) {
      console.log("DEBUG: getUserProfile - Exception:", error.message);
      return { success: false, error: error.message };
    }
  }
}

export const authService = new AuthService();
