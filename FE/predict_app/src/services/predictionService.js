import { API_ENDPOINTS } from "../config/api.js";

class PredictionService {
  async predict(inputData) {
    try {
      const token = localStorage.getItem("token");
      
      const headers = {
        "Content-Type": "application/json",
      };
      
      // Thêm token nếu có (optional - có thể public API)
      if (token) {
        const cleanToken = token.trim().replace(/^["']|["']$/g, '');
        headers.Authorization = `Bearer ${cleanToken}`;
        console.log("DEBUG: PredictionService - Token found, adding to headers");
      } else {
        console.log("DEBUG: PredictionService - No token found in localStorage");
      }

      console.log("DEBUG: PredictionService - Sending prediction request:", inputData);
      console.log("DEBUG: PredictionService - Headers:", headers);
      
      const response = await fetch(API_ENDPOINTS.PREDICT, {
        method: "POST",
        headers,
        body: JSON.stringify(inputData),
      });

      console.log("DEBUG: PredictionService - Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log("DEBUG: PredictionService - Error data:", errorData);
        throw new Error(errorData.error || errorData.details || "Failed to get prediction");
      }

      const data = await response.json();
      console.log("DEBUG: PredictionService - Prediction result:", data);
      return { success: true, data };
    } catch (error) {
      console.error("DEBUG: PredictionService - Exception:", error);
      return { success: false, error: error.message };
    }
  }

  async getHistory(limit = 50, offset = 0) {
    try {
      const rawToken = localStorage.getItem("token");
      const token = rawToken ? rawToken.replace(/^"|"$/g, '') : null;

      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = new URL(API_ENDPOINTS.PREDICTION_HISTORY);
      url.searchParams.append('limit', limit.toString());
      url.searchParams.append('offset', offset.toString());

      console.log("DEBUG: PredictionService - Fetching history from:", url.toString());

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("DEBUG: PredictionService - History response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log("DEBUG: PredictionService - Error data:", errorData);

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          throw new Error("Authentication expired. Please login again.");
        }
        throw new Error(errorData.error || errorData.details || "Failed to get prediction history");
      }

      const data = await response.json();
      console.log("DEBUG: PredictionService - History result:", data);
      return { success: true, data };
    } catch (error) {
      console.error("DEBUG: PredictionService - Exception:", error);
      return { success: false, error: error.message };
    }
  }
}

export const predictionService = new PredictionService();

