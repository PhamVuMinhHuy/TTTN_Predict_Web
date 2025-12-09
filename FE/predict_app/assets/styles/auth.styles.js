// Modern UI style objects for the Auth component - Study Theme
export const containerStyle = {
  fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  background: `
    radial-gradient(ellipse at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(78, 205, 196, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 40% 40%, rgba(255, 107, 107, 0.15) 0%, transparent 50%),
    linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)
  `,
  position: "relative",
  overflow: "hidden",
};

export const floatingShapes = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  overflow: "hidden",
  zIndex: 0,
};

export const cardStyle = {
  width: "100%",
  maxWidth: 1100,
  minHeight: 600,
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  padding: 0,
  borderRadius: 24,
  boxShadow: `
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5)
  `,
  display: "flex",
  overflow: "hidden",
  position: "relative",
  zIndex: 1,
};

export const headerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  marginBottom: 28,
};

export const brandStyle = {
  fontWeight: 800,
  fontSize: 32,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  marginBottom: 4,
};

export const subtitleStyle = {
  color: "#64748b",
  fontSize: 16,
  marginTop: 8,
  fontWeight: 400,
};

export const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 20,
};

export const labelStyle = {
  display: "block",
  fontSize: 14,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 8,
  letterSpacing: "0.025em",
};

export const inputStyle = {
  width: "100%",
  padding: "16px 18px",
  borderRadius: 12,
  border: "2px solid #e5e7eb",
  boxSizing: "border-box",
  outline: "none",
  fontSize: 16,
  background: "#f9fafb",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  color: "#1f2937",
};

export const inputFocusStyle = {
  borderColor: "#667eea",
  background: "#ffffff",
  boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)",
};

export const primaryButton = {
  padding: "16px 24px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 16,
  width: "100%",
  marginTop: 8,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  letterSpacing: "0.025em",
};

export const primaryButtonHover = {
  transform: "translateY(-2px)",
  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.5)",
};

export const secondaryButton = {
  padding: "12px 18px",
  background: "transparent",
  color: "#667eea",
  border: "2px solid #667eea",
  borderRadius: 12,
  cursor: "pointer",
  fontWeight: 600,
  transition: "all 0.3s ease",
};

export const smallLink = {
  fontSize: 14,
  color: "#667eea",
  cursor: "pointer",
  textDecoration: "none",
  background: "none",
  border: "none",
  padding: 0,
  fontWeight: 600,
  transition: "all 0.2s ease",
};

export const smallLinkHover = {
  color: "#764ba2",
  textDecoration: "underline",
};

export const footerStyle = {
  marginTop: 20,
  fontSize: 14,
  color: "#6b7280",
  textAlign: "center",
};

export const passwordInputWrapper = {
  position: "relative",
  width: "100%",
};

export const passwordToggleIcon = {
  position: "absolute",
  right: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "20px",
  userSelect: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "28px",
  height: "28px",
  color: "#9ca3af",
  transition: "all 0.2s ease",
  borderRadius: "6px",
};

export const passwordToggleIconHover = {
  color: "#667eea",
  background: "rgba(102, 126, 234, 0.1)",
};

// Info Panel Styles - Left side with study theme
export const infoPanelStyle = {
  flex: 1,
  padding: "48px 40px",
  background: `
    linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f97316 100%)
  `,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  overflow: "hidden",
};

