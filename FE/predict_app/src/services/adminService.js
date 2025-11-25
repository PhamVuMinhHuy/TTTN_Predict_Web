import { API_ENDPOINTS } from "../config/api.js";

class AdminService {
  async getUsers() {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, error: "No authentication token" };
    }

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_USERS, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim().replace(/^["']|["']$/g, "")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể tải danh sách người dùng");
      }

      return { success: true, data: data.users || [] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async createUser(userData) {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, error: "No authentication token" };
    }

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_USERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim().replace(/^["']|["']$/g, "")}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể tạo người dùng");
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async deleteUser(userId) {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, error: "No authentication token" };
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN_USERS}${userId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.trim().replace(/^["']|["']$/g, "")}`,
        },
      });

      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể xóa người dùng");
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export const adminService = new AdminService();
