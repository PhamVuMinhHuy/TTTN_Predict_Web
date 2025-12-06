import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { teacherService } from "../services/teacherService";

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
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
    if (activeTab === "grades") {
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
    const studentsWithScores = students.filter(
      (s) => s.last_score !== null && s.last_score !== undefined
    ).length;
    const avgScore =
      studentsWithScores > 0
        ? students
            .filter((s) => s.last_score !== null && s.last_score !== undefined)
            .reduce((sum, s) => sum + Number(s.last_score), 0) / studentsWithScores
        : 0;
    const recentPredictions = students.filter((s) => s.last_predicted_at).length;

    return { totalStudents, studentsWithScores, avgScore, recentPredictions };
  }, [students]);

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
                        <div
                          style={{
                            ...styles.statCardIcon,
                            background:
                              "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                          }}
                        >
                          👥
                        </div>
                      </div>
                    </div>

                    <div style={styles.statCard}>
                      <div style={styles.statCardHeader}>
                        <div>
                          <div style={styles.statCardTitle}>Đã có điểm</div>
                          <div style={styles.statCardValue}>
                            {statistics.studentsWithScores}
                          </div>
                        </div>
                        <div
                          style={{
                            ...styles.statCardIcon,
                            background:
                              "linear-gradient(135deg, #10b981 0%, #047857 100%)",
                          }}
                        >
                          ✅
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
                        <div
                          style={{
                            ...styles.statCardIcon,
                            background:
                              "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                          }}
                        >
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
                                        background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
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
                                <button
                                  onClick={() => handleDeletePrediction(pred.id)}
                                  style={styles.deleteButton}
                                >
                                  🗑️ Xóa
                                </button>
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
        `}
      </style>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={styles.modalOverlay}>
          <div style={{
            background: "white",
            borderRadius: "0.75rem",
            maxWidth: "450px",
            width: "90%",
            padding: "2rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}>
            {/* Header with icons */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}>
              <span style={{ fontSize: "1.5rem" }}>⚠️</span>
              <span style={{ fontSize: "1.5rem" }}>⚠️</span>
              <h3 style={{
                margin: 0,
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#1f2937",
              }}>
                Xác nhận xóa lịch sử dự đoán
              </h3>
            </div>
            
            {/* Description */}
            <p style={{
              margin: "0 0 1.5rem 0",
              color: "#6b7280",
              fontSize: "0.875rem",
              lineHeight: "1.5",
            }}>
              Bạn có chắc chắn muốn xóa lịch sử dự đoán này không? Hành động này không thể hoàn tác.
            </p>
            
            {/* Buttons */}
            <div style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
            }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  padding: "0.625rem 1.25rem",
                  background: "white",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "0.875rem",
                  transition: "all 0.2s",
                }}
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
                style={{
                  padding: "0.625rem 1.25rem",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "0.875rem",
                  transition: "all 0.2s",
                }}
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
          position: "fixed",
          top: "2rem",
          right: "2rem",
          background: toast.type === "success" ? "#10b981" : "#ef4444",
          color: "white",
          padding: "1rem 1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          zIndex: 10000,
          animation: "slideIn 0.3s ease-out",
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

// Inline Styles
const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  
  // Sidebar
  sidebar: {
    width: "280px",
    background: "#ffffff",
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    height: "100vh",
    left: 0,
    top: 0,
    zIndex: 100,
  },
  sidebarHeader: {
    padding: "2rem 1.5rem",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  logo: {
    fontSize: "2rem",
  },
  logoText: {
    fontSize: "1.25rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  nav: {
    flex: 1,
    padding: "1.5rem 1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.875rem 1rem",
    borderRadius: "0.75rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "#4b5563",
  },
  navItemHover: {
    background: "#f3f4f6",
    color: "#1f2937",
  },
  navItemActive: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
  },
  navIcon: {
    fontSize: "1.25rem",
  },
  
  // Main Content
  mainContent: {
    marginLeft: "280px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    background: "#ffffff",
    padding: "2rem 2.5rem",
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1f2937",
    margin: 0,
  },
  headerSubtitle: {
    fontSize: "1rem",
    color: "#6b7280",
    margin: "0.5rem 0 0 0",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  headerUserProfile: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1.25rem",
    background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
    borderRadius: "0.75rem",
  },
  headerUserAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
  },
  headerUserDetails: {
    display: "flex",
    flexDirection: "column",
  },
  headerUserName: {
    fontWeight: "700",
    fontSize: "1rem",
    color: "#1f2937",
  },
  headerUserRole: {
    fontSize: "0.875rem",
    color: "#6b7280",
  },
  headerUserClass: {
    fontSize: "0.8rem",
    color: "#9ca3af",
    marginTop: "0.125rem",
  },
  headerLogoutButton: {
    padding: "0.75rem 1.5rem",
    borderRadius: "0.75rem",
    border: "none",
    background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
    color: "#dc2626",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(220, 38, 38, 0.1)",
  },
  headerLogoutButtonHover: {
    background: "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(220, 38, 38, 0.2)",
  },
  contentArea: {
    flex: 1,
    padding: "2.5rem",
    overflowY: "auto",
  },
  
  // Statistics
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2.5rem",
  },
  statCard: {
    background: "#ffffff",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
    transition: "all 0.3s ease",
    cursor: "default",
  },
  statCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statCardTitle: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.5rem",
  },
  statCardValue: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#1f2937",
  },
  statCardIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.75rem",
    color: "#ffffff",
  },
  
  // Quick Actions
  quickActions: {
    marginTop: "2rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "1rem",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  actionCard: {
    background: "#ffffff",
    borderRadius: "1rem",
    padding: "2rem",
    border: "2px solid #e5e7eb",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "center",
  },
  actionIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  actionTitle: {
    fontSize: "1.125rem",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "0.5rem",
  },
  actionDesc: {
    fontSize: "0.875rem",
    color: "#6b7280",
  },
  
  // Search
  searchContainer: {
    marginBottom: "1.5rem",
  },
  searchInput: {
    width: "100%",
    padding: "0.875rem 1.25rem",
    borderRadius: "0.75rem",
    border: "2px solid #e5e7eb",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s ease",
  },
  searchInputFocus: {
    borderColor: "#667eea",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
  },
  
  // Table
  tableWrapper: {
    background: "#ffffff",
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeadRow: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
  },
  th: {
    padding: "1rem 1.25rem",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "0.875rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "all 0.2s ease",
  },
  tableRowHover: {
    background: "#f9fafb",
  },
  td: {
    padding: "1rem 1.25rem",
    fontSize: "0.9rem",
    color: "#4b5563",
  },
  predictButton: {
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  predictButtonHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
  },
  
  // Modal
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.2s ease",
  },
  modal: {
    background: "#ffffff",
    borderRadius: "1rem",
    maxWidth: "700px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    animation: "scaleIn 0.3s ease",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1.5rem 2rem",
    borderBottom: "1px solid #e5e7eb",
    position: "relative",
  },
  modalIcon: {
    fontSize: "2rem",
  },
  modalTitle: {
    flex: 1,
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1f2937",
    margin: 0,
  },
  closeButton: {
    width: "36px",
    height: "36px",
    borderRadius: "0.5rem",
    border: "none",
    background: "#f3f4f6",
    color: "#6b7280",
    fontSize: "1.25rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonHover: {
    background: "#e5e7eb",
    color: "#1f2937",
  },
  
  // Form
  form: {
    padding: "2rem",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1.25rem",
    marginBottom: "1.5rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "2px solid #e5e7eb",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s ease",
  },
  select: {
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "2px solid #e5e7eb",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s ease",
    background: "#ffffff",
  },
  submitButton: {
    width: "100%",
    padding: "1rem",
    borderRadius: "0.75rem",
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  submitButtonHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 16px rgba(102, 126, 234, 0.4)",
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  errorText: {
    color: "#dc2626",
    fontSize: "0.9rem",
    marginBottom: "1rem",
  },
  
  // Result Card
  resultCard: {
    marginTop: "1.5rem",
    padding: "1.5rem",
    borderRadius: "0.75rem",
    background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    border: "2px solid #10b981",
  },
  resultTitle: {
    fontWeight: "700",
    fontSize: "1.25rem",
    marginBottom: "1rem",
    color: "#065f46",
  },
  resultGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "0.75rem",
    fontSize: "0.875rem",
    color: "#047857",
  },
  
  // Empty State
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "#ffffff",
    borderRadius: "1rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
  emptyText: {
    fontSize: "1.125rem",
    color: "#6b7280",
    fontWeight: "500",
  },
  
  // Grade Cards
  gradeCard: {
    background: "#ffffff",
    borderRadius: "1rem",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
  },
  gradeCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "2px solid #e5e7eb",
  },
  gradeCardTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#1f2937",
    margin: 0,
  },
  gradeCardSubtitle: {
    fontSize: "0.875rem",
    color: "#6b7280",
    margin: "0.25rem 0 0 0",
  },
  gradeCardEmpty: {
    textAlign: "center",
    padding: "2rem",
    color: "#9ca3af",
    fontStyle: "italic",
  },
  
  // Loading
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 2rem",
    background: "#ffffff",
    borderRadius: "1rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #667eea",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    marginBottom: "1rem",
  },
};