export const infoPanelOverlay = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
  `,
  opacity: 0.5,
};

export const infoBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 18px",
  background: "rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(10px)",
  borderRadius: "50px",
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "28px",
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: "#ffffff",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  position: "relative",
  zIndex: 1,
};

export const infoTitle = {
  fontSize: "36px",
  fontWeight: 800,
  marginBottom: "16px",
  lineHeight: 1.2,
  color: "#ffffff",
  position: "relative",
  zIndex: 1,
  textShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
};

export const infoSubtitle = {
  fontSize: "17px",
  lineHeight: 1.7,
  opacity: 0.95,
  marginBottom: "32px",
  color: "#ffffff",
  position: "relative",
  zIndex: 1,
  maxWidth: "90%",
};

export const infoList = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  position: "relative",
  zIndex: 1,
};

export const infoListItem = {
  display: "flex",
  alignItems: "flex-start",
  gap: "16px",
  fontSize: "15px",
  lineHeight: 1.6,
  color: "rgba(255, 255, 255, 0.95)",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  padding: "16px 20px",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  transition: "all 0.3s ease",
};

export const infoListItemHover = {
  background: "rgba(255, 255, 255, 0.15)",
  transform: "translateX(8px)",
};

export const infoListIcon = {
  fontSize: "24px",
  flexShrink: 0,
  width: "44px",
  height: "44px",
  background: "rgba(255, 255, 255, 0.2)",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const infoFooter = {
  marginTop: "36px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  fontSize: "15px",
  color: "rgba(255, 255, 255, 0.9)",
  position: "relative",
  zIndex: 1,
  background: "rgba(255, 255, 255, 0.1)",
  padding: "14px 20px",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.15)",
};

// Form Panel Styles - Right side
export const formPanelStyle = {
  flex: 1,
  padding: "48px 48px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  background: "#ffffff",
};

export const supportText = {
  fontSize: "14px",
  color: "#9ca3af",
  marginTop: "4px",
  lineHeight: 1.5,
  fontWeight: 400,
};

// Decorative elements
export const decorCircle1 = {
  position: "absolute",
  width: "300px",
  height: "300px",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.05)",
  top: "-100px",
  right: "-100px",
  zIndex: 0,
};

export const decorCircle2 = {
  position: "absolute",
  width: "200px",
  height: "200px",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.05)",
  bottom: "-50px",
  left: "-50px",
  zIndex: 0,
};

// Study-themed icons section
export const studyIconsContainer = {
  display: "flex",
  gap: "16px",
  marginTop: "24px",
  position: "relative",
  zIndex: 1,
};

export const studyIcon = {
  width: "48px",
  height: "48px",
  background: "rgba(255, 255, 255, 0.15)",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  transition: "all 0.3s ease",
  cursor: "default",
};

export const studyIconHover = {
  background: "rgba(255, 255, 255, 0.25)",
  transform: "translateY(-4px)",
};

// Error message style
export const errorMessageStyle = {
  color: "#ef4444",
  backgroundColor: "rgba(239, 68, 68, 0.1)",
  padding: "14px 18px",
  borderRadius: "12px",
  marginBottom: "16px",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  border: "1px solid rgba(239, 68, 68, 0.2)",
};

// Social login divider
export const dividerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  margin: "24px 0",
  color: "#9ca3af",
  fontSize: "13px",
};

export const dividerLine = {
  flex: 1,
  height: "1px",
  background: "linear-gradient(90deg, transparent, #e5e7eb, transparent)",
};

// Welcome illustration area
export const illustrationArea = {
  position: "relative",
  marginBottom: "24px",
  zIndex: 1,
};

export const welcomeEmoji = {
  fontSize: "64px",
  display: "block",
  marginBottom: "16px",
  filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
};

// Animation keyframes (to be added in CSS)
export const animationStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  @keyframes slideInFromLeft {
    0% { transform: translateX(-30px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideInFromRight {
    0% { transform: translateX(30px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// Tabs style (for potential future use)
export const tabsStyle = { display: "flex", gap: 8, marginBottom: 20 };
export const tabButtonInactive = {
  padding: "10px 16px",
  borderRadius: 10,
  background: "transparent",
  border: "2px solid #e5e7eb",
  color: "#6b7280",
  cursor: "pointer",
  fontWeight: 600,
  transition: "all 0.2s ease",
};
export const tabButtonActive = {
  padding: "10px 16px",
  borderRadius: 10,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  border: "2px solid transparent",
  cursor: "pointer",
  fontWeight: 600,
};

export const actionsStyle = { marginTop: 18, display: "flex", gap: 12 };