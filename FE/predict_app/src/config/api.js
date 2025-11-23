const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login/`,
  REGISTER: `${API_BASE_URL}/auth/register/`,
  PROFILE: `${API_BASE_URL}/auth/profile/`,
  PREDICT: `${API_BASE_URL}/api/predict/`,
  PREDICTION_HISTORY: `${API_BASE_URL}/api/predictions/history/`,
};

export { API_BASE_URL };
