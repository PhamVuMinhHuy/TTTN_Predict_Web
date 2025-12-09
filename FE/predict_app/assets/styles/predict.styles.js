// Modern Predict Page Styles - Study Theme 2025 (Improved Readability)
export const predictContainer = {
  fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
  minHeight: "100vh",
  background: `
    radial-gradient(ellipse at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(78, 205, 196, 0.15) 0%, transparent 50%),
    linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)
  `,
};

export const predictContent = {
  maxWidth: "800px",
  margin: "0 auto",
  padding: "40px 24px 80px",
};

export const predictTitle = {
  fontSize: "36px",
  fontWeight: "800",
  textAlign: "center",
  marginBottom: "40px",
  color: "#ffffff",
  textShadow: "0 2px 10px rgba(102, 126, 234, 0.3)",
};

export const predictForm = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  borderRadius: "28px",
  padding: "40px",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
};

export const formGroup = {
  marginBottom: "24px",
};

export const formLabel = {
  display: "block",
  fontSize: "15px",
  fontWeight: "600",
  color: "#ffffff",
  marginBottom: "10px",
  letterSpacing: "0.025em",
};

export const formInput = {
  width: "100%",
  padding: "16px 20px",
  borderRadius: "14px",
  border: "2px solid rgba(255, 255, 255, 0.25)",
  background: "rgba(30, 27, 75, 0.8)",
  color: "#ffffff",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

export const formInputFocus = {
  borderColor: "#60a5fa",
  background: "rgba(96, 165, 250, 0.15)",
  boxShadow: "0 0 0 4px rgba(96, 165, 250, 0.2)",
};

export const formInputError = {
  borderColor: "#f87171",
  background: "rgba(248, 113, 113, 0.15)",
  boxShadow: "0 0 0 4px rgba(248, 113, 113, 0.2)",
};

export const errorMessage = {
  color: "#fca5a5",
  fontSize: "13px",
  marginTop: "8px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

export const submitButton = {
  width: "100%",
  padding: "18px 24px",
  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
  color: "#ffffff",
  border: "none",
  borderRadius: "16px",
  fontSize: "18px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
  letterSpacing: "0.025em",
  marginTop: "16px",
};

export const submitButtonHover = {
  transform: "translateY(-3px)",
  boxShadow: "0 14px 35px rgba(59, 130, 246, 0.5)",
};

export const submitButtonDisabled = {
  opacity: 0.5,
  cursor: "not-allowed",
  transform: "none",
  boxShadow: "none",
};

// Result Container
export const resultContainer = {
  marginTop: "40px",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  borderRadius: "28px",
  padding: "40px",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
  animation: "slideUp 0.5s ease-out",
};

export const resultTitle = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#ffffff",
  marginBottom: "24px",
  textAlign: "center",
};

export const resultGrade = {
  fontSize: "72px",
  fontWeight: "800",
  textAlign: "center",
  marginBottom: "32px",
  color: "#34d399",
  textShadow: "0 4px 15px rgba(52, 211, 153, 0.4)",
};

export const resultDetails = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
  padding: "24px",
  background: "rgba(255, 255, 255, 0.08)",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "#ffffff",
};

export const resultDetailItem = {
  padding: "12px 16px",
  background: "rgba(255, 255, 255, 0.08)",
  borderRadius: "12px",
  color: "#ffffff",
  fontSize: "14px",
};

// Radio button styles
export const radioGroup = {
  display: "flex",
  gap: "24px",
  marginTop: "12px",
};

export const radioLabel = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
  color: "#ffffff",
  fontSize: "15px",
  padding: "12px 20px",
  background: "rgba(255, 255, 255, 0.08)",
  borderRadius: "12px",
  border: "2px solid rgba(255, 255, 255, 0.15)",
  transition: "all 0.2s ease",
};

export const radioLabelActive = {
  borderColor: "#60a5fa",
  background: "rgba(96, 165, 250, 0.2)",
};

export const radioInput = {
  width: "20px",
  height: "20px",
  accentColor: "#60a5fa",
  cursor: "pointer",
};
