export const adminPage = {
  minHeight: "100vh",
  backgroundColor: "#f3f4f6",
  padding: "2rem",
  fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont",
};

export const adminContainer = {
  maxWidth: "1200px",
  margin: "0 auto",
};

export const adminHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem",
};

export const adminHeaderTitle = {
  margin: 0,
  fontSize: "1.9rem",
  fontWeight: 700,
  color: "#111827",
};

export const adminHeaderSubtitle = {
  margin: "0.25rem 0 0",
  color: "#6b7280",
  fontSize: "0.95rem",
};

export const adminHeaderRight = {
  display: "flex",
  gap: "0.5rem",
  alignItems: "center",
};

export const adminRoleText = {
  color: "#4b5563",
  fontSize: "0.9rem",
};

export const adminTag = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.25rem",
  padding: "0.25rem 0.5rem",
  borderRadius: "999px",
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

export const buttonBase = {
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: 500,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  transition: "all 0.2s ease",
};

export const backHomeButton = {
  ...buttonBase,
  backgroundColor: "#3b82f6",
  color: "#fff",
};

export const logoutButton = {
  ...buttonBase,
  backgroundColor: "#ef4444",
  color: "#fff",
};

export const backHomeButtonHover = {
  backgroundColor: "#2563eb",
  transform: "translateY(-1px)",
  boxShadow: "0 4px 10px rgba(59,130,246,0.35)",
};

export const logoutButtonHover = {
  backgroundColor: "#b91c1c",
  transform: "translateY(-1px)",
  boxShadow: "0 4px 10px rgba(248,113,113,0.35)",
};

export const adminGrid = {
  display: "grid",
  gridTemplateColumns: "1.4fr 1fr",
  gap: "1.5rem",
  alignItems: "flex-start",
};

export const card = {
  backgroundColor: "#ffffff",
  borderRadius: "0.9rem",
  padding: "1.5rem",
  boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
  border: "1px solid #e5e7eb",
};

export const cardTitleRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
};

export const cardTitle = {
  margin: 0,
  fontSize: "1.1rem",
  fontWeight: 600,
  color: "#111827",
};

export const badge = {
  padding: "0.25rem 0.6rem",
  borderRadius: "999px",
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
  fontSize: "0.75rem",
  fontWeight: 600,
};

export const tableWrapper = {
  borderRadius: "0.75rem",
  border: "1px solid #e5e7eb",
  overflow: "hidden",
};

export const table = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.875rem",
};

export const tableHeadRow = {
  backgroundColor: "#f9fafb",
};

export const th = {
  textAlign: "left",
  padding: "0.6rem 0.75rem",
  fontWeight: 600,
  color: "#4b5563",
  borderBottom: "1px solid #e5e7eb",
  whiteSpace: "nowrap",
};

export const td = {
  padding: "0.6rem 0.75rem",
  borderBottom: "1px solid #e5e7eb",
  color: "#111827",
  verticalAlign: "top",
};

export const tdCenter = {
  ...td,
  textAlign: "center",
};

export const row = {
  backgroundColor: "#ffffff",
};

export const rowHover = {
  backgroundColor: "#f9fafb",
};

export const rolePill = {
  display: "inline-flex",
  alignItems: "center",
  padding: "0.2rem 0.5rem",
  fontSize: "0.75rem",
  borderRadius: "999px",
  fontWeight: 500,
};

export const roleUser = {
  ...rolePill,
  backgroundColor: "#ecfdf3",
  color: "#16a34a",
};

export const roleAdmin = {
  ...rolePill,
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
};

export const userSelfTag = {
  fontSize: "0.75rem",
  color: "#6b7280",
  fontStyle: "italic",
};

export const deleteButton = {
  padding: "0.25rem 0.6rem",
  borderRadius: "0.4rem",
  border: "none",
  backgroundColor: "#fee2e2",
  color: "#b91c1c",
  fontSize: "0.75rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export const deleteButtonHover = {
  backgroundColor: "#fecaca",
  transform: "translateY(-1px)",
  boxShadow: "0 3px 8px rgba(248,113,113,0.4)",
};

export const emptyState = {
  padding: "1.25rem",
  textAlign: "center",
  color: "#6b7280",
  fontSize: "0.9rem",
};

export const errorText = {
  marginTop: "0.75rem",
  color: "#b91c1c",
  fontSize: "0.85rem",
};

export const form = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

export const formRow = {
  display: "grid",
  gridTemplateColumns: "1.1fr 1.1fr",
  gap: "0.75rem",
};

export const formGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
};

export const label = {
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#4b5563",
};

export const input = {
  width: "100%",
  padding: "0.5rem 0.65rem",
  borderRadius: "0.5rem",
  border: "1px solid #d1d5db",
  fontSize: "0.85rem",
  outline: "none",
  transition: "all 0.15s ease",
};

export const inputFocus = {
  borderColor: "#3b82f6",
  boxShadow: "0 0 0 1px rgba(59,130,246,0.3)",
};

export const select = {
  ...input,
};

export const submitButton = {
  marginTop: "0.4rem",
  width: "100%",
  padding: "0.65rem",
  borderRadius: "0.6rem",
  border: "none",
  backgroundColor: "#10b981",
  color: "#fff",
  fontWeight: 600,
  fontSize: "0.9rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export const submitButtonDisabled = {
  backgroundColor: "#9ca3af",
  cursor: "default",
};

export const submitButtonHover = {
  backgroundColor: "#059669",
  transform: "translateY(-1px)",
  boxShadow: "0 4px 12px rgba(16,185,129,0.6)",
};

export const helpText = {
  marginTop: "0.25rem",
  fontSize: "0.75rem",
  color: "#6b7280",
};
