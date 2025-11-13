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
  maxWidth: 960,
  background: "#ffffff",
  padding: 0,
  borderRadius: 20,
  boxShadow: "0 25px 60px rgba(15, 23, 42, 0.12)",
  border: "1px solid rgba(59, 130, 246, 0.14)",
  display: "flex",
  flexWrap: "wrap",
  overflow: "hidden",
};

export const infoPanelStyle = {
  background: "linear-gradient(160deg, #1d4ed8 0%, #312e81 55%, #4338ca 100%)",
  color: "#e0e7ff",
  padding: "44px 40px",
  display: "flex",
  flexDirection: "column",
  gap: 32,
  flex: "1 1 320px",
  minWidth: 280,
};

export const infoBadge = {
  alignSelf: "flex-start",
  background: "rgba(255, 255, 255, 0.18)",
  color: "#e0e7ff",
  padding: "6px 14px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: 0.6,
  textTransform: "uppercase",
};

export const infoTitle = {
  fontSize: 30,
  fontWeight: 700,
  lineHeight: 1.4,
  color: "#fff",
  margin: 0,
};

export const infoSubtitle = {
  fontSize: 16,
  lineHeight: 1.7,
  opacity: 0.92,
  margin: 0,
};

export const infoList = {
  display: "grid",
  gap: 16,
  padding: 0,
  margin: 0,
  listStyle: "none",
};

export const infoListItem = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  fontSize: 15,
  lineHeight: 1.6,
  color: "#eef2ff",
};

export const infoListIcon = {
  fontSize: 18,
  lineHeight: 1,
  marginTop: 2,
};

export const infoFooter = {
  marginTop: "auto",
  fontSize: 14,
  color: "#c7d2fe",
  display: "flex",
  alignItems: "center",
  gap: 8,
};

export const formPanelStyle = {
  padding: "44px 48px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  background: "#ffffff",
  flex: "1 1 420px",
  minWidth: 320,
};

export const headerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginBottom: 24,
};
export const brandStyle = {
  fontWeight: 800,
  fontSize: 30,
  color: "#1d4ed8",
};
export const subtitleStyle = {
  color: "#1f2937",
  fontSize: 18,
  marginTop: 0,
  lineHeight: 1.5,
};

export const supportText = {
  fontSize: 14,
  color: "#64748b",
  margin: 0,
};

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

export const formStyle = { display: "grid", gap: 16 };
export const labelStyle = {
  display: "block",
  fontSize: 15,
  fontWeight: 600,
  color: "#0f172a",
  marginBottom: 8,
};
export const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid rgba(148, 163, 184, 0.6)",
  boxSizing: "border-box",
  outline: "none",
  fontSize: 16,
  background: "rgba(255,255,255,0.96)",
  transition: "border 0.2s ease, box-shadow 0.2s ease",
};

export const actionsStyle = { marginTop: 18, display: "flex", gap: 12 };
export const primaryButton = {
  padding: "14px 18px",
  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 60%, #312e81 100%)",
  color: "#fff",
  border: "none",
  borderRadius: 999,
  cursor: "pointer",
  fontWeight: 700,
  width: "100%",
  fontSize: 16,
  boxShadow: "0 12px 20px rgba(37, 99, 235, 0.25)",
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
};
export const secondaryButton = {
  padding: "10px 14px",
  background: "transparent",
  color: "#1d4ed8",
  border: "1px solid rgba(59, 130, 246, 0.5)",
  borderRadius: 12,
  cursor: "pointer",
};

export const smallLink = {
  fontSize: 16,
  color: "#2563eb",
  cursor: "pointer",
  textDecoration: "underline",
  background: "none",
  border: "none",
  padding: 0,
  fontWeight: 600,
};

export const footerStyle = {
  marginTop: 16,
  fontSize: 16,
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