import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { predictionService } from "../services/predictionService";
import {
  historyContainer,
  historyContent,
  historyTitle,
  historySubtitle,
  emptyStateContainer,
  emptyStateIcon,
  emptyStateTitle,
  emptyStateText,
  emptyStateButton,
  emptyStateButtonHover,
  historyList,
  historyItem,
  historyItemHover,
  historyItemHeader,
  historyItemTitle,
  historyItemTimestamp,
  historyItemDetails,
  historyItemGrade,
  historyItemGradeLabel,
  deleteButton,
  deleteButtonHover,
} from "../../assets/styles/history.styles";

// Custom Modal Styles
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  animation: "fadeIn 0.2s ease",
};

const modalContainer = {
  background: "linear-gradient(145deg, rgba(30, 30, 50, 0.98) 0%, rgba(20, 20, 35, 0.98) 100%)",
  borderRadius: "20px",
  padding: "32px",
  maxWidth: "420px",
  width: "90%",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)",
  animation: "slideUp 0.3s ease",
};

const modalIcon = {
  fontSize: "48px",
  textAlign: "center",
  marginBottom: "16px",
};

const modalTitle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#ffffff",
  textAlign: "center",
  marginBottom: "12px",
};

const modalMessage = {
  fontSize: "15px",
  color: "#94a3b8",
  textAlign: "center",
  lineHeight: "1.6",
  marginBottom: "28px",
};

const modalButtonContainer = {
  display: "flex",
  gap: "12px",
  justifyContent: "center",
};

