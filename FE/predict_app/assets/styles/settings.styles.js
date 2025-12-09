// Modern Settings Page Styles - Study Theme 2025 (Improved Readability)

export const settingsContainer = {
  minHeight: '100vh',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  background: `
    radial-gradient(ellipse at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(78, 205, 196, 0.15) 0%, transparent 50%),
    linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)
  `,
  padding: '40px 24px 80px',
};

export const settingsContent = {
  maxWidth: '700px',
  margin: '0 auto',
};

export const settingsTitle = {
  fontSize: '36px',
  fontWeight: '800',
  color: '#ffffff',
  textShadow: '0 2px 15px rgba(59, 130, 246, 0.3)',
  marginBottom: '8px',
  textAlign: 'center',
  letterSpacing: '-0.02em',
};

export const settingsSubtitle = {
  fontSize: '16px',
  color: '#cbd5e1',
  textAlign: 'center',
  marginBottom: '40px',
  fontWeight: '400',
};

export const settingsCard = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  borderRadius: '28px',
  padding: '40px',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
};

export const settingsCardHeader = {
  textAlign: 'center',
  marginBottom: '32px',
  paddingBottom: '32px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
  position: 'relative',
};

export const settingsAvatar = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2.5rem',
  fontWeight: '700',
  color: '#fff',
  margin: '0 auto 20px',
  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.15)',
  border: '4px solid rgba(255, 255, 255, 0.2)',
  position: 'relative',
};

export const settingsUserName = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#ffffff',
  marginBottom: '8px',
  letterSpacing: '-0.02em',
};

export const settingsUserEmail = {
  fontSize: '15px',
  color: '#94a3b8',
  fontWeight: '400',
};

export const settingsSection = {
  marginBottom: '16px',
  padding: '20px 24px',
  background: 'rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  cursor: 'default',
};

export const settingsSectionHover = {
  background: 'rgba(255, 255, 255, 0.12)',
  borderColor: 'rgba(59, 130, 246, 0.5)',
  transform: 'translateX(8px)',
  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
};

export const settingsIcon = {
  width: '52px',
  height: '52px',
  borderRadius: '14px',
  background: 'rgba(59, 130, 246, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
  flexShrink: 0,
  transition: 'all 0.3s ease',
};

export const settingsContentInner = {
  flex: 1,
  minWidth: 0,
};

export const settingsLabel = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#94a3b8',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
};

export const settingsValue = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#ffffff',
  wordBreak: 'break-word',
  lineHeight: '1.5',
  letterSpacing: '-0.01em',
};

export const settingsButton = {
  padding: '16px 32px',
  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '14px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
};

export const settingsButtonHover = {
  transform: 'translateY(-3px)',
  boxShadow: '0 12px 35px rgba(239, 68, 68, 0.5)',
};

export const homeButton = {
  padding: '16px 32px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '14px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
};

export const homeButtonHover = {
  transform: 'translateY(-3px)',
  boxShadow: '0 12px 35px rgba(59, 130, 246, 0.5)',
};

export const buttonContainer = {
  marginTop: '32px',
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
  flexWrap: 'wrap',
};

// Loading and Error States
export const loadingContainer = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `
    linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)
  `,
  color: '#cbd5e1',
  fontSize: '18px',
};

export const errorContainer = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: `
    linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)
  `,
  padding: '40px',
  textAlign: 'center',
};

export const errorText = {
  color: '#fca5a5',
  marginBottom: '24px',
  fontSize: '16px',
};

export const retryButton = {
  padding: '14px 28px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
};
