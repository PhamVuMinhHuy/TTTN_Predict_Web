import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { teacherService } from "../services/teacherService";
import { styles } from "../../assets/styles/teacherDashboard.styles";

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  
  // Tab state
  const [activeTab, setActiveTab] = useState("overview");
  
  // Data states
  const [students, setStudents] = useState([]);
  const [allScores, setAllScores] = useState([]);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [showPredictModal, setShowPredictModal] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [showEditScoreModal, setShowEditScoreModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedScore, setSelectedScore] = useState(null);
  
  // Toast notification
  const [toast, setToast] = useState(null);
  
  // Form states
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
  
  // Hover states
  const [hoveredSidebar, setHoveredSidebar] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoverLogout, setHoverLogout] = useState(false);
  const [hoverPredict, setHoverPredict] = useState(null);
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [hoverClose, setHoverClose] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    loadStudents();
    // Load allScores cho cả overview và grades tab
    if (activeTab === "overview" || activeTab === "grades") {
      loadAllScores();
    }
    if (activeTab === "predictions") {
      loadPredictionHistory();
    }
  }, [activeTab]);

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

  const loadAllScores = async () => {
    setLoading(true);
    setError(null);
    const result = await teacherService.getAllScores();
    if (result.success) {
      setAllScores(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const loadPredictionHistory = async () => {
    setLoading(true);
    setError(null);
    const result = await teacherService.getPredictionHistory();
    if (result.success) {
      setPredictionHistory(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // Statistics
  const statistics = useMemo(() => {
    const totalStudents = students.length;
    
    // Đếm số học sinh đã có điểm trong bảng điểm (có mảng scores không rỗng)
    const studentsWithScores = allScores.filter(
      (student) => student.scores && student.scores.length > 0
    ).length;
    
    const avgScore =
      studentsWithScores > 0
        ? students
            .filter((s) => s.last_score !== null && s.last_score !== undefined)
            .reduce((sum, s) => sum + Number(s.last_score), 0) / studentsWithScores
        : 0;
    const recentPredictions = students.filter((s) => s.last_predicted_at).length;

    return { totalStudents, studentsWithScores, avgScore, recentPredictions };
  }, [students, allScores]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const query = searchTerm.toLowerCase();
    return students.filter(
      (s) =>
        s.username?.toLowerCase().includes(query) ||
        s.first_name?.toLowerCase().includes(query) ||
        s.last_name?.toLowerCase().includes(query) ||
        s.email?.toLowerCase().includes(query) ||
        s.class_name?.toLowerCase().includes(query)
    );
  }, [students, searchTerm]);

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

  const openInputModal = (student) => {
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
    setShowInputModal(true);
  };

  const closeInputModal = () => {
    setShowInputModal(false);
    setSelectedStudent(null);
  };

  const handleSubmitInput = async (e) => {
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

    const result = await teacherService.saveStudentScores(selectedStudent.id, {
      studyHoursPerWeek: parseFloat(formValues.studyHoursPerWeek),
      attendanceRate: parseFloat(formValues.attendanceRate),
      pastExamScores: parseFloat(formValues.pastExamScores),
      parentalEducationLevel: formValues.parentalEducationLevel,
      internetAccessAtHome: formValues.internetAccessAtHome,
      extracurricularActivities: formValues.extracurricularActivities,
    });

    if (result.success) {
      setPredictionResult({
        inputData: {
          studyHoursPerWeek: parseFloat(formValues.studyHoursPerWeek),
          attendanceRate: parseFloat(formValues.attendanceRate),
          pastExamScores: parseFloat(formValues.pastExamScores),
          parentalEducationLevel: formValues.parentalEducationLevel,
          internetAccessAtHome: formValues.internetAccessAtHome,
          extracurricularActivities: formValues.extracurricularActivities,
        },
      });
      // Reload grades data to update "Bảng điểm" tab
      loadAllScores();
    } else {
      setFormError(result.error);
      setPredictionResult(null);
    }

    setSubmitting(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeletePrediction = (predictionId) => {
    setConfirmMessage("Bạn có chắc chắn muốn xóa dự đoán này?");
    setConfirmAction(() => async () => {
      const result = await teacherService.deletePrediction(predictionId);
      if (result.success) {
        showToast("Đã xóa dự đoán thành công!", "success");
        loadPredictionHistory();
      } else {
        showToast("Lỗi: " + result.error, "error");
      }
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  // Edit Score Modal handlers
  const openEditScoreModal = (score, studentData) => {
    setSelectedScore({ ...score, studentName: studentData.firstName + " " + studentData.lastName || studentData.username });
    setFormValues({
      studyHoursPerWeek: score.studyHoursPerWeek?.toString() || "",
      attendanceRate: score.attendanceRate?.toString() || "",
      pastExamScores: score.pastExamScores?.toString() || "",
      parentalEducationLevel: score.parentalEducationLevel || "",
      internetAccessAtHome: score.internetAccessAtHome || "",
      extracurricularActivities: score.extracurricularActivities || "",
    });
    setFormError(null);
    setShowEditScoreModal(true);
  };

  const closeEditScoreModal = () => {
    setShowEditScoreModal(false);
    setSelectedScore(null);
  };

  const handleSubmitEditScore = async (e) => {
    e.preventDefault();
    if (!selectedScore) return;

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

    const result = await teacherService.updateScore(selectedScore.id, {
      studyHoursPerWeek: parseFloat(formValues.studyHoursPerWeek),
      attendanceRate: parseFloat(formValues.attendanceRate),
      pastExamScores: parseFloat(formValues.pastExamScores),
      parentalEducationLevel: formValues.parentalEducationLevel,
      internetAccessAtHome: formValues.internetAccessAtHome,
      extracurricularActivities: formValues.extracurricularActivities,
    });

    if (result.success) {
      showToast("Đã cập nhật điểm thành công!", "success");
      loadAllScores();
      closeEditScoreModal();
    } else {
      setFormError(result.error);
    }

    setSubmitting(false);
  };

  const handleDeleteScore = (scoreId) => {
    setConfirmMessage("Bạn có chắc chắn muốn xóa bản ghi điểm này?");
    setConfirmAction(() => async () => {
      const result = await teacherService.deleteScore(scoreId);
      if (result.success) {
        showToast("Đã xóa điểm thành công!", "success");
        loadAllScores();
      } else {
        showToast("Lỗi: " + result.error, "error");
      }
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  // State for tracking which prediction email is being sent
  const [sendingEmailId, setSendingEmailId] = useState(null);

  const handleSendPredictionEmail = async (predictionId) => {
    setSendingEmailId(predictionId);
    const result = await teacherService.sendPredictionEmail(predictionId);
    if (result.success) {
      showToast(`✉️ ${result.data.message}`, "success");
    } else {
      showToast("Lỗi: " + result.error, "error");
    }
    setSendingEmailId(null);
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

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>🎓</div>
          <div style={styles.logoText}>Teacher Portal</div>
        </div>

        <nav style={styles.nav}>
          <div
            onClick={() => setActiveTab("overview")}
            onMouseEnter={() => setHoveredSidebar("overview")}
            onMouseLeave={() => setHoveredSidebar(null)}
            style={{
              ...styles.navItem,
              ...(activeTab === "overview" ? styles.navItemActive : {}),
              ...(hoveredSidebar === "overview" && activeTab !== "overview"
                ? styles.navItemHover
                : {}),
            }}
          >
            <span style={styles.navIcon}>📊</span>
            <span>Tổng quan</span>
          </div>

          <div
            onClick={() => setActiveTab("students")}
            onMouseEnter={() => setHoveredSidebar("students")}
            onMouseLeave={() => setHoveredSidebar(null)}
            style={{
              ...styles.navItem,
              ...(activeTab === "students" ? styles.navItemActive : {}),
              ...(hoveredSidebar === "students" && activeTab !== "students"
                ? styles.navItemHover
                : {}),
            }}
          >
            <span style={styles.navIcon}>👥</span>
            <span>Học sinh</span>
          </div>

          <div
            onClick={() => setActiveTab("predictions")}
            onMouseEnter={() => setHoveredSidebar("predictions")}
            onMouseLeave={() => setHoveredSidebar(null)}
            style={{
              ...styles.navItem,
              ...(activeTab === "predictions" ? styles.navItemActive : {}),
              ...(hoveredSidebar === "predictions" && activeTab !== "predictions"
                ? styles.navItemHover
                : {}),
            }}
          >
            <span style={styles.navIcon}>🎯</span>
            <span>Dự đoán</span>
          </div>

          <div
            onClick={() => setActiveTab("grades")}
            onMouseEnter={() => setHoveredSidebar("grades")}
            onMouseLeave={() => setHoveredSidebar(null)}
            style={{
              ...styles.navItem,
              ...(activeTab === "grades" ? styles.navItemActive : {}),
              ...(hoveredSidebar === "grades" && activeTab !== "grades"
                ? styles.navItemHover
                : {}),
            }}
          >
            <span style={styles.navIcon}>📝</span>
            <span>Bảng điểm</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>
              {activeTab === "overview" && "📊 Tổng quan"}
              {activeTab === "students" && "👥 Quản lý học sinh"}
              {activeTab === "predictions" && "🎯 Dự đoán điểm"}
              {activeTab === "grades" && "📝 Bảng điểm học sinh"}
            </h1>
            <p style={styles.headerSubtitle}>
              {activeTab === "overview" && "Thống kê và tổng quan lớp học"}
              {activeTab === "students" && "Danh sách và quản lý học sinh"}
              {activeTab === "predictions" && "Lịch sử dự đoán điểm số"}
              {activeTab === "grades" && "Xem điểm đã nhập của học sinh"}
            </p>
          </div>
          
          {/* User Profile in Header */}
          <div style={styles.headerRight}>
            <div style={styles.headerUserProfile}>
              <div style={styles.headerUserAvatar}>👨‍🏫</div>
              <div style={styles.headerUserDetails}>
                <div style={styles.headerUserName}>{user.username}</div>
                {(user.first_name || user.last_name) && (
                  <div style={styles.headerUserFullName}>
                    {`${user.first_name || ""} ${user.last_name || ""}`.trim()}
                  </div>
                )}
                <div style={styles.headerUserRole}>Giáo viên</div>
                {user.class_name && (
                  <div style={styles.headerUserClass}>Lớp: {user.class_name}</div>
                )}
              </div>
            </div>
            <button
              onClick={logout}
              onMouseEnter={() => setHoverLogout(true)}
              onMouseLeave={() => setHoverLogout(false)}
              style={{
                ...styles.headerLogoutButton,
                ...(hoverLogout ? styles.headerLogoutButtonHover : {}),
              }}
            >
              🚪 Đăng xuất
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={styles.contentArea}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <div>Đang tải dữ liệu...</div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div>
                  {/* Statistics Cards */}
                  <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                      <div style={styles.statCardHeader}>
                        <div>
                          <div style={styles.statCardTitle}>Tổng học sinh</div>
                          <div style={styles.statCardValue}>
                            {statistics.totalStudents}
                          </div>
                        </div>
                        <div style={styles.statCardIconBlue}>
                          👥
                        </div>
                      </div>
                    </div>

                    <div style={styles.statCard}>
                      <div style={styles.statCardHeader}>
                        <div>
                          <div style={styles.statCardTitle}>Bảng điểm</div>
                          <div style={styles.statCardValue}>
                            {statistics.studentsWithScores}
                          </div>
                        </div>
                        <div style={styles.statCardIconGreen}>
                          📝
                        </div>
                      </div>
                    </div>

                    <div style={styles.statCard}>
                      <div style={styles.statCardHeader}>
                        <div>
                          <div style={styles.statCardTitle}>Dự đoán gần đây</div>
                          <div style={styles.statCardValue}>
                            {statistics.recentPredictions}
                          </div>
                        </div>
                        <div style={styles.statCardIconOrange}>
                          🎯
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div style={styles.quickActions}>
                    <h3 style={styles.sectionTitle}>Thao tác nhanh</h3>
                    <div style={styles.actionsGrid}>
                      <button
                        onClick={() => setActiveTab("students")}
                        style={styles.actionCard}
                      >
                        <div style={styles.actionIcon}>👥</div>
                        <div style={styles.actionTitle}>Xem học sinh</div>
                        <div style={styles.actionDesc}>
                          Danh sách {statistics.totalStudents} học sinh
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveTab("predictions")}
                        style={styles.actionCard}
                      >
                        <div style={styles.actionIcon}>🎯</div>
                        <div style={styles.actionTitle}>Dự đoán điểm</div>
                        <div style={styles.actionDesc}>
                          {statistics.recentPredictions} dự đoán gần đây
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Students Tab */}
              {activeTab === "students" && (
                <div>
                  {/* Search Bar */}
                  <div style={styles.searchContainer}>
                    <input
                      type="text"
                      placeholder="🔍 Tìm kiếm học sinh..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setFocusedField("search")}
                      onBlur={() => setFocusedField(null)}
                      style={{
                        ...styles.searchInput,
                        ...(focusedField === "search" ? styles.searchInputFocus : {}),
                      }}
                    />
                  </div>

                  {error ? (
                    <div style={styles.emptyState}>
                      <div style={styles.emptyIcon}>⚠️</div>
                      <div style={styles.emptyText}>Lỗi: {error}</div>
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div style={styles.emptyState}>
                      <div style={styles.emptyIcon}>👥</div>
                      <div style={styles.emptyText}>Không tìm thấy học sinh</div>
                    </div>
                  ) : (
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>
                        <thead>
                          <tr style={styles.tableHeadRow}>
                            <th style={styles.th}>Username</th>
                            <th style={styles.th}>Họ tên</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Lớp</th>
                            <th style={styles.th}>Điểm gần nhất</th>
                            <th style={styles.th}>Thời gian</th>
                            <th style={styles.th}>Hành động</th>
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
                                onMouseEnter={() => setHoveredRow(student.id)}
                                onMouseLeave={() => setHoveredRow(null)}
                                style={{
                                  ...styles.tableRow,
                                  ...(hoveredRow === student.id
                                    ? styles.tableRowHover
                                    : {}),
                                }}
                              >
                                <td style={styles.td}>
                                  <strong>{student.username}</strong>
                                </td>
                                <td style={styles.td}>{fullName || "-"}</td>
                                <td style={styles.td}>{student.email || "-"}</td>
                                <td style={styles.td}>{student.class_name || "-"}</td>
                                <td style={styles.td}>
                                  {student.last_score !== null &&
                                  student.last_score !== undefined
                                    ? Number(student.last_score).toFixed(2)
                                    : "-"}
                                </td>
                                <td style={styles.td}>
                                  {student.last_predicted_at
                                    ? new Date(
                                        student.last_predicted_at
                                      ).toLocaleString("vi-VN")
                                    : "-"}
                                </td>
                                <td style={styles.td}>
                                  <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button
                                      onClick={() => openInputModal(student)}
                                      onMouseEnter={() => setHoverPredict(`input-${student.id}`)}
                                      onMouseLeave={() => setHoverPredict(null)}
                                      style={{
                                        ...styles.predictButton,
                                        background: styles.greenGradient,
                                        ...(hoverPredict === `input-${student.id}`
                                          ? styles.predictButtonHover
                                          : {}),
                                      }}
                                    >
                                      ✏️ Nhập điểm
                                    </button>
                                    <button
                                      onClick={() => openPredictModal(student)}
                                      onMouseEnter={() => setHoverPredict(`predict-${student.id}`)}
                                      onMouseLeave={() => setHoverPredict(null)}
                                      style={{
                                        ...styles.predictButton,
                                        ...(hoverPredict === `predict-${student.id}`
                                          ? styles.predictButtonHover
                                          : {}),
                                      }}
                                    >
                                      🎯 Dự đoán
                                    </button>
                                  </div>
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

              {/* Predictions Tab */}
              {activeTab === "predictions" && (
                <div>
                  {error ? (
                    <div style={styles.emptyState}>
                      <div style={styles.emptyIcon}>⚠️</div>
                      <div style={styles.emptyText}>Lỗi: {error}</div>
                    </div>
                  ) : predictionHistory.length === 0 ? (
                    <div style={styles.emptyState}>
                      <div style={styles.emptyIcon}>🎯</div>
                      <div style={styles.emptyText}>
                        Chưa có lịch sử dự đoán
                      </div>
                      <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#6b7280" }}>
                        Chuyển sang tab "Học sinh" để thực hiện dự đoán
                      </div>
                    </div>
                  ) : (
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>
                        <thead>
                          <tr style={styles.tableHeadRow}>
                            <th style={styles.th}>Học sinh</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Lớp</th>
                            <th style={styles.th}>Giờ học/tuần</th>
                            <th style={styles.th}>Tỉ lệ có mặt</th>
                            <th style={styles.th}>Điểm trước</th>
                            <th style={styles.th}>Điểm dự đoán</th>
                            <th style={styles.th}>Thời gian</th>
                            <th style={styles.th}>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {predictionHistory.map((pred) => (
                            <tr
                              key={pred.id}
                              onMouseEnter={() => setHoveredRow(pred.id)}
                              onMouseLeave={() => setHoveredRow(null)}
                              style={{
                                ...styles.tableRow,
                                ...(hoveredRow === pred.id
                                  ? styles.tableRowHover
                                  : {}),
                              }}
                            >
                              <td style={styles.td}>
                                <strong>{pred.studentName}</strong>
                              </td>
                              <td style={styles.td}>
                                <span style={{ color: "#3b82f6", fontSize: "0.85rem" }}>
                                  {pred.studentEmail || "-"}
                                </span>
                              </td>
                              <td style={styles.td}>{pred.className || "-"}</td>
                              <td style={styles.td}>{pred.studyHoursPerWeek}h</td>
                              <td style={styles.td}>{pred.attendanceRate}%</td>
                              <td style={styles.td}>{pred.pastExamScores}</td>
                              <td style={styles.td}>
                                <strong style={{ color: "#8b5cf6" }}>
                                  {pred.predictedScore}/100
                                </strong>
                              </td>
                              <td style={styles.td}>
                                {pred.createdAt
                                  ? new Date(pred.createdAt).toLocaleString("vi-VN")
                                  : "-"}
                              </td>
                              <td style={styles.td}>
                                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                  <button
                                    onClick={() => handleSendPredictionEmail(pred.id)}
                                    disabled={sendingEmailId === pred.id}
                                    style={{
                                      ...styles.emailButton,
                                      opacity: sendingEmailId === pred.id ? 0.7 : 1,
                                      cursor: sendingEmailId === pred.id ? "not-allowed" : "pointer",
                                    }}
                                  >
                                    {sendingEmailId === pred.id ? "⏳ Đang gửi..." : "✉️ Gửi email"}
                                  </button>
                                  <button
                                    onClick={() => handleDeletePrediction(pred.id)}
                                    style={styles.deleteButton}
                                  >
                                    🗑️ Xóa
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Grades Tab */}
              {activeTab === "grades" && (
                <div>
                  {error ? (
                    <div style={styles.emptyState}>
                      <div style={styles.emptyIcon}>⚠️</div>
                      <div style={styles.emptyText}>Lỗi: {error}</div>
                    </div>
                  ) : allScores.length === 0 ? (
                    <div style={styles.emptyState}>
                      <div style={styles.emptyIcon}>📝</div>
                      <div style={styles.emptyText}>Chưa có điểm đã nhập</div>
                    </div>
                  ) : (
                    <div>
                      {allScores.map((studentData) => {
                        const fullName = `${studentData.firstName || ""} ${
                          studentData.lastName || ""
                        }`.trim() || studentData.username;

                        return (
                          <div key={studentData.studentId} style={styles.gradeCard}>
                            <div style={styles.gradeCardHeader}>
                              <div>
                                <h3 style={styles.gradeCardTitle}>{fullName}</h3>
                                <p style={styles.gradeCardSubtitle}>
                                  {studentData.className} • {studentData.totalScores} lần nhập
                                </p>
                              </div>
                            </div>

                            {studentData.scores.length === 0 ? (
                              <div style={styles.gradeCardEmpty}>
                                Chưa có điểm đã nhập
                              </div>
                            ) : (
                              <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                  <thead>
                                    <tr style={styles.tableHeadRow}>
                                      <th style={styles.th}>Giờ học/tuần</th>
                                      <th style={styles.th}>Tỉ lệ có mặt</th>
                                      <th style={styles.th}>Điểm thi trước</th>
                                      <th style={styles.th}>Trình độ PH</th>
                                      <th style={styles.th}>Internet</th>
                                      <th style={styles.th}>Ngoại khóa</th>
                                      <th style={styles.th}>Thời gian</th>
                                      <th style={styles.th}>Thao tác</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {studentData.scores.map((score) => (
                                      <tr
                                        key={score.id}
                                        onMouseEnter={() => setHoveredRow(score.id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                        style={{
                                          ...styles.tableRow,
                                          ...(hoveredRow === score.id
                                            ? styles.tableRowHover
                                            : {}),
                                        }}
                                      >
                                        <td style={styles.td}>
                                          {score.studyHoursPerWeek}h
                                        </td>
                                        <td style={styles.td}>
                                          {score.attendanceRate}%
                                        </td>
                                        <td style={styles.td}>
                                          {score.pastExamScores}
                                        </td>
                                        <td style={styles.td}>
                                          {score.parentalEducationLevel}
                                        </td>
                                        <td style={styles.td}>
                                          {score.internetAccessAtHome}
                                        </td>
                                        <td style={styles.td}>
                                          {score.extracurricularActivities}
                                        </td>
                                        <td style={styles.td}>
                                          {score.createdAt
                                            ? new Date(
                                                score.createdAt
                                              ).toLocaleString("vi-VN")
                                            : "-"}
                                        </td>
                                        <td style={styles.td}>
                                          <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <button
                                              onClick={() => openEditScoreModal(score, studentData)}
                                              style={styles.editButton}
                                            >
                                              ✏️ Sửa
                                            </button>
                                            <button
                                              onClick={() => handleDeleteScore(score.id)}
                                              style={styles.deleteButton}
                                            >
                                              🗑️ Xóa
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Input Scores Modal */}
      {showInputModal && selectedStudent && (
        <div style={styles.modalOverlay} onClick={closeInputModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalIcon}>✏️</div>
              <h3 style={styles.modalTitle}>
                Nhập điểm - {selectedStudent.username}
              </h3>
              <button
                onClick={closeInputModal}
                onMouseEnter={() => setHoverClose(true)}
                onMouseLeave={() => setHoverClose(false)}
                style={{
                  ...styles.closeButton,
                  ...(hoverClose ? styles.closeButtonHover : {}),
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitInput} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Thời gian học/tuần (giờ) *</label>
                  <input
                    type="number"
                    name="studyHoursPerWeek"
                    value={formValues.studyHoursPerWeek}
                    onChange={handleFormChange}
                    min="0"
                    max="168"
                    step="0.5"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Tỉ lệ có mặt (%) *</label>
                  <input
                    type="number"
                    name="attendanceRate"
                    value={formValues.attendanceRate}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    step="0.1"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Điểm thi trước đó (0-100) *</label>
                  <input
                    type="number"
                    name="pastExamScores"
                    value={formValues.pastExamScores}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    step="0.1"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Trình độ phụ huynh *</label>
                  <select
                    name="parentalEducationLevel"
                    value={formValues.parentalEducationLevel}
                    onChange={handleFormChange}
                    style={styles.select}
                    required
                  >
                    <option value="">-- Chọn --</option>
                    <option value="HighSchool">HighSchool</option>
                    <option value="Bachelors">Bachelors</option>
                    <option value="Masters">Masters</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Internet tại nhà *</label>
                  <select
                    name="internetAccessAtHome"
                    value={formValues.internetAccessAtHome}
                    onChange={handleFormChange}
                    style={styles.select}
                    required
                  >
                    <option value="">-- Chọn --</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Hoạt động ngoại khóa *</label>
                  <select
                    name="extracurricularActivities"
                    value={formValues.extracurricularActivities}
                    onChange={handleFormChange}
                    style={styles.select}
                    required
                  >
                    <option value="">-- Chọn --</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div style={styles.errorText}>❌ Lỗi: {formError}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                onMouseEnter={() => setHoverSubmit(true)}
                onMouseLeave={() => setHoverSubmit(false)}
                style={{
                  ...styles.submitButton,
                  ...(submitting ? styles.submitButtonDisabled : {}),
                  ...(hoverSubmit && !submitting ? styles.submitButtonHover : {}),
                }}
              >
                {submitting ? "⏳ Đang lưu..." : "💾 Lưu điểm"}
              </button>
            </form>

            {predictionResult && (
              <div style={styles.resultCard}>
                <div style={styles.resultTitle}>
                  ✅ Đã lưu điểm thành công!
                </div>
                <div style={styles.resultGrid}>
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

      {/* Prediction Modal */}
      {showPredictModal && selectedStudent && (
        <div style={styles.modalOverlay} onClick={closePredictModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalIcon}>🎯</div>
              <h3 style={styles.modalTitle}>
                Dự đoán điểm - {selectedStudent.username}
              </h3>
              <button
                onClick={closePredictModal}
                onMouseEnter={() => setHoverClose(true)}
                onMouseLeave={() => setHoverClose(false)}
                style={{
                  ...styles.closeButton,
                  ...(hoverClose ? styles.closeButtonHover : {}),
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPredict} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Thời gian học/tuần (giờ) *</label>
                  <input
                    type="number"
                    name="studyHoursPerWeek"
                    value={formValues.studyHoursPerWeek}
                    onChange={handleFormChange}
                    min="0"
                    max="168"
                    step="0.5"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Tỉ lệ có mặt (%) *</label>
                  <input
                    type="number"
                    name="attendanceRate"
                    value={formValues.attendanceRate}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    step="0.1"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Điểm thi trước đó (0-100) *</label>
                  <input
                    type="number"
                    name="pastExamScores"
                    value={formValues.pastExamScores}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    step="0.1"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Trình độ phụ huynh *</label>
                  <select
                    name="parentalEducationLevel"
                    value={formValues.parentalEducationLevel}
                    onChange={handleFormChange}
                    style={styles.select}
                    required
                  >
                    <option value="">-- Chọn --</option>
                    <option value="HighSchool">HighSchool</option>
                    <option value="Bachelors">Bachelors</option>
                    <option value="Masters">Masters</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Internet tại nhà *</label>
                  <select
                    name="internetAccessAtHome"
                    value={formValues.internetAccessAtHome}
                    onChange={handleFormChange}
                    style={styles.select}
                    required
                  >
                    <option value="">-- Chọn --</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Hoạt động ngoại khóa *</label>
                  <select
                    name="extracurricularActivities"
                    value={formValues.extracurricularActivities}
                    onChange={handleFormChange}
                    style={styles.select}
                    required
                  >
                    <option value="">-- Chọn --</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div style={styles.errorText}>❌ Lỗi: {formError}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                onMouseEnter={() => setHoverSubmit(true)}
                onMouseLeave={() => setHoverSubmit(false)}
                style={{
                  ...styles.submitButton,
                  ...(submitting ? styles.submitButtonDisabled : {}),
                  ...(hoverSubmit && !submitting ? styles.submitButtonHover : {}),
                }}
              >
                {submitting ? "⏳ Đang dự đoán..." : "🎯 Dự đoán điểm"}
              </button>
            </form>

            {predictionResult && (
              <div style={styles.resultCard}>
                <div style={styles.resultTitle}>
                  🎯 Kết quả dự đoán: {predictionResult.predictedScore}/100
                </div>
                <div style={styles.resultGrid}>
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

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>

      {/* Edit Score Modal */}
      {showEditScoreModal && selectedScore && (
        <div style={styles.modalOverlay} onClick={closeEditScoreModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalIcon}>✏️</div>
              <h3 style={styles.modalTitle}>
                Chỉnh sửa điểm - {selectedScore.studentName}
              </h3>
              <button
                onClick={closeEditScoreModal}
                onMouseEnter={() => setHoverClose(true)}
                onMouseLeave={() => setHoverClose(false)}
                style={{
                  ...styles.closeButton,
                  ...(hoverClose ? styles.closeButtonHover : {}),
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEditScore} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Thời gian học/tuần (giờ) *</label>
                  <input
                    type="number"
                    name="studyHoursPerWeek"
                    value={formValues.studyHoursPerWeek}
                    onChange={handleFormChange}
                    min="0"
                    max="168"
                    step="0.5"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Tỉ lệ có mặt (%) *</label>
                  <input
                    type="number"
                    name="attendanceRate"
                    value={formValues.attendanceRate}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    step="0.1"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Điểm thi trước đó (0-100) *</label>
                  <input
                    type="number"
                    name="pastExamScores"
                    value={formValues.pastExamScores}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    step="0.1"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Trình độ phụ huynh *</label>
                  <select
                    name="parentalEducationLevel"
                    value={formValues.parentalEducationLevel}
                    onChange={handleFormChange}
                    style={styles.select}
                    required
                  >
                    <option value="">-- Chọn --</option>
                    <option value="HighSchool">HighSchool</option>
                    <option value="Bachelors">Bachelors</option>
                    <option value="Masters">Masters</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Internet tại nhà *</label>
                  <select
                    name="internetAccessAtHome"
                    value={formValues.internetAccessAtHome}
                    onChange={handleFormChange}
                    style={styles.select}
                    required
                  >
                    <option value="">-- Chọn --</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Hoạt động ngoại khóa *</label>
                  <select
                    name="extracurricularActivities"
                    value={formValues.extracurricularActivities}
                    onChange={handleFormChange}
                    style={styles.select}
                    required
                  >
                    <option value="">-- Chọn --</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div style={styles.errorText}>❌ Lỗi: {formError}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                onMouseEnter={() => setHoverSubmit(true)}
                onMouseLeave={() => setHoverSubmit(false)}
                style={{
                  ...styles.submitButton,
                  ...(submitting ? styles.submitButtonDisabled : {}),
                  ...(hoverSubmit && !submitting ? styles.submitButtonHover : {}),
                }}
              >
                {submitting ? "⏳ Đang lưu..." : "💾 Cập nhật điểm"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.confirmModalContainer}>
            {/* Header with icons */}
            <div style={styles.confirmModalHeader}>
              <span style={{ fontSize: "1.5rem" }}>⚠️</span>
              <h3 style={styles.confirmModalTitle}>
                Xác nhận hành động
              </h3>
            </div>
            
            {/* Description */}
            <p style={styles.confirmModalDescription}>
              {confirmMessage || "Bạn có chắc chắn muốn thực hiện hành động này? Hành động này không thể hoàn tác."}
            </p>
            
            {/* Buttons */}
            <div style={styles.confirmModalFooter}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={styles.confirmModalButtonCancel}
                onMouseEnter={(e) => {
                  e.target.style.background = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "white";
                }}
              >
                Hủy
              </button>
              <button
                onClick={() => confirmAction && confirmAction()}
                style={styles.confirmModalButtonConfirm}
                onMouseEnter={(e) => {
                  e.target.style.background = "#dc2626";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#ef4444";
                }}
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={{
          ...styles.toastContainer,
          background: toast.type === "success" ? "#10b981" : "#ef4444",
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
