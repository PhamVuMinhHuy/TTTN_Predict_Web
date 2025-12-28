const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login/`,
  PROFILE: `${API_BASE_URL}/auth/profile/`,
  PREDICT: `${API_BASE_URL}/api/predict/`,
  PREDICTION_HISTORY: `${API_BASE_URL}/api/predictions/history/`,
  DELETE_PREDICTION: (predictionId) => `${API_BASE_URL}/api/predictions/${predictionId}/`,
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users/`,
  ADMIN_CLASSES: `${API_BASE_URL}/api/admin/classes/`,
  TEACHER_STUDENTS: `${API_BASE_URL}/api/teacher/students/`,
  TEACHER_PREDICT: `${API_BASE_URL}/api/teacher/predict/`,
  TEACHER_SAVE_SCORES: `${API_BASE_URL}/api/teacher/save-scores/`,
  TEACHER_ALL_SCORES: `${API_BASE_URL}/api/teacher/all-scores/`,
  TEACHER_PREDICTION_HISTORY: `${API_BASE_URL}/api/teacher/prediction-history/`,
  TEACHER_SEND_PREDICTION_EMAIL: `${API_BASE_URL}/api/teacher/send-prediction-email/`,
  TEACHER_SCORES: `${API_BASE_URL}/api/teacher/scores/`,
  SCORE_STUDENT_HISTORY: `${API_BASE_URL}/api/score-students/history/`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password/`,
  VERIFY_OTP: `${API_BASE_URL}/api/auth/verify-otp/`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password/`,
};

export { API_BASE_URL };
