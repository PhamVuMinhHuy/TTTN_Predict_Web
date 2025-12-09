import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";
import {
  scoreboardContainer,
  scoreboardContent,
  scoreboardTitle,
  scoreboardSubtitle,
  emptyStateContainer,
  emptyStateIcon,
  emptyStateTitle,
  emptyStateText,
  emptyStateButton,
  emptyStateButtonHover,
  scoreboardTableWrapper,
  scoreboardTable,
  tableHeader,
  tableHeaderCell,
  tableRow,
  tableCell,
  tableCellCenter,
} from "../../assets/styles/scoreboard.styles";
import { scoreStudentService } from "../services/scoreStudentService";

const ScoreboardPage = () => {
  const { user, token } = useAuth();
  // Bỏ useLocalStorage, dùng state thường
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
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

  const formatEducationLevel = (level) => {
    const levels = {
      HighSchool: "THPT",
      Bachelors: "Cử nhân",
      Masters: "Thạc sĩ",
      PhD: "Tiến sĩ",
    };
    return levels[level] || level;
  };

  const formatScore = (score) => {
    if (!score && score !== 0) return "-";
    return Number(score).toFixed(2).replace(".", ",");
  };

  useEffect(() => {
    const fetchScoreHistory = async () => {
      // Nếu không có token -> chuyển về login
      const tokenFromStorage = localStorage.getItem("token");
      const hasToken = token || tokenFromStorage;
      if (!hasToken) {
        setLoading(false);
        setError("Bạn cần đăng nhập để xem bảng điểm");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await scoreStudentService.getHistory(50, 0);
        if (result.success) {
          // Map backend items -> format giống đang dùng ở bảng
          const mapped = result.data.items.map((item) => ({
            id: item.id,
            timestamp: item.createdAt,
            inputs: {
              studyHoursPerWeek: item.studyHoursPerWeek,
              attendanceRate: item.attendanceRate,
              pastExamScores: item.pastExamScores,
              parentalEducationLevel: item.parentalEducationLevel,
              internetAccessAtHome: item.internetAccessAtHome,
              extracurricularActivities: item.extracurricularActivities,
            },
            // Không có predictedScore vì ScoreStudent chỉ lưu input
            finalExamScore: null,
          }));
          setPredictionHistory(mapped);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScoreHistory();
  }, [token]);

  if (loading) {
    return (
      <div style={scoreboardContainer}>
        <Header />
        <div style={{ ...scoreboardContent, padding: "2rem 1rem" }}>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div>Đang tải bảng điểm...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error && predictionHistory.length === 0) {
    return (
      <div style={scoreboardContainer}>
        <Header />
        <div style={{ ...scoreboardContent, padding: "2rem 1rem" }}>
          <div style={emptyStateContainer}>
            <div style={{ color: "#e74c3c", marginBottom: "1rem" }}>
              Lỗi: {error}
            </div>
            <a
              href="/auth?mode=login"
              style={{
                ...emptyStateButton,
                ...(hoveredButton ? emptyStateButtonHover : {}),
              }}
              onMouseEnter={() => setHoveredButton(true)}
              onMouseLeave={() => setHoveredButton(false)}
            >
              Đăng nhập lại
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={scoreboardContainer}>
      <Header />
      <div style={{ ...scoreboardContent, padding: "2rem 1rem" }}>
        <h1 style={scoreboardTitle}>🏆 Bảng Điểm</h1>

        <p style={scoreboardSubtitle}>
          Xem lại các lần nhập dữ liệu điểm số và thông tin học tập của bạn
        </p>

        {predictionHistory.length === 0 ? (
          <div style={emptyStateContainer}>
            <div style={emptyStateIcon}>📭</div>
            <h2 style={emptyStateTitle}>Chưa có dữ liệu</h2>
            <p style={emptyStateText}>
              Bạn chưa có lần nhập dữ liệu nào. Hãy thử dự đoán điểm số để xem
              kết quả ở đây!
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
          <div style={scoreboardTableWrapper}>
            <table style={scoreboardTable}>
              <thead>
                <tr style={tableHeader}>
                  <th style={tableHeaderCell}>TT</th>
                  <th style={tableHeaderCell}>Thời gian học/tuần (giờ)</th>
                  <th style={tableHeaderCell}>Tỉ lệ có mặt (%)</th>
                  <th style={tableHeaderCell}>Điểm thi trước đó</th>
                  <th style={tableHeaderCell}>Trình độ phụ huynh</th>
                  <th style={tableHeaderCell}>Internet tại nhà</th>
                  <th style={tableHeaderCell}>Hoạt động ngoại khóa</th>
                  <th style={tableHeaderCell}>Thời gian nhập</th>
                </tr>
              </thead>
              <tbody>
                {predictionHistory.map((prediction, index) => {
                  const inputs = prediction.inputs || {};
                  return (
                    <tr
                      key={prediction.id || index}
                      style={tableRow}
                    >
                      <td style={tableCellCenter}>
                        {predictionHistory.length - index}
                      </td>
                      <td style={tableCell}>
                        {inputs.studyHoursPerWeek ||
                          inputs.studyHourPerWeek ||
                          "-"}
                      </td>
                      <td style={tableCell}>
                        {inputs.attendanceRate
                          ? formatScore(inputs.attendanceRate)
                          : "-"}
                      </td>
                      <td style={tableCell}>
                        {inputs.pastExamScores || inputs.previousGrade
                          ? formatScore(
                              inputs.pastExamScores || inputs.previousGrade
                            )
                          : "-"}
                      </td>
                      <td style={tableCell}>
                        {inputs.parentalEducationLevel
                          ? formatEducationLevel(inputs.parentalEducationLevel)
                          : "-"}
                      </td>
                      <td style={tableCellCenter}>
                        {inputs.internetAccessAtHome === "Yes"
                          ? "Có"
                          : inputs.internetAccessAtHome === "No"
                          ? "Không"
                          : "-"}
                      </td>
                      <td style={tableCellCenter}>
                        {inputs.extracurricularActivities === "Yes"
                          ? "Có"
                          : inputs.extracurricularActivities === "No"
                          ? "Không"
                          : "-"}
                      </td>
                      <td style={tableCell}>
                        {prediction.timestamp
                          ? formatDate(prediction.timestamp)
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreboardPage;
