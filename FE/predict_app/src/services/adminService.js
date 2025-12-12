import { API_ENDPOINTS } from "../config/api.js";

class AdminService {
  async getUsers({ page = 1, limit = 10, search = "" } = {}) {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, error: "No authentication token" };
    }

    try {
      // Build URL with query params
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (search) {
        params.append("search", search);
      }
      
      const url = `${API_ENDPOINTS.ADMIN_USERS}?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim().replace(/^["']|["']$/g, "")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể tải danh sách người dùng");
      }

      return { 
        success: true, 
        data: data.users || [],
        pagination: data.pagination || null,
        statistics: data.statistics || null
      };
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

  // ============ QUẢN LÝ LỚP ============

  async getClasses() {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, error: "No authentication token" };
    }

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_CLASSES, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim().replace(/^["']|["']$/g, "")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể tải danh sách lớp");
      }

      return { success: true, data: data.classes || [] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async createClass(className) {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, error: "No authentication token" };
    }

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_CLASSES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim().replace(/^["']|["']$/g, "")}`,
        },
        body: JSON.stringify({ name: className }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể tạo lớp");
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async deleteClass(classId) {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, error: "No authentication token" };
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN_CLASSES}${classId}/`, {
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
        throw new Error(data.error || "Không thể xóa lớp");
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export const adminService = new AdminService();
