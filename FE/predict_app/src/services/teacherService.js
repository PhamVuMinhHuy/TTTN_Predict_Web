import { API_ENDPOINTS } from "../config/api";

class TeacherService {
  async getStudents() {
    const rawToken = localStorage.getItem("token");
    if (!rawToken) {
      return { success: false, error: "No authentication token" };
    }

    const token = rawToken.replace(/^"|"$/g, "");

    try {
      const response = await fetch(API_ENDPOINTS.TEACHER_STUDENTS, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể tải danh sách học sinh");
      }

      return { success: true, data: data.students || [] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async predictForStudent(studentId, inputData) {
    const rawToken = localStorage.getItem("token");
    if (!rawToken) {
      return { success: false, error: "No authentication token" };
    }

    const token = rawToken.replace(/^"|"$/g, "");

    try {
      const response = await fetch(API_ENDPOINTS.TEACHER_PREDICT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student_id: studentId,
          ...inputData,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể dự đoán điểm");
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export const teacherService = new TeacherService();
