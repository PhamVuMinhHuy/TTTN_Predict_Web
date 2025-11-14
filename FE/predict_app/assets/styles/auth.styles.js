// UI-only style objects for the Auth component
export const containerStyle = {
  fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
  padding: "48px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #eef2ff 0%, #eff6ff 45%, #f8fafc 100%)",
};

export const cardStyle = {
  width: "100%",
  maxWidth: 1200,
  /* let content define height but keep a comfortable minimum */
  minHeight: 400,
  background: "rgba(255,255,255,0.98)",
  padding: 0,
  borderRadius: 12,
  boxShadow: "0 12px 30px rgba(2,6,23,0.12)",
  border: "1px solid rgba(15,23,42,0.04)",
  display: "flex",
  overflow: "hidden",
};

export const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 18,
};
export const brandStyle = { fontWeight: 800, fontSize: 28, color: "#0f172a" };
export const subtitleStyle = { color: "#64748b", fontSize: 20, marginTop: 8 };

export const tabsStyle = { display: "flex", gap: 8, marginBottom: 20 };
export const tabButtonInactive = {
  padding: "8px 12px",
  borderRadius: 8,
  background: "transparent",
  border: "none",
  color: "#64748b",
  cursor: "pointer",
};
export const tabButtonActive = {
  padding: "8px 12px",
  borderRadius: 8,
  background: "#0ea5a0",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export const formStyle = { display: "grid", gap: 12 };
export const labelStyle = {
  display: "block",
  fontSize: 20,
  fontWeight: 600,
  color: "#334155",
  marginBottom: 6,
};
export const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid rgba(15,23,42,0.08)",
  boxSizing: "border-box",
  outline: "none",
  fontSize: 20,
  background: "#ffffff",
};

export const actionsStyle = { marginTop: 18, display: "flex", gap: 12 };
export const primaryButton = {
  padding: "12px 16px",
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: 999,
  cursor: "pointer",
  fontWeight: 700,
  width: "100%",
};
export const secondaryButton = {
  padding: "10px 14px",
  background: "transparent",
  color: "#0f172a",
  border: "1px solid rgba(15,23,42,0.06)",
  borderRadius: 8,
  cursor: "pointer",
};

export const smallLink = {
  fontSize: 20,
  color: "#0f172a",
  cursor: "pointer",
  textDecoration: "underline",
  background: "none",
  border: "none",
  padding: 0,
};

export const footerStyle = {
  marginTop: 12,
  fontSize: 20,
  color: "#475569",
  textAlign: "center",
};

export const passwordInputWrapper = {
  position: "relative",
  width: "100%",
};

export const passwordToggleIcon = {
  position: "absolute",
  right: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "20px",
  userSelect: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "24px",
  height: "24px",
  color: "#64748b",
  transition: "color 0.2s ease",
};

// Info Panel Styles
export const infoPanelStyle = {
  flex: 1,
  padding: "32px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "12px",
  color: "#ffffff",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

export const infoBadge = {
  display: "inline-block",
  padding: "6px 12px",
  background: "rgba(255, 255, 255, 0.2)",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 600,
  marginBottom: "16px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

export const infoTitle = {
  fontSize: "28px",
  fontWeight: 700,
  marginBottom: "12px",
  lineHeight: 1.3,
  color: "#ffffff",
};

export const infoSubtitle = {
  fontSize: "16px",
  lineHeight: 1.6,
  opacity: 0.95,
  marginBottom: "24px",
  color: "#ffffff",
};

export const infoList = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

export const infoListItem = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  fontSize: "15px",
  lineHeight: 1.5,
  color: "#ffffff",
};

export const infoListIcon = {
  fontSize: "20px",
  flexShrink: 0,
  marginTop: "2px",
};

export const infoFooter = {
  marginTop: "24px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  opacity: 0.9,
  color: "#ffffff",
};

// Form Panel Styles
export const formPanelStyle = {
  flex: 1,
  padding: "32px",
  display: "flex",
  flexDirection: "column",
};

export const supportText = {
  fontSize: "14px",
  color: "#64748b",
  marginTop: "8px",
  lineHeight: 1.5,
};