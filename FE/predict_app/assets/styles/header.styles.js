// Modern Header Component Styles - Study Theme 2025

export const headerStyle = {
  background: "rgba(15, 12, 41, 0.95)",
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

export const headerContent = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "1rem 2rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "2rem",
};

export const logo = {
  display: "flex",
  alignItems: "center",
  fontSize: "1.5rem",
  fontWeight: 800,
  color: "#ffffff",
};

export const logoText = {
  marginLeft: "0.5rem",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

// Navigation Bar
export const navBar = {
  display: "flex",
  gap: "0.5rem",
  alignItems: "center",
  padding: "0.5rem",
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(10px)",
  borderRadius: "1rem",
  flex: 1,
  justifyContent: "center",
  maxWidth: "600px",
  margin: "0 auto",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  minWidth: "300px",
  flexShrink: 1,
};

export const navLink = {
  padding: "0.75rem 1.5rem",
  color: "rgba(255, 255, 255, 0.7)",
  textDecoration: "none",
  fontWeight: 600,
  fontSize: "0.95rem",
  borderRadius: "0.75rem",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  position: "relative",
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  letterSpacing: "0.01em",
  overflow: "hidden",
  flex: 1,
  textAlign: "center",
};

export const navLinkHover = {
  color: "#ffffff",
  background: "rgba(102, 126, 234, 0.2)",
  transform: "translateY(-1px)",
};

export const navLinkActive = {
  color: "#ffffff",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  fontWeight: 700,
  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  transform: "translateY(-1px)",
};

// User Menu
export const userMenuContainer = {
  position: "relative",
  flexShrink: 0,
};

export const userIconButton = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  border: "2px solid rgba(102, 126, 234, 0.5)",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.2rem",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
};

export const userIconButtonHover = {
  transform: "scale(1.08)",
  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.5)",
  borderColor: "rgba(102, 126, 234, 0.8)",
};

export const userDropdown = {
  position: "absolute",
  top: "55px",
  right: 0,
  background: "rgba(30, 27, 75, 0.98)",
  backdropFilter: "blur(20px)",
  borderRadius: "1rem",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
  minWidth: "220px",
  padding: "0.5rem 0",
  zIndex: 1000,
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

export const userInfo = {
  padding: "1rem 1.25rem",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
};

export const userName = {
  fontSize: "0.95rem",
  fontWeight: 700,
  color: "#ffffff",
  marginBottom: "0.25rem",
};

export const userEmail = {
  fontSize: "0.8rem",
  color: "rgba(255, 255, 255, 0.6)",
};

export const menuButton = {
  width: "100%",
  padding: "0.875rem 1.25rem",
  textAlign: "left",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: 600,
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
};

export const menuButtonSettings = {
  ...menuButton,
  color: "#a5b4fc",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
};

export const menuButtonSettingsHover = {
  background: "rgba(102, 126, 234, 0.15)",
  color: "#c4b5fd",
};

export const menuButtonLogout = {
  ...menuButton,
  color: "#fca5a5",
};

export const menuButtonLogoutHover = {
  background: "rgba(239, 68, 68, 0.15)",
  color: "#f87171",
};

// Auth Buttons
export const authButtons = {
  display: "flex",
  gap: "1rem",
};

export const loginBtn = {
  padding: "0.75rem 1.75rem",
  background: "transparent",
  color: "#a5b4fc",
  border: "2px solid rgba(102, 126, 234, 0.5)",
  borderRadius: "0.75rem",
  cursor: "pointer",
  fontWeight: 700,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  fontSize: "0.95rem",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
};

export const loginBtnHover = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#fff",
  borderColor: "transparent",
  transform: "translateY(-2px)",
  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
};
