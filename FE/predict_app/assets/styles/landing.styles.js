// Landing Page Styles

// Utility function to get hover styles
export const getHoverStyle = (baseStyle, hoverStyle) => ({
  ...baseStyle,
  ...hoverStyle,
});

// Utility function for responsive styles
export const getResponsiveStyle = (baseStyle, isMobile = false, isVeryMobile = false) => {
  if (isVeryMobile) {
    const mobileKey = `veryMobile${baseStyle.name || ''}`;
    const veryMobileStyle = mobileKey ? window[mobileKey] : {};
    return { ...baseStyle, ...veryMobileStyle };
  }
  if (isMobile) {
    const mobileKey = `mobile${baseStyle.name || ''}`;
    const mobileStyle = mobileKey ? window[mobileKey] : {};
    return { ...baseStyle, ...mobileStyle };
  }
  return baseStyle;
};

export const landingContainer = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  lineHeight: 1.6,
  color: '#333',
  margin: 0,
  padding: 0,
};

// Header Styles
export const header = {
  backgroundColor: '#fff',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

export const headerContent = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '1rem 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '2rem',
};

export const logo = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '1.5rem',
  fontWeight: 'bold',
};

export const logoText = {
  marginLeft: '0.5rem',
  color: '#3b82f6',
};

export const authButtons = {
  display: 'flex',
  gap: '1rem',
};

export const loginBtn = {
  padding: '0.5rem 1.5rem',
  backgroundColor: 'transparent',
  color: '#3b82f6',
  border: '1px solid #3b82f6',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontWeight: '500',
  transition: 'all 0.3s ease',
  fontSize: '0.9rem',
};

export const loginBtnHover = {
  backgroundColor: '#3b82f6',
  color: '#fff',
  transform: 'translateY(-1px)',
};

export const signupBtn = {
  padding: '0.5rem 1.5rem',
  backgroundColor: '#3b82f6',
  color: '#fff',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontWeight: '500',
  transition: 'all 0.3s ease',
  fontSize: '0.9rem',
};

export const signupBtnHover = {
  backgroundColor: '#2563eb',
  transform: 'translateY(-1px)',
};

// Navigation Bar Styles
export const navBar = {
  display: 'flex',
  gap: '0.25rem',
  alignItems: 'center',
  padding: '0.375rem',
  backgroundColor: '#f8fafc',
  borderRadius: '0.75rem',
  flex: 1,
  justifyContent: 'center',
  maxWidth: '600px',
  margin: '0 auto',
  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0',
  minWidth: '300px',
  flexShrink: 1,
};

export const navLink = {
  padding: '0.75rem 1.5rem',
  color: '#64748b',
  textDecoration: 'none',
  fontWeight: '500',
  fontSize: '0.95rem',
  borderRadius: '0.5rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  letterSpacing: '0.01em',
  overflow: 'hidden',
  flex: 1,
  textAlign: 'center',
};

export const navLinkHover = {
  color: '#3b82f6',
  backgroundColor: '#eff6ff',
  transform: 'translateY(-1px)',
  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
};

export const navLinkActive = {
  color: '#ffffff',
  backgroundColor: '#3b82f6',
  fontWeight: '600',
  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
  transform: 'translateY(-1px)',
};

// Hero Section
export const hero = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  padding: '4rem 2rem',
  display: 'flex',
  alignItems: 'center',
  maxWidth: '1200px',
  margin: '0 auto',
  gap: '3rem',
  minHeight: '500px',
};

export const heroContent = {
  flex: 1,
};

export const heroTitle = {
  fontSize: '3rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  lineHeight: 1.2,
};

export const heroSubtitle = {
  fontSize: '1.2rem',
  marginBottom: '2rem',
  opacity: 0.9,
  lineHeight: 1.5,
};

export const ctaButton = {
  padding: '1rem 2rem',
  fontSize: '1.1rem',
  backgroundColor: '#fff',
  color: '#3b82f6',
  border: 'none',
  borderRadius: '0.75rem',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
};

export const ctaButtonHover = {
  transform: 'translateY(-2px)',
  boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
};

// Hero Mock Chart
export const heroImage = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
};

export const mockChart = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '1rem',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  width: '300px',
};

export const chartTitle = {
  color: '#333',
  fontWeight: 'bold',
  marginBottom: '1rem',
  textAlign: 'center',
  fontSize: '1.1rem',
};

export const chartBars = {
  display: 'flex',
  alignItems: 'end',
  gap: '1rem',
  height: '200px',
  justifyContent: 'center',
};

