// Modern Landing Page Styles - Study Theme 2025 (Improved Readability)
export const landingContainer = {
  fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
  minHeight: "100vh",
  background: `
    linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)
  `,
  color: "#ffffff",
};

export const container = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 24px",
};

// Hero Section
export const hero = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "100px 48px 80px",
  maxWidth: "1400px",
  margin: "0 auto",
  gap: "60px",
  position: "relative",
  overflow: "hidden",
};

export const heroContent = {
  flex: 1,
  maxWidth: "600px",
  zIndex: 1,
};

export const heroTitle = {
  fontSize: "56px",
  fontWeight: "800",
  lineHeight: "1.1",
  marginBottom: "24px",
  color: "#ffffff",
  textShadow: "0 2px 20px rgba(59, 130, 246, 0.3)",
};

export const heroSubtitle = {
  fontSize: "20px",
  lineHeight: "1.7",
  color: "#e2e8f0",
  marginBottom: "40px",
  maxWidth: "500px",
};

export const ctaButton = {
  display: "inline-flex",
  alignItems: "center",
  gap: "12px",
  padding: "18px 36px",
  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
  color: "#ffffff",
  border: "none",
  borderRadius: "16px",
  fontSize: "18px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 8px 30px rgba(59, 130, 246, 0.4)",
  letterSpacing: "0.025em",
};

export const ctaButtonHover = {
  transform: "translateY(-4px)",
  boxShadow: "0 16px 40px rgba(59, 130, 246, 0.5)",
};

export const heroImage = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1,
};

// Mock Chart
export const mockChart = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  padding: "32px",
  width: "100%",
  maxWidth: "450px",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
};

export const chartTitle = {
  fontSize: "18px",
  fontWeight: "700",
  marginBottom: "28px",
  color: "#ffffff",
  textAlign: "center",
};

export const chartBars = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-around",
  height: "220px",
  gap: "16px",
};

export const chartBar = {
  width: "60px",
  borderRadius: "12px 12px 0 0",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: "12px 0",
  cursor: "pointer",
  position: "relative",
};

export const chartBarHover = {
  transform: "translateY(-8px) scaleY(1.05)",
  filter: "brightness(1.15)",
};

export const barLabel = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#ffffff",
  marginTop: "auto",
  textShadow: "0 1px 3px rgba(0,0,0,0.3)",
};

// Features Section
export const featuresSection = {
  padding: "100px 48px",
  background: "rgba(255, 255, 255, 0.03)",
};

export const sectionTitle = {
  fontSize: "42px",
  fontWeight: "800",
  textAlign: "center",
  marginBottom: "60px",
  color: "#ffffff",
  textShadow: "0 2px 20px rgba(59, 130, 246, 0.3)",
};

export const featuresGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "28px",
  maxWidth: "1200px",
  margin: "0 auto",
};

export const featureCard = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  padding: "36px 28px",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

export const featureCardHover = {
  transform: "translateY(-8px)",
  background: "rgba(255, 255, 255, 0.12)",
  borderColor: "rgba(59, 130, 246, 0.5)",
  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)",
};

export const featureIcon = {
  width: "72px",
  height: "72px",
  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "36px",
  marginBottom: "24px",
  boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
};

export const featureTitle = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#ffffff",
  marginBottom: "14px",
};

export const featureDesc = {
  fontSize: "16px",
  lineHeight: "1.7",
  color: "#cbd5e1",
  margin: 0,
};

// How It Works Section
export const howItWorks = {
  padding: "100px 48px",
  background: "transparent",
};

export const stepsContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  flexWrap: "wrap",
  gap: "24px",
  maxWidth: "1100px",
  margin: "0 auto",
};

export const step = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  maxWidth: "300px",
  flex: 1,
  minWidth: "250px",
};

export const stepNumber = {
  width: "80px",
  height: "80px",
  borderRadius: "24px",
  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "32px",
  fontWeight: "800",
  marginBottom: "24px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
  cursor: "pointer",
};

export const stepNumberHover = {
  transform: "scale(1.1) rotate(5deg)",
  boxShadow: "0 12px 35px rgba(59, 130, 246, 0.5)",
};

export const stepContent = {
  padding: "0 16px",
};

export const stepContentTitle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#ffffff",
  marginBottom: "12px",
};

export const stepContentDesc = {
  fontSize: "15px",
  lineHeight: "1.7",
  color: "#cbd5e1",
  margin: 0,
};

export const stepArrow = {
  fontSize: "36px",
  color: "#60a5fa",
  display: "flex",
  alignItems: "center",
  paddingTop: "20px",
  fontWeight: "300",
};

// CTA Section
export const ctaSection = {
  padding: "100px 48px",
  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  textAlign: "center",
};

export const ctaTitle = {
  fontSize: "40px",
  fontWeight: "800",
  marginBottom: "20px",
  color: "#ffffff",
  textShadow: "0 2px 15px rgba(59, 130, 246, 0.3)",
};

export const ctaSubtitle = {
  fontSize: "18px",
  lineHeight: "1.7",
  color: "#e2e8f0",
  maxWidth: "600px",
  margin: "0 auto 40px",
};

// Footer
export const footer = {
  padding: "32px 48px",
  background: "rgba(0, 0, 0, 0.3)",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
};

export const footerText = {
  textAlign: "center",
  color: "#94a3b8",
  fontSize: "14px",
  margin: 0,
  fontWeight: "500",
};