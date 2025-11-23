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
} from "../../assets/styles/history.styles";

const HistoryPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(false);

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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
