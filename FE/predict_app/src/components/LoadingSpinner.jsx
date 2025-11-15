import React from "react";

const LoadingSpinner = ({ message = "Đang tải..." }) => {
  // Inject CSS keyframes for loading animation
  if (!document.querySelector("#loading-spinner-styles")) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "loading-spinner-styles";
    styleSheet.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
    padding: "2rem",
    fontFamily: "'Inter', 'Roboto', sans-serif",
  };

  const spinnerStyle = {
    width: "40px",
    height: "40px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem",
  };

  const messageStyle = {
    color: "#64748b",
    fontSize: "0.95rem",
    fontWeight: "500",
    textAlign: "center",
    animation: "pulse 2s ease-in-out infinite",
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      <p style={messageStyle}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
