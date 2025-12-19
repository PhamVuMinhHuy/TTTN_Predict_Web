// Teacher Dashboard Inline Styles - Separated from Component

// Page Layout
export const page = {
  display: "flex",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

// Sidebar
export const sidebar = {
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
};

export const sidebarHeader = {
  padding: "2rem 1.5rem",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
};

export const logo = {
  fontSize: "2rem",
};

export const logoText = {
  fontSize: "1.25rem",
  fontWeight: "700",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

export const nav = {
  flex: 1,
  padding: "1.5rem 1rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

export const navItem = {
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
};

export const navItemHover = {
  background: "#f3f4f6",
  color: "#1f2937",
};

export const navItemActive = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#ffffff",
  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
};

export const navIcon = {
  fontSize: "1.25rem",
};

// Main Content
export const mainContent = {
  marginLeft: "280px",
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

export const header = {
  background: "#ffffff",
  padding: "2rem 2.5rem",
  borderBottom: "1px solid #e5e7eb",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export const headerTitle = {
  fontSize: "2rem",
  fontWeight: "700",
  color: "#1f2937",
  margin: 0,
};

export const headerSubtitle = {
  fontSize: "1rem",
  color: "#6b7280",
  margin: "0.5rem 0 0 0",
};

export const headerRight = {
  display: "flex",
  alignItems: "center",
  gap: "1.5rem",
};

export const headerUserProfile = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0.75rem 1.25rem",
  background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
  borderRadius: "0.75rem",
};

export const headerUserAvatar = {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.5rem",
};

export const headerUserDetails = {
  display: "flex",
  flexDirection: "column",
};

export const headerUserName = {
  fontWeight: "700",
  fontSize: "1rem",
  color: "#1f2937",
};

export const headerUserFullName = {
  fontSize: "0.875rem",
  color: "#4b5563",
  fontWeight: "500",
  marginTop: "0.125rem",
};

export const headerUserRole = {
  fontSize: "0.875rem",
  color: "#6b7280",
};

export const headerUserClass = {
  fontSize: "0.8rem",
  color: "#9ca3af",
  marginTop: "0.125rem",
};

export const headerLogoutButton = {
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
};

export const headerLogoutButtonHover = {
  background: "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)",
  transform: "translateY(-2px)",
  boxShadow: "0 4px 8px rgba(220, 38, 38, 0.2)",
};

export const contentArea = {
  flex: 1,
  padding: "2.5rem",
  overflowY: "auto",
};

// Statistics
export const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "1.5rem",
  marginBottom: "2.5rem",
};

export const statCard = {
  background: "#ffffff",
  borderRadius: "1rem",
  padding: "1.5rem",
  boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
  transition: "all 0.3s ease",
  cursor: "default",
};

export const statCardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

export const statCardTitle = {
  fontSize: "0.875rem",
  fontWeight: "600",
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "0.5rem",
};

export const statCardValue = {
  fontSize: "2.5rem",
  fontWeight: "700",
  color: "#1f2937",
};

export const statCardIcon = {
  width: "60px",
  height: "60px",
  borderRadius: "1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.75rem",
  color: "#ffffff",
};

// Quick Actions
export const quickActions = {
  marginTop: "2rem",
};

export const sectionTitle = {
  fontSize: "1.25rem",
  fontWeight: "700",
  color: "#1f2937",
  marginBottom: "1rem",
};

export const actionsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "1.5rem",
};

export const actionCard = {
  background: "#ffffff",
  borderRadius: "1rem",
  padding: "2rem",
  border: "2px solid #e5e7eb",
  cursor: "pointer",
  transition: "all 0.3s ease",
  textAlign: "center",
};

export const actionIcon = {
  fontSize: "3rem",
  marginBottom: "1rem",
};

export const actionTitle = {
  fontSize: "1.125rem",
  fontWeight: "700",
  color: "#1f2937",
  marginBottom: "0.5rem",
};

export const actionDesc = {
  fontSize: "0.875rem",
  color: "#6b7280",
};

// Search
export const searchContainer = {
  marginBottom: "1.5rem",
};

export const searchInput = {
  width: "100%",
  padding: "0.875rem 1.25rem",
  borderRadius: "0.75rem",
  border: "2px solid #e5e7eb",
  fontSize: "0.95rem",
  outline: "none",
  transition: "all 0.2s ease",
};

export const searchInputFocus = {
  borderColor: "#667eea",
  boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
};

// Table
export const tableWrapper = {
  background: "#ffffff",
  borderRadius: "1rem",
  overflow: "hidden",
  boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
};

export const table = {
  width: "100%",
  borderCollapse: "collapse",
};

export const tableHeadRow = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#ffffff",
};

