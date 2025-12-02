import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { teacherService } from "../services/teacherService";
import {
  dashboardPage,
  dashboardContainer,
  header,
  headerLeft,
  headerTitle,
  headerSubtitle,
  headerRight,
  userInfo,
  logoutBtn,
  logoutBtnHover,
  contentArea,
  tableContainer,
  table,
  tableHead,
  th,
  td,
  tableRow,
  tableRowHover,
  formGrid,
  formGroup,
  label,
  input,
  inputFocus,
  select,
  btnPrimary,
  btnPrimaryHover,
  btnSecondary,
  btnSecondaryHover,
  modalBackdrop,
  modal,
  modalHeader,
  modalTitle,
  closeBtn,
  closeBtnHover,
  emptyState,
  emptyStateIcon,
  emptyStateText,
  loadingContainer,
  searchContainer,
  searchInput,
} from "../assets/styles/teacherDashboard.styles";

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hoverStates, setHoverStates] = useState({});

  // Data states
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  // Modal states
  const [showPredictModal, setShowPredictModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form states
  const [searchTerm, setSearchTerm] = useState("");
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
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    const result = await teacherService.getStudents();
    if (result.success) {
      setStudents(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleHover = (key, value) => {
    setHoverStates((prev) => ({ ...prev, [key]: value }));
  };

  const openPredictModal = (student) => {
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
    setShowPredictModal(true);
  };

  const closePredictModal = () => {
    setShowPredictModal(false);
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

  if (!user || user.role !== "teacher") return null;

  const filteredStudents = students.filter(
    (s) =>
      s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${s.first_name} ${s.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div style={dashboardPage}>
      <div style={dashboardContainer}>
        {/* Header */}
        <div style={header}>
          <div style={headerLeft}>
            <h1 style={headerTitle}>Teacher Dashboard</h1>
            <p style={headerSubtitle}>
              Lớp: <strong>{user.class_name || "(chưa có lớp)"}</strong>
            </p>
          </div>
          <div style={headerRight}>
            <div style={userInfo}>
              <span>👨‍🏫</span>
              <span>{user.username}</span>
            </div>
            <button
              onClick={logout}
              style={{
                ...logoutBtn,
                ...(hoverStates.logout ? logoutBtnHover : {}),
              }}
              onMouseEnter={() => handleHover("logout", true)}
              onMouseLeave={() => handleHover("logout", false)}
            >
              🚪 Đăng xuất
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={contentArea}>
          {loading ? (
            <div style={loadingContainer}>
              <div style={{ fontSize: "3rem" }}>⏳</div>
              <div>Đang tải dữ liệu...</div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                  Danh sách học sinh
                </h2>
              </div>

              <div style={searchContainer}>
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm học sinh..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={searchInput}
                />
              </div>

              {error ? (
                <div style={{ ...emptyState, color: "#ef4444" }}>
                  <div style={emptyStateIcon}>⚠️</div>
                  <div style={emptyStateText}>Lỗi: {error}</div>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div style={emptyState}>
                  <div style={emptyStateIcon}>👥</div>
                  <div style={emptyStateText}>Không tìm thấy học sinh</div>
                </div>
              ) : (
                <div style={tableContainer}>
                  <table style={table}>
                    <thead style={tableHead}>
                      <tr>
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
                      {filteredStudents.map((student) => {
                        const fullName = `${student.first_name || ""} ${
                          student.last_name || ""
                        }`.trim();
                        return (
                          <tr
                            key={student.id}
                            style={{
                              ...tableRow,
                              ...(hoverStates[`row-${student.id}`]
                                ? tableRowHover
                                : {}),
                            }}
                            onMouseEnter={() =>
                              setHoverStates((p) => ({
                                ...p,
                                [`row-${student.id}`]: true,
                              }))
                            }
                            onMouseLeave={() =>
                              setHoverStates((p) => ({
                                ...p,
                                [`row-${student.id}`]: false,
                              }))
                            }
                          >
                            <td style={td}>{student.username}</td>
                            <td style={td}>{fullName || "-"}</td>
                            <td style={td}>{student.email || "-"}</td>
                            <td style={td}>{student.class_name || "-"}</td>
                            <td style={td}>
                              {student.last_score !== null &&
                              student.last_score !== undefined
                                ? Number(student.last_score).toFixed(2)
                                : "-"}
                            </td>
                            <td style={td}>
                              {student.last_predicted_at
                                ? new Date(
                                    student.last_predicted_at
                                  ).toLocaleString("vi-VN")
                                : "-"}
                            </td>
                            <td style={td}>
                              <button
                                onClick={() => openPredictModal(student)}
                                style={{
                                  ...btnPrimary,
                                  ...(hoverStates[`btn-${student.id}`]
                                    ? btnPrimaryHover
                                    : {}),
                                }}
                                onMouseEnter={() =>
                                  setHoverStates((p) => ({
                                    ...p,
                                    [`btn-${student.id}`]: true,
                                  }))
                                }
                                onMouseLeave={() =>
                                  setHoverStates((p) => ({
                                    ...p,
                                    [`btn-${student.id}`]: false,
                                  }))
                                }
                              >
                                Dự đoán điểm
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
          )}
        </div>
      </div>

      {/* Prediction Modal */}
      {showPredictModal && selectedStudent && (
        <div style={modalBackdrop} onClick={closePredictModal}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeader}>
              <h2 style={modalTitle}>
                Dự đoán cho học sinh: {selectedStudent.username} (
                {selectedStudent.class_name || "-"})
              </h2>
              <button
                onClick={closePredictModal}
                style={{
                  ...closeBtn,
                  ...(hoverStates.closeModal ? closeBtnHover : {}),
                }}
                onMouseEnter={() => handleHover("closeModal", true)}
                onMouseLeave={() => handleHover("closeModal", false)}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmitPredict}
              style={{ display: "grid", gap: "0.75rem" }}
            >
              <div style={formGrid}>
                <div style={formGroup}>
                  <label style={label}>Thời gian học/tuần (giờ) *</label>
                  <input
                    type="number"
                    name="studyHoursPerWeek"
                    value={formValues.studyHoursPerWeek}
                    onChange={handleFormChange}
                    min="0"
                    max="168"
                    step="0.5"
                    style={input}
                    required
                  />
                </div>
                <div style={formGroup}>
                  <label style={label}>Tỉ lệ có mặt (%) *</label>
                  <input
                    type="number"
                    name="attendanceRate"
                    value={formValues.attendanceRate}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    step="0.1"
                    style={input}
                    required
                  />
                </div>
                <div style={formGroup}>
                  <label style={label}>Điểm thi trước đó (0-100) *</label>
                  <input
                    type="number"
                    name="pastExamScores"
                    value={formValues.pastExamScores}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    step="0.1"
                    style={input}
                    required
                  />
                </div>
                <div style={formGroup}>
                  <label style={label}>Trình độ phụ huynh *</label>
                  <select
                    name="parentalEducationLevel"
                    value={formValues.parentalEducationLevel}
                    onChange={handleFormChange}
                    style={select}
                    required
                  >
                    <option value="">-- Chọn --</option>
                    <option value="HighSchool">HighSchool</option>
                    <option value="Bachelors">Bachelors</option>
                    <option value="Masters">Masters</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
                <div style={formGroup}>
                  <label style={label}>Internet tại nhà *</label>
                  <select
                    name="internetAccessAtHome"
                    value={formValues.internetAccessAtHome}
                    onChange={handleFormChange}
                    style={select}
                    required
                  >
                    <option value="">-- Chọn --</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div style={formGroup}>
                  <label style={label}>Hoạt động ngoại khóa *</label>
                  <select
                    name="extracurricularActivities"
                    value={formValues.extracurricularActivities}
                    onChange={handleFormChange}
                    style={select}
                    required
                  >
                    <option value="">-- Chọn --</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div style={{ color: "#ef4444", fontSize: "0.9rem" }}>
                  Lỗi: {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...btnPrimary,
                  ...(submitting ? { opacity: 0.6, cursor: "not-allowed" } : {}),
                  ...(hoverStates.submitBtn && !submitting
                    ? btnPrimaryHover
                    : {}),
                }}
                onMouseEnter={() => handleHover("submitBtn", true)}
                onMouseLeave={() => handleHover("submitBtn", false)}
              >
                {submitting ? "Đang dự đoán..." : "📊 Dự đoán điểm"}
              </button>
            </form>

            {predictionResult && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                  border: "2px solid #10b981",
                }}
              >
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "1.2rem",
                    marginBottom: "0.75rem",
                    color: "#065f46",
                  }}
                >
                  🎯 Kết quả dự đoán: {predictionResult.predictedScore}/100
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "0.5rem",
                    fontSize: "0.85rem",
                    color: "#047857",
                  }}
                >
                  <div>
                    <strong>Thời gian học:</strong>{" "}
                    {predictionResult.inputData.studyHoursPerWeek}h
                  </div>
                  <div>
                    <strong>Tỉ lệ có mặt:</strong>{" "}
                    {predictionResult.inputData.attendanceRate}%
                  </div>
                  <div>
                    <strong>Điểm trước:</strong>{" "}
                    {predictionResult.inputData.pastExamScores}
                  </div>
                  <div>
                    <strong>Trình độ PH:</strong>{" "}
                    {predictionResult.inputData.parentalEducationLevel}
                  </div>
                  <div>
                    <strong>Internet:</strong>{" "}
                    {predictionResult.inputData.internetAccessAtHome}
                  </div>
                  <div>
                    <strong>Ngoại khóa:</strong>{" "}
                    {predictionResult.inputData.extracurricularActivities}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