const modalCancelButton = {
  padding: "12px 28px",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  background: "rgba(255, 255, 255, 0.05)",
  color: "#cbd5e1",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const modalConfirmButton = {
  padding: "12px 28px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
};

const modalOkButton = {
  padding: "12px 36px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
};

const HistoryPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(false);
  const [hoveredDeleteButton, setHoveredDeleteButton] = useState(null);
  const [deleting, setDeleting] = useState(null);
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error"); // "error" or "success"
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Fetch prediction history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        console.log("DEBUG: HistoryPage - No token, redirecting to login");
        navigate("/auth?mode=login");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await predictionService.getHistory(50, 0);
        if (result.success) {
          // Map backend format to frontend format
          const mappedHistory = result.data.predictions.map((pred) => ({
            id: pred.id,
            timestamp: pred.createdAt,
            finalExamScore: pred.predictedScore,
            details: `Thời gian học: ${pred.studyHoursPerWeek}h/tuần, Tỉ lệ có mặt: ${pred.attendanceRate}%, Điểm thi trước: ${pred.pastExamScores}, Trình độ phụ huynh: ${pred.parentalEducationLevel}, Internet tại nhà: ${pred.internetAccessAtHome}, Hoạt động ngoại khóa: ${pred.extracurricularActivities}`,
            inputs: {
              studyHoursPerWeek: pred.studyHoursPerWeek,
              attendanceRate: pred.attendanceRate,
              pastExamScores: pred.pastExamScores,
              parentalEducationLevel: pred.parentalEducationLevel,
              internetAccessAtHome: pred.internetAccessAtHome,
              extracurricularActivities: pred.extracurricularActivities,
            },
          }));
          setPredictionHistory(mappedHistory);
        } else {
          setError(result.error);
          if (result.error.includes("Authentication expired")) {
            navigate("/auth?mode=login");
          }
        }
      } catch (err) {
        console.error("DEBUG: HistoryPage - Error fetching history:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token, navigate]);

  const showAlert = (message, type = "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlertModal(true);
  };

  const handleDeleteClick = (predictionId, e) => {
    e.stopPropagation();
    setPendingDeleteId(predictionId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmModal(false);
    if (!pendingDeleteId) return;

    setDeleting(pendingDeleteId);
    try {
      const result = await predictionService.deleteHistory(pendingDeleteId);
      if (result.success) {
        setPredictionHistory((prev) =>
          prev.filter((p) => p.id !== pendingDeleteId)
        );
        showAlert("Đã xóa lịch sử dự đoán thành công!", "success");
      } else {
        showAlert(result.error || "Không thể xóa lịch sử dự đoán");
      }
    } catch (err) {
      console.error("Error deleting prediction:", err);
      showAlert("Đã xảy ra lỗi khi xóa lịch sử");
    } finally {
      setDeleting(null);
      setPendingDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setPendingDeleteId(null);
  };

  // Confirmation Modal Component
  const ConfirmModal = () => (
    <div style={modalOverlay} onClick={handleCancelDelete}>
      <div style={modalContainer} onClick={(e) => e.stopPropagation()}>
        <div style={modalIcon}>⚠️</div>
        <h3 style={modalTitle}>Xác nhận xóa</h3>
        <p style={modalMessage}>
          Bạn có chắc chắn muốn xóa lịch sử dự đoán này?<br />
          Hành động này không thể hoàn tác.
        </p>
        <div style={modalButtonContainer}>
          <button
            style={modalCancelButton}
            onClick={handleCancelDelete}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.1)";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.05)";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
          >
            Hủy
          </button>
          <button
            style={modalConfirmButton}
            onClick={handleConfirmDelete}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(239, 68, 68, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)";
            }}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );

  // Alert Modal Component
  const AlertModal = () => (
    <div style={modalOverlay} onClick={() => setShowAlertModal(false)}>
      <div style={modalContainer} onClick={(e) => e.stopPropagation()}>
        <div style={modalIcon}>{alertType === "success" ? "✅" : "❌"}</div>
        <h3 style={modalTitle}>
          {alertType === "success" ? "Thành công" : "Thông báo"}
        </h3>
        <p style={modalMessage}>{alertMessage}</p>
        <div style={modalButtonContainer}>
          <button
            style={modalOkButton}
            onClick={() => setShowAlertModal(false)}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(59, 130, 246, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)";
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={historyContainer}>
        <Header />
        <div style={historyContent}>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div>Đang tải lịch sử dự đoán...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error && predictionHistory.length === 0) {
    return (
      <div style={historyContainer}>
        <Header />
        <div style={historyContent}>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ color: "#e74c3c", marginBottom: "1rem" }}>
              Lỗi: {error}
            </div>
            <button
              onClick={() => navigate("/auth?mode=login")}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
              }}
            >
              Đăng nhập lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={historyContainer}>
      <Header />
      <div style={historyContent}>
        <h1 style={historyTitle}>📜 Lịch Sử Dự Đoán</h1>

        <p style={historySubtitle}>
          Danh sách các lần bạn đã thực hiện dự đoán điểm số
        </p>

        {predictionHistory.length === 0 ? (
          <div style={emptyStateContainer}>
            <div style={emptyStateIcon}>📭</div>
            <h2 style={emptyStateTitle}>Chưa có lịch sử dự đoán</h2>
            <p style={emptyStateText}>
              Bạn chưa thực hiện dự đoán nào. Hãy thử dự đoán điểm số để xem
              lịch sử ở đây!
            </p>
            <a
              href="/predict"
              style={{
                ...emptyStateButton,
                ...(hoveredButton ? emptyStateButtonHover : {}),
              }}
              onMouseEnter={() => setHoveredButton(true)}
              onMouseLeave={() => setHoveredButton(false)}
            >
              Đi đến trang Dự đoán
            </a>
          </div>
        ) : (
          <div style={historyList}>
            {predictionHistory.map((prediction, index) => (
              <div
                key={prediction.id || index}
                style={{
                  ...historyItem,
                  ...(hoveredItem === index ? historyItemHover : {}),
                }}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div style={historyItemHeader}>
                  <h3 style={historyItemTitle}>
                    Dự đoán #{predictionHistory.length - index}
                  </h3>
                  <span style={historyItemTimestamp}>
                    {formatDate(prediction.timestamp)}
                  </span>
                </div>
                {prediction.finalExamScore !== undefined && (
                  <div style={{ marginTop: "0.75rem", marginBottom: "0.5rem" }}>
                    <span style={historyItemGradeLabel}>Điểm dự đoán:</span>
                    <span style={historyItemGrade}>
                      {prediction.finalExamScore}/100
                    </span>
                  </div>
                )}
                {prediction.details && (
                  <div style={historyItemDetails}>{prediction.details}</div>
                )}
                <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={(e) => handleDeleteClick(prediction.id, e)}
                    disabled={deleting === prediction.id}
                    onMouseEnter={() => setHoveredDeleteButton(prediction.id)}
                    onMouseLeave={() => setHoveredDeleteButton(null)}
                    style={{
                      ...deleteButton,
                      ...(hoveredDeleteButton === prediction.id ? deleteButtonHover : {}),
                      opacity: deleting === prediction.id ? 0.6 : 1,
                      cursor: deleting === prediction.id ? "not-allowed" : "pointer",
                    }}
                  >
                    {deleting === prediction.id ? "Đang xóa..." : "🗑️ Xóa"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showConfirmModal && <ConfirmModal />}
      {showAlertModal && <AlertModal />}
    </div>
  );
};

export default HistoryPage;

