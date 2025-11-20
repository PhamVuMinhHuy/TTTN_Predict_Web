import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useLocalStorage } from "../hooks/useLocalStorage";
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

const ScoreboardPage = () => {
  const { user } = useAuth();
  const [predictionHistory, setPredictionHistory] = useLocalStorage(
    `prediction_history_${user?.id || "guest"}`,
    []
  );
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(false);

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


  return (
    <div style={scoreboardContainer}>
      <Header />
      <div style={{ ...scoreboardContent, padding: '2rem 1rem' }}>
        <h1 style={scoreboardTitle}>🏆 Bảng Điểm</h1>

        <p style={scoreboardSubtitle}>
          Xem lại các dự đoán điểm số và dữ liệu đầu vào của bạn
        </p>

        {predictionHistory.length === 0 ? (
          <div style={emptyStateContainer}>
            <div style={emptyStateIcon}>📭</div>
            <h2 style={emptyStateTitle}>Chưa có dữ liệu</h2>
            <p style={emptyStateText}>
              Bạn chưa thực hiện dự đoán nào. Hãy thử dự đoán điểm số để xem
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
                  <th style={tableHeaderCell}>Điểm cuối kỳ</th>
                </tr>
              </thead>
              <tbody>
                {predictionHistory.map((prediction, index) => {
                  const finalScore =
                    prediction.finalExamScore || prediction.finalGrade;
                  const inputs = prediction.inputs || {};
                  return (
                    <tr
                      key={index}
                      style={{
                        ...tableRow,
                        ...(hoveredItem === index
                          ? { backgroundColor: "#f9fafb" }
                          : {}),
                      }}
                      onMouseEnter={() => setHoveredItem(index)}
                      onMouseLeave={() => setHoveredItem(null)}
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
                        {finalScore ? formatScore(finalScore) : "-"}
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

