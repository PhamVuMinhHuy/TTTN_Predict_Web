// UI-only style objects for the Auth component
export const containerStyle = {
  fontFamily: "Inter, Roboto, Arial, sans-serif",
  padding: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  // Background image is provided by the page; keep transparent layer for contrast
  backgroundSize: "cover",
};

export const cardStyle = {
  width: "100%",
  maxWidth: 760,
  /* let content define height but keep a comfortable minimum */
  minHeight: 400,
  background: "rgba(255,255,255,0.98)",
  padding: "32px",
  borderRadius: 12,
  boxShadow: "0 12px 30px rgba(2,6,23,0.12)",
  border: "1px solid rgba(15,23,42,0.04)",
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