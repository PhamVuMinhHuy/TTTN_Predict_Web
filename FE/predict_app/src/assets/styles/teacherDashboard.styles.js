// Modern Teacher Dashboard Styles with Premium Design

export const dashboardPage = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "2rem",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

export const dashboardContainer = {
  maxWidth: "1400px",
  margin: "0 auto",
};

// Header Styles
export const header = {
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: "1rem",
  padding: "1.5rem 2rem",
  marginBottom: "2rem",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export const headerLeft = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

export const headerTitle = {
  fontSize: "2rem",
  fontWeight: "700",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  margin: 0,
};

export const headerSubtitle = {
  fontSize: "1rem",
  color: "#6b7280",
  margin: 0,
};

export const headerRight = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

export const userInfo = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0.5rem 1rem",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "0.5rem",
  color: "white",
  fontSize: "0.9rem",
};

export const logoutBtn = {
  padding: "0.5rem 1.25rem",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  fontSize: "0.9rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

export const logoutBtnHover = {
  background: "#dc2626",
  transform: "translateY(-2px)",
  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
};

// Tab Navigation Styles
export const tabContainer = {
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: "1rem",
  padding: "1rem",
  marginBottom: "2rem",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
};

export const tabList = {
  display: "flex",
  gap: "0.5rem",
  flexWrap: "wrap",
  listStyle: "none",
  padding: 0,
  margin: 0,
};

export const tab = {
  padding: "0.75rem 1.5rem",
  background: "transparent",
  border: "none",
  borderRadius: "0.5rem",
  fontSize: "0.95rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  color: "#6b7280",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

export const tabActive = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
};

export const tabHover = {
  background: "#f3f4f6",
  transform: "translateY(-2px)",
};

// Content Area Styles
export const contentArea = {
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: "1rem",
  padding: "2rem",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  minHeight: "500px",
};

// Card Styles
export const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "1.5rem",
  marginBottom: "2rem",
};

export const statCard = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "1rem",
  padding: "1.5rem",
  color: "white",
  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
  transition: "transform 0.3s ease",
};

export const statCardHover = {
  transform: "translateY(-4px)",
  boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
};

export const statCardIcon = {
  fontSize: "2.5rem",
  marginBottom: "0.5rem",
};

export const statCardLabel = {
  fontSize: "0.9rem",
  opacity: 0.9,
  marginBottom: "0.25rem",
};

export const statCardValue = {
  fontSize: "2rem",
  fontWeight: "700",
};

// Table Styles
export const tableContainer = {
  overflowX: "auto",
  borderRadius: "0.75rem",
  border: "1px solid #e5e7eb",
};

export const table = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.9rem",
};

export const tableHead = {
  background: "#f9fafb",
};

export const th = {
  padding: "1rem",
  textAlign: "left",
  fontWeight: "600",
  color: "#374151",
  borderBottom: "2px solid #e5e7eb",
};

export const td = {
  padding: "1rem",
  borderBottom: "1px solid #e5e7eb",
  color: "#4b5563",
};

export const tableRow = {
  transition: "background 0.2s ease",
};

export const tableRowHover = {
  background: "#f9fafb",
};

// Form Styles
export const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "1.5rem",
  marginBottom: "1.5rem",
};

export const formGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

export const label = {
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#374151",
};

export const input = {
  padding: "0.75rem",
  border: "2px solid #e5e7eb",
  borderRadius: "0.5rem",
  fontSize: "0.95rem",
  transition: "all 0.3s ease",
  outline: "none",
};

export const inputFocus = {
  borderColor: "#667eea",
  boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
};

export const select = {
  padding: "0.75rem",
  border: "2px solid #e5e7eb",
  borderRadius: "0.5rem",
  fontSize: "0.95rem",
  transition: "all 0.3s ease",
  outline: "none",
  background: "white",
  cursor: "pointer",
};

export const textarea = {
  padding: "0.75rem",
  border: "2px solid #e5e7eb",
  borderRadius: "0.5rem",
  fontSize: "0.95rem",
  transition: "all 0.3s ease",
  outline: "none",
  resize: "vertical",
  minHeight: "100px",
  fontFamily: "inherit",
};

// Button Styles
export const btnPrimary = {
  padding: "0.75rem 1.5rem",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  fontSize: "0.95rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

export const btnPrimaryHover = {
  transform: "translateY(-2px)",
  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
};

export const btnSecondary = {
  padding: "0.75rem 1.5rem",
  background: "#f3f4f6",
  color: "#374151",
  border: "none",
  borderRadius: "0.5rem",
  fontSize: "0.95rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

export const btnSecondaryHover = {
  background: "#e5e7eb",
  transform: "translateY(-2px)",
};

export const btnDanger = {
  padding: "0.5rem 1rem",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  fontSize: "0.85rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

export const btnDangerHover = {
  background: "#dc2626",
  transform: "translateY(-2px)",
};

export const btnSuccess = {
  padding: "0.5rem 1rem",
  background: "#10b981",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  fontSize: "0.85rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

export const btnSuccessHover = {
  background: "#059669",
  transform: "translateY(-2px)",
};

// Modal Styles
export const modalBackdrop = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "1rem",
};

export const modal = {
  background: "white",
  borderRadius: "1rem",
  padding: "2rem",
  maxWidth: "600px",
  width: "100%",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
};

export const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem",
  paddingBottom: "1rem",
  borderBottom: "2px solid #e5e7eb",
};

export const modalTitle = {
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#111827",
  margin: 0,
};

export const closeBtn = {
  background: "transparent",
  border: "none",
  fontSize: "1.5rem",
  cursor: "pointer",
  color: "#6b7280",
  transition: "color 0.2s ease",
};

export const closeBtnHover = {
  color: "#111827",
};

// Badge Styles
export const badge = {
  display: "inline-block",
  padding: "0.25rem 0.75rem",
  borderRadius: "9999px",
  fontSize: "0.75rem",
  fontWeight: "600",
};

export const badgeSuccess = {
  ...badge,
  background: "#d1fae5",
  color: "#065f46",
};

export const badgeWarning = {
  ...badge,
  background: "#fef3c7",
  color: "#92400e",
};

export const badgeDanger = {
  ...badge,
  background: "#fee2e2",
  color: "#991b1b",
};

export const badgeInfo = {
  ...badge,
  background: "#dbeafe",
  color: "#1e40af",
};

// Empty State
export const emptyState = {
  textAlign: "center",
  padding: "3rem 1rem",
  color: "#6b7280",
};

export const emptyStateIcon = {
  fontSize: "4rem",
  marginBottom: "1rem",
  opacity: 0.5,
};

export const emptyStateText = {
  fontSize: "1.1rem",
  fontWeight: "600",
  marginBottom: "0.5rem",
};

export const emptyStateSubtext = {
  fontSize: "0.9rem",
};

// Loading State
export const loadingContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "3rem",
  gap: "1rem",
};

export const spinner = {
  width: "50px",
  height: "50px",
  border: "4px solid #e5e7eb",
  borderTop: "4px solid #667eea",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

// Search and Filter
export const searchContainer = {
  display: "flex",
  gap: "1rem",
  marginBottom: "1.5rem",
  flexWrap: "wrap",
};

export const searchInput = {
  flex: 1,
  minWidth: "250px",
  padding: "0.75rem 1rem",
  border: "2px solid #e5e7eb",
  borderRadius: "0.5rem",
  fontSize: "0.95rem",
  outline: "none",
  transition: "all 0.3s ease",
};

export const filterSelect = {
  padding: "0.75rem 1rem",
  border: "2px solid #e5e7eb",
  borderRadius: "0.5rem",
  fontSize: "0.95rem",
  outline: "none",
  background: "white",
  cursor: "pointer",
  transition: "all 0.3s ease",
};
