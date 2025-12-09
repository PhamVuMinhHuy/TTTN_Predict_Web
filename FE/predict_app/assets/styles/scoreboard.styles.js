// Modern Scoreboard Page Styles - Study Theme 2025 (Improved Readability)
export const scoreboardContainer = {
  fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
  minHeight: "100vh",
  background: `
    radial-gradient(ellipse at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)
  `,
};

export const scoreboardContent = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "40px 24px 80px",
};

export const scoreboardTitle = {
  fontSize: "36px",
  fontWeight: "800",
  textAlign: "center",
  marginBottom: "16px",
  color: "#ffffff",
  textShadow: "0 2px 15px rgba(251, 191, 36, 0.3)",
};

export const scoreboardSubtitle = {
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
  background: "linear-gradient(135deg, #f97316 0%, #fbbf24 100%)",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: "14px",
  fontSize: "16px",
  fontWeight: "700",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 8px 25px rgba(249, 115, 22, 0.4)",
};

export const emptyStateButtonHover = {
  transform: "translateY(-3px)",
  boxShadow: "0 14px 35px rgba(249, 115, 22, 0.5)",
};

// Table Wrapper
export const scoreboardTableWrapper = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  padding: "8px",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
  overflow: "hidden",
};

export const scoreboardTable = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
};

export const tableHeader = {
  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
};

export const tableHeaderCell = {
  padding: "18px 16px",
  color: "#ffffff",
  fontWeight: "700",
  fontSize: "13px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  textAlign: "left",
  borderBottom: "2px solid rgba(255, 255, 255, 0.2)",
};

export const tableRow = {
  transition: "all 0.2s ease",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
};

export const tableRowHover = {
  background: "rgba(255, 255, 255, 0.1)",
};

export const tableCell = {
  padding: "18px 16px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "500",
  verticalAlign: "middle",
};

export const tableCellCenter = {
  padding: "18px 16px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "500",
  verticalAlign: "middle",
  textAlign: "center",
};

export const tableCellGrade = {
  padding: "18px 16px",
  fontSize: "18px",
  fontWeight: "800",
  color: "#34d399",
  textAlign: "center",
};

// Stats cards (optional enhancement)
export const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginBottom: "40px",
};

export const statCard = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  padding: "24px",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  textAlign: "center",
};

export const statValue = {
  fontSize: "36px",
  fontWeight: "800",
  color: "#fbbf24",
  textShadow: "0 2px 10px rgba(251, 191, 36, 0.3)",
  marginBottom: "8px",
};

export const statLabel = {
  fontSize: "14px",
  color: "#cbd5e1",
  fontWeight: "500",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
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
  borderTopColor: "#f97316",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  marginRight: "16px",
};
