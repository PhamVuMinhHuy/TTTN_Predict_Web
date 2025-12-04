const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login/`,
  REGISTER: `${API_BASE_URL}/auth/register/`,
  PROFILE: `${API_BASE_URL}/auth/profile/`,
  PREDICT: `${API_BASE_URL}/api/predict/`,
  PREDICTION_HISTORY: `${API_BASE_URL}/api/predictions/history/`,
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users/`,
  TEACHER_STUDENTS: `${API_BASE_URL}/api/teacher/students/`,
  TEACHER_PREDICT: `${API_BASE_URL}/api/teacher/predict/`,
  TEACHER_SAVE_SCORES: `${API_BASE_URL}/api/teacher/save-scores/`,
  TEACHER_ALL_SCORES: `${API_BASE_URL}/api/teacher/all-scores/`,
  TEACHER_PREDICTION_HISTORY: `${API_BASE_URL}/api/teacher/prediction-history/`,
  SCORE_STUDENT_HISTORY: `${API_BASE_URL}/api/score-students/history/`,
};

export { API_BASE_URL };
