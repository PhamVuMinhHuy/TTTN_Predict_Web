import { API_ENDPOINTS } from "../config/api";

class ScoreStudentService {
  async getHistory(limit = 50, offset = 0) {
    const rawToken = localStorage.getItem("token");
    const token = rawToken ? rawToken.replace(/^"|"$/g, "") : null;

    if (!token) {
      return { success: false, error: "No authentication token found" };
    }

    try {
      const url = new URL(API_ENDPOINTS.SCORE_STUDENT_HISTORY);
      url.searchParams.append("limit", limit.toString());
      url.searchParams.append("offset", offset.toString());

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          throw new Error("Authentication expired. Please login again.");
        }
        throw new Error(
          errorData.error || errorData.details || "Failed to get score history"
        );
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export const scoreStudentService = new ScoreStudentService();
