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
      }

      console.log("DEBUG: PredictionService - Sending prediction request:", inputData);
      
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
}

export const predictionService = new PredictionService();

