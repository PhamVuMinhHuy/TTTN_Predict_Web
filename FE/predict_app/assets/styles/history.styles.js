// Modern History Page Styles - Study Theme 2025 (Improved Readability)
export const historyContainer = {
  fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
  minHeight: "100vh",
  background: `
    radial-gradient(ellipse at 30% 70%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 30%, rgba(78, 205, 196, 0.15) 0%, transparent 50%),
    linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)
  `,
};

export const historyContent = {
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "40px 24px 80px",
};

export const historyTitle = {
  fontSize: "36px",
  fontWeight: "800",
  textAlign: "center",
  marginBottom: "16px",
  color: "#ffffff",
  textShadow: "0 2px 15px rgba(59, 130, 246, 0.3)",
};

export const historySubtitle = {
  fontSize: "17px",
  color: "#cbd5e1",
  textAlign: "center",
  marginBottom: "48px",
  maxWidth: "600px",
  margin: "0 auto 48px",
  lineHeight: "1.6",
};

// Empty State
export const emptyStateContainer = {
  textAlign: "center",
  padding: "80px 40px",
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(20px)",
  borderRadius: "28px",
  border: "1px solid rgba(255, 255, 255, 0.12)",
};

export const emptyStateIcon = {
  fontSize: "80px",
  marginBottom: "24px",
  filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
};

export const emptyStateTitle = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#ffffff",
  marginBottom: "16px",
};

export const emptyStateText = {
  fontSize: "16px",
  color: "#cbd5e1",
  marginBottom: "32px",
  lineHeight: "1.6",
  maxWidth: "400px",
  margin: "0 auto 32px",
};

export const emptyStateButton = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  padding: "16px 32px",
  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: "14px",
  fontSize: "16px",
  fontWeight: "700",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
};

export const emptyStateButtonHover = {
  transform: "translateY(-3px)",
  boxShadow: "0 14px 35px rgba(59, 130, 246, 0.5)",
};

// History List
export const historyList = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

export const historyItem = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  padding: "28px 32px",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
};

export const historyItemHover = {
  transform: "translateY(-4px)",
  background: "rgba(255, 255, 255, 0.14)",
  borderColor: "rgba(59, 130, 246, 0.4)",
  boxShadow: "0 16px 40px rgba(0, 0, 0, 0.2)",
};

export const historyItemHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

export const historyItemTitle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#ffffff",
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

export const historyItemTimestamp = {
  fontSize: "14px",
  color: "#94a3b8",
  fontWeight: "500",
};

export const historyItemDetails = {
  fontSize: "14px",
  lineHeight: "1.8",
  color: "#e2e8f0",
  padding: "16px",
  background: "rgba(255, 255, 255, 0.06)",
  borderRadius: "12px",
  marginTop: "12px",
};

export const historyItemGradeLabel = {
  fontSize: "14px",
  color: "#cbd5e1",
  marginRight: "12px",
  fontWeight: "500",
};

export const historyItemGrade = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#34d399",
  textShadow: "0 2px 10px rgba(52, 211, 153, 0.3)",
};

// Loading State
export const loadingContainer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "80px 40px",
  color: "#cbd5e1",
  fontSize: "18px",
};

export const loadingSpinner = {
  width: "40px",
  height: "40px",
  border: "3px solid rgba(255, 255, 255, 0.15)",
  borderTopColor: "#3b82f6",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  marginRight: "16px",
};

// Delete Button - Modern style
export const deleteButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "12px 24px",
  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%)",
  color: "#f87171",
  border: "1px solid rgba(239, 68, 68, 0.25)",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  backdropFilter: "blur(8px)",
  letterSpacing: "0.3px",
};

export const deleteButtonHover = {
  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.85) 0%, rgba(185, 28, 28, 0.95) 100%)",
  color: "#ffffff",
  borderColor: "rgba(239, 68, 68, 0.6)",
  transform: "translateY(-2px)",
  boxShadow: "0 8px 20px rgba(239, 68, 68, 0.35), 0 0 0 1px rgba(239, 68, 68, 0.1)",
};