export const th = {
  padding: "1rem 1.25rem",
  textAlign: "left",
  fontWeight: "600",
  fontSize: "0.875rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

export const tableRow = {
  borderBottom: "1px solid #e5e7eb",
  transition: "all 0.2s ease",
};

export const tableRowHover = {
  background: "#f9fafb",
};

export const td = {
  padding: "1rem 1.25rem",
  fontSize: "0.9rem",
  color: "#4b5563",
};

export const predictButton = {
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem",
  border: "none",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#ffffff",
  fontWeight: "600",
  fontSize: "0.875rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export const predictButtonHover = {
  transform: "translateY(-2px)",
  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
};

export const deleteButton = {
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem",
  border: "none",
  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  color: "#ffffff",
  fontWeight: "600",
  fontSize: "0.875rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export const emailButton = {
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem",
  border: "none",
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  color: "#ffffff",
  fontWeight: "600",
  fontSize: "0.875rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export const editButton = {
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem",
  border: "none",
  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  color: "#ffffff",
  fontWeight: "600",
  fontSize: "0.875rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

// Modal
export const modalOverlay = {
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
};

export const modal = {
  background: "#ffffff",
  borderRadius: "1rem",
  maxWidth: "700px",
  width: "90%",
  maxHeight: "90vh",
  overflow: "auto",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  animation: "scaleIn 0.3s ease",
};

export const modalHeader = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "1.5rem 2rem",
  borderBottom: "1px solid #e5e7eb",
  position: "relative",
};

export const modalIcon = {
  fontSize: "2rem",
};

export const modalTitle = {
  flex: 1,
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#1f2937",
  margin: 0,
};

export const closeButton = {
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
};

export const closeButtonHover = {
  background: "#e5e7eb",
  color: "#1f2937",
};

// Form
export const form = {
  padding: "2rem",
};

export const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "1.25rem",
  marginBottom: "1.5rem",
};

export const formGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

export const label = {
  fontSize: "0.875rem",
  fontWeight: "600",
  color: "#374151",
};

export const input = {
  padding: "0.75rem 1rem",
  borderRadius: "0.5rem",
  border: "2px solid #e5e7eb",
  fontSize: "0.95rem",
  outline: "none",
  transition: "all 0.2s ease",
};

export const select = {
  padding: "0.75rem 1rem",
  borderRadius: "0.5rem",
  border: "2px solid #e5e7eb",
  fontSize: "0.95rem",
  outline: "none",
  transition: "all 0.2s ease",
  background: "#ffffff",
};

export const submitButton = {
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
};

export const submitButtonHover = {
  transform: "translateY(-2px)",
  boxShadow: "0 8px 16px rgba(102, 126, 234, 0.4)",
};

export const submitButtonDisabled = {
  opacity: 0.6,
  cursor: "not-allowed",
};

export const errorText = {
  color: "#dc2626",
  fontSize: "0.9rem",
  marginBottom: "1rem",
};

// Result Card
export const resultCard = {
  marginTop: "1.5rem",
  padding: "1.5rem",
  borderRadius: "0.75rem",
  background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
  border: "2px solid #10b981",
};

export const resultTitle = {
  fontWeight: "700",
  fontSize: "1.25rem",
  marginBottom: "1rem",
  color: "#065f46",
};

export const resultGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "0.75rem",
  fontSize: "0.875rem",
  color: "#047857",
};

// Empty State
export const emptyState = {
  textAlign: "center",
  padding: "4rem 2rem",
  background: "#ffffff",
  borderRadius: "1rem",
  boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
};

export const emptyIcon = {
  fontSize: "4rem",
  marginBottom: "1rem",
};

export const emptyText = {
  fontSize: "1.125rem",
  color: "#6b7280",
  fontWeight: "500",
};

// Grade Cards
export const gradeCard = {
  background: "#ffffff",
  borderRadius: "1rem",
  padding: "1.5rem",
  marginBottom: "1.5rem",
  boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
};

export const gradeCardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
  paddingBottom: "1rem",
  borderBottom: "2px solid #e5e7eb",
};

export const gradeCardTitle = {
  fontSize: "1.25rem",
  fontWeight: "700",
  color: "#1f2937",
  margin: 0,
};

export const gradeCardSubtitle = {
  fontSize: "0.875rem",
  color: "#6b7280",
  margin: "0.25rem 0 0 0",
};