export const chartBar = {
  width: '40px',
  borderRadius: '4px 4px 0 0',
  position: 'relative',
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
};

export const chartBarHover = {
  transform: 'translateY(-5px)',
};

export const barLabel = {
  position: 'absolute',
  bottom: '-25px',
  fontSize: '12px',
  color: '#666',
  fontWeight: '500',
};

// Features Section
export const featuresSection = {
  padding: '4rem 2rem',
  backgroundColor: '#f8fafc',
};

export const sectionTitle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '3rem',
  color: '#1f2937',
};

export const featuresGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
};

export const featureCard = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '1rem',
  textAlign: 'center',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
};

export const featureCardHover = {
  transform: 'translateY(-5px)',
  boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
};

export const featureIcon = {
  fontSize: '3rem',
  marginBottom: '1rem',
};

export const featureTitle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  color: '#1f2937',
};

export const featureDesc = {
  color: '#6b7280',
  lineHeight: 1.6,
  margin: 0,
};

// How It Works
export const howItWorks = {
  padding: '4rem 2rem',
  backgroundColor: '#fff',
};

export const stepsContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2rem',
  maxWidth: '900px',
  margin: '0 auto',
  flexWrap: 'wrap',
};

export const step = {
  textAlign: 'center',
  flex: 1,
  minWidth: '200px',
};

export const stepNumber = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#3b82f6',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  margin: '0 auto 1rem',
  transition: 'all 0.3s ease',
};

export const stepNumberHover = {
  transform: 'scale(1.1)',
  backgroundColor: '#2563eb',
};

export const stepContent = {
  color: '#1f2937',
};

export const stepContentTitle = {
  fontSize: '1.2rem',
  margin: '0 0 0.5rem 0',
  fontWeight: '600',
};

export const stepContentDesc = {
  margin: 0,
  color: '#6b7280',
  fontSize: '0.9rem',
};

export const stepArrow = {
  fontSize: '2rem',
  color: '#3b82f6',
  fontWeight: 'bold',
};

// CTA Section
export const ctaSection = {
  padding: '4rem 2rem',
  backgroundColor: '#1f2937',
  color: '#fff',
  textAlign: 'center',
};

export const ctaTitle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
};

export const ctaSubtitle = {
  fontSize: '1.2rem',
  marginBottom: '2rem',
  opacity: 0.9,
  maxWidth: '600px',
  marginLeft: 'auto',
  marginRight: 'auto',
};

// Footer
export const footer = {
  backgroundColor: '#111827',
  color: '#9ca3af',
  padding: '2rem',
  textAlign: 'center',
};

export const footerText = {
  margin: 0,
  fontSize: '0.9rem',
};

// Container Utility
export const container = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 2rem',
};

// Responsive Design - Mobile styles
export const mobileHero = {
  flexDirection: 'column',
  textAlign: 'center',
  padding: '3rem 1rem',
};

export const mobileHeroTitle = {
  fontSize: '2rem',
};

export const mobileHeroSubtitle = {
  fontSize: '1rem',
};

export const mobileMockChart = {
  width: '280px',
  padding: '1.5rem',
};

export const mobileStepsContainer = {
  flexDirection: 'column',
};

export const mobileStepArrow = {
  transform: 'rotate(90deg)',
};

export const mobileHeaderContent = {
  padding: '1rem',
};

export const mobileAuthButtons = {
  gap: '0.5rem',
};

export const mobileLoginBtn = {
  padding: '0.5rem 1rem',
  fontSize: '0.9rem',
};

export const mobileSignupBtn = {
  padding: '0.5rem 1rem',
  fontSize: '0.9rem',
};

export const mobileSectionTitle = {
  fontSize: '2rem',
};

export const mobileCtaTitle = {
  fontSize: '2rem',
};

export const mobileContainer = {
  padding: '0 1rem',
};

export const mobileFeaturesGrid = {
  gridTemplateColumns: '1fr',
  gap: '1.5rem',
};

// Very small mobile styles (480px and below)
export const veryMobileHeroTitle = {
  fontSize: '1.75rem',
};

export const veryMobileHeroSubtitle = {
  fontSize: '0.9rem',
};

export const veryMobileCtaButton = {
  padding: '0.875rem 1.5rem',
  fontSize: '1rem',
};

export const veryMobileMockChart = {
  width: '250px',
  padding: '1rem',
};

export const veryMobileChartBars = {
  height: '150px',
  gap: '0.5rem',
};

export const veryMobileChartBar = {
  width: '30px',
};