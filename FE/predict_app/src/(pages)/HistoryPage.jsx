import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import Header from "../components/Header";
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
  const { user } = useAuth();
  const [predictionHistory, _setPredictionHistory] = useLocalStorage(
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

  // Add a test prediction if history is empty (for demo purposes)
  useEffect(() => {
    if (user && predictionHistory.length === 0) {
      // This is just for demonstration - in real app, predictions would be added when user makes predictions
      console.log("No prediction history found");
    }
  }, [user, predictionHistory.length]);

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
                key={index}
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
                {prediction.finalGrade !== undefined && (
                  <div style={{ marginTop: "0.75rem", marginBottom: "0.5rem" }}>
                    <span style={historyItemGradeLabel}>Điểm dự đoán:</span>
                    <span style={historyItemGrade}>
                      {prediction.finalGrade}/100
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