export const gradeCardEmpty = {
  textAlign: "center",
  padding: "2rem",
  color: "#9ca3af",
  fontStyle: "italic",
};

// Loading
export const loadingContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "4rem 2rem",
  background: "#ffffff",
  borderRadius: "1rem",
  boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
};

export const spinner = {
  width: "48px",
  height: "48px",
  border: "4px solid #e5e7eb",
  borderTop: "4px solid #667eea",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
  marginBottom: "1rem",
};

// Collected styles object for easier use

// Confirmation Modal
export const confirmModalContainer = {
  background: "white",
  borderRadius: "0.75rem",
  maxWidth: "450px",
  width: "90%",
  padding: "2rem",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  animation: "scaleIn 0.3s ease",
};

export const confirmModalHeader = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  marginBottom: "1rem",
};

export const confirmModalTitle = {
  margin: 0,
  fontSize: "1.125rem",
  fontWeight: "600",
  color: "#1f2937",
};

export const confirmModalDescription = {
  margin: "0 0 1.5rem 0",
  color: "#6b7280",
  fontSize: "0.875rem",
  lineHeight: "1.5",
};

export const confirmModalFooter = {
  display: "flex",
  gap: "0.75rem",
  justifyContent: "flex-end",
};

export const confirmModalButtonCancel = {
  padding: "0.625rem 1.25rem",
  background: "white",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "0.375rem",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "0.875rem",
  transition: "all 0.2s",
};

export const confirmModalButtonConfirm = {
  padding: "0.625rem 1.25rem",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "0.375rem",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "0.875rem",
  transition: "all 0.2s",
};

// Toast
export const toastContainer = {
  position: "fixed",
  top: "2rem",
  right: "2rem",
  color: "white",
  padding: "1rem 1.5rem",
  borderRadius: "0.5rem",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  zIndex: 10000,
  animation: "slideIn 0.3s ease-out",
};

// Color Variants
export const blueGradient = "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)";
export const greenGradient = "linear-gradient(135deg, #10b981 0%, #047857 100%)";
export const orangeGradient = "linear-gradient(135deg, #f97316 0%, #ea580c 100%)";

export const statCardIconBlue = {
  ...statCardIcon,
  background: blueGradient,
};

export const statCardIconGreen = {
  ...statCardIcon,
  background: greenGradient,
};

export const statCardIconOrange = {
  ...statCardIcon,
  background: orangeGradient,
};

export const styles = {
  page,
  sidebar,
  sidebarHeader,
  logo,
  logoText,
  nav,
  navItem,
  navItemHover,
  navItemActive,
  navIcon,
  mainContent,
  header,
  headerTitle,
  headerSubtitle,
  headerRight,
  headerUserProfile,
  headerUserAvatar,
  headerUserDetails,
  headerUserName,
  headerUserFullName,
  headerUserRole,
  headerUserClass,
  headerLogoutButton,
  headerLogoutButtonHover,
  contentArea,
  statsGrid,
  statCard,
  statCardHeader,
  statCardTitle,
  statCardValue,
  statCardIcon,
  statCardIconBlue,
  statCardIconGreen,
  statCardIconOrange,
  quickActions,
  sectionTitle,
  actionsGrid,
  actionCard,
  actionIcon,
  actionTitle,
  actionDesc,
  searchContainer,
  searchInput,
  searchInputFocus,
  tableWrapper,
  table,
  tableHeadRow,
  th,
  tableRow,
  tableRowHover,
  td,
  predictButton,
  predictButtonHover,
  deleteButton,
  emailButton,
  editButton,
  modalOverlay,
  modal,
  modalHeader,
  modalIcon,
  modalTitle,
  closeButton,
  closeButtonHover,
  form,
  formGrid,
  formGroup,
  label,
  input,
  select,
  submitButton,
  submitButtonHover,
  submitButtonDisabled,
  errorText,
  resultCard,
  resultTitle,
  resultGrid,
  emptyState,
  emptyIcon,
  emptyText,
  gradeCard,
  gradeCardHeader,
  gradeCardTitle,
  gradeCardSubtitle,
  gradeCardEmpty,
  loadingContainer,
  spinner,
  confirmModalContainer,
  confirmModalHeader,
  confirmModalTitle,
  confirmModalDescription,
  confirmModalFooter,
  confirmModalButtonCancel,
  confirmModalButtonConfirm,
  toastContainer,
  blueGradient,
  greenGradient,
  orangeGradient,
};

export default styles;
