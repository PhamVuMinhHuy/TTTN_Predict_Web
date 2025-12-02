import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { teacherService } from "../services/teacherService";
import {
  teacherPage,
  teacherTopBar,
  logoutIconButton,
  teacherContainer,
  teacherTitle,
  teacherSubtitle,
  tableCard,
  tableBase,
  th,
  td,
  modalBackdrop,
  modalContainer,
  modalHeader,
  smallButton,
  inputField,
  miniTh,
  miniTd,
} from "../assets/styles/teacher.styles";

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal and form state
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formValues, setFormValues] = useState({
    studyHoursPerWeek: "",
    attendanceRate: "",
    pastExamScores: "",
    parentalEducationLevel: "",
    internetAccessAtHome: "",
    extracurricularActivities: "",
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      const result = await teacherService.getStudents();
      if (result.success) setStudents(result.data);
      else setError(result.error);
      setLoading(false);
    };
    fetchStudents();
  }, []);

  if (!user || user.role !== "teacher") return null;

  const openModalForStudent = (student) => {
    setSelectedStudent(student);
    setFormValues({
      studyHoursPerWeek: "",
      attendanceRate: "",
      pastExamScores: "",
      parentalEducationLevel: "",
      internetAccessAtHome: "",
      extracurricularActivities: "",
    });
    setFormError(null);
    setPredictionResult(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitPredict = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    if (
      !formValues.studyHoursPerWeek ||
      !formValues.attendanceRate ||
      !formValues.pastExamScores ||
      !formValues.parentalEducationLevel ||
      !formValues.internetAccessAtHome ||
      !formValues.extracurricularActivities
    ) {
      setFormError("Vui lòng nhập đầy đủ các trường");
      return;
    }

    setFormError(null);
    setSubmitting(true);

    const result = await teacherService.predictForStudent(selectedStudent.id, {
      studyHoursPerWeek: parseFloat(formValues.studyHoursPerWeek),
      attendanceRate: parseFloat(formValues.attendanceRate),
      pastExamScores: parseFloat(formValues.pastExamScores),
      parentalEducationLevel: formValues.parentalEducationLevel,
      internetAccessAtHome: formValues.internetAccessAtHome,
      extracurricularActivities: formValues.extracurricularActivities,
    });

    if (result.success) {
      setPredictionResult(result.data);
      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudent.id
            ? {
                ...s,
                last_score: result.data.predictedScore,
                last_predicted_at: result.data.createdAt,
              }
            : s
        )
      );
    } else {
      setFormError(result.error);
      setPredictionResult(null);
    }

    setSubmitting(false);
  };

  return (
    <div style={teacherPage}>
      {/* Thanh top nhỏ chỉ có logout */}
      <div style={teacherTopBar}>
        <button onClick={logout} title="Đăng xuất" style={logoutIconButton}>
          ⏻
        </button>
      </div>

      <div style={teacherContainer}>
        <h1 style={teacherTitle}>Teacher Dashboard</h1>
        <p style={teacherSubtitle}>
          Quản lý học sinh trong lớp:{" "}
          <strong>{user.class_name || "(chưa có lớp)"}</strong>
        </p>

        {loading ? (
          <div>Đang tải danh sách học sinh...</div>
        ) : error ? (
          <div style={{ color: "#b91c1c" }}>Lỗi: {error}</div>
        ) : students.length === 0 ? (
          <div>Chưa có học sinh nào trong lớp.</div>
        ) : (
          <div style={tableCard}>
            <table style={tableBase}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  <th style={th}>Username</th>
                  <th style={th}>Họ tên</th>
                  <th style={th}>Email</th>
                  <th style={th}>Lớp</th>
                  <th style={th}>Điểm gần nhất</th>
                  <th style={th}>Thời gian</th>
                  <th style={th}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const fullName = `${s.first_name || ""} ${
                    s.last_name || ""
                  }`.trim();
                  return (
                    <tr key={s.id}>
                      <td style={td}>{s.username}</td>
                      <td style={td}>{fullName || "-"}</td>
                      <td style={td}>{s.email || "-"}</td>
                      <td style={td}>{s.class_name || "-"}</td>
                      <td style={td}>
                        {s.last_score !== null && s.last_score !== undefined
                          ? Number(s.last_score).toFixed(2)
                          : "-"}
                      </td>
                      <td style={td}>
                        {s.last_predicted_at
                          ? new Date(s.last_predicted_at).toLocaleString(
                              "vi-VN"
                            )
                          : "-"}
                      </td>
                      <td style={td}>
                        <button
                          style={smallButton}
                          onClick={() => openModalForStudent(s)}
                        >
                          Dự đoán & bảng điểm
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selectedStudent && (
        <div style={modalBackdrop} onClick={closeModal}>
          <div style={modalContainer} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeader}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                Dự đoán cho học sinh: {selectedStudent.username} (
                {selectedStudent.class_name || "-"})
              </h2>
              <button
                onClick={closeModal}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmitPredict}
              style={{ display: "grid", gap: "0.75rem" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <label>Thời gian học/tuần (giờ)</label>
                  <input
                    type="number"
                    name="studyHoursPerWeek"
                    value={formValues.studyHoursPerWeek}
                    onChange={handleFormChange}
                    min="0"
                    max="168"
                    step="0.5"
                    style={inputField}
                  />
                </div>
                <div>
                  <label>Tỉ lệ có mặt (%)</label>
                  <input
                    type="number"
                    name="attendanceRate"
                    value={formValues.attendanceRate}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    step="0.1"
                    style={inputField}
                  />
                </div>
                <div>
                  <label>Điểm thi trước đó (0-100)</label>
                  <input
                    type="number"
                    name="pastExamScores"
                    value={formValues.pastExamScores}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    step="0.1"
                    style={inputField}
                  />
                </div>
                <div>
                  <label>Trình độ phụ huynh</label>
                  <select
                    name="parentalEducationLevel"
                    value={formValues.parentalEducationLevel}
                    onChange={handleFormChange}
                    style={inputField}
                  >
                    <option value="">-- Chọn --</option>
                    <option value="HighSchool">HighSchool</option>
                    <option value="Bachelors">Bachelors</option>
                    <option value="Masters">Masters</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
                <div>
                  <label>Internet tại nhà</label>
                  <select
                    name="internetAccessAtHome"
                    value={formValues.internetAccessAtHome}
                    onChange={handleFormChange}
                    style={inputField}
                  >
                    <option value="">-- Chọn --</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label>Hoạt động ngoại khóa</label>
                  <select
                    name="extracurricularActivities"
                    value={formValues.extracurricularActivities}
                    onChange={handleFormChange}
                    style={inputField}
                  >
                    <option value="">-- Chọn --</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div style={{ color: "#b91c1c", fontSize: "0.9rem" }}>
                  Lỗi: {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  backgroundColor: submitting ? "#9ca3af" : "#10b981",
                  color: "#fff",
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Đang dự đoán..." : "📊 Dự đoán điểm"}
              </button>
            </form>

            {predictionResult && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                  Kết quả dự đoán: {predictionResult.predictedScore}/100
                </div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.85rem",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={miniTh}>Thời gian học</th>
                      <th style={miniTh}>Tỉ lệ có mặt</th>
                      <th style={miniTh}>Điểm trước</th>
                      <th style={miniTh}>Trình độ PH</th>
                      <th style={miniTh}>Internet</th>
                      <th style={miniTh}>Ngoại khóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={miniTd}>
                        {predictionResult.inputData.studyHoursPerWeek}
                      </td>
                      <td style={miniTd}>
                        {predictionResult.inputData.attendanceRate}%
                      </td>
                      <td style={miniTd}>
                        {predictionResult.inputData.pastExamScores}
                      </td>
                      <td style={miniTd}>
                        {predictionResult.inputData.parentalEducationLevel}
                      </td>
                      <td style={miniTd}>
                        {predictionResult.inputData.internetAccessAtHome}
                      </td>
                      <td style={miniTd}>
                        {predictionResult.inputData.extracurricularActivities}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
