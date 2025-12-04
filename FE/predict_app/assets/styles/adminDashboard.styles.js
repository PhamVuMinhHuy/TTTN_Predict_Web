// Modern Professional Admin Dashboard Styles

// ============================================
// COLOR PALETTE
// ============================================
const colors = {
  // Primary Brand Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // Success Colors
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },
  // Warning Colors
  warning: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
  },
  // Danger Colors
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  // Neutral Colors
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  // Purple Accent
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
  },
};

// ============================================
// BASE STYLES
// ============================================
export const adminPage = {
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${colors.neutral[50]} 0%, ${colors.primary[50]} 100%)`,
  padding: '2rem',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

export const adminContainer = {
  maxWidth: '1400px',
  margin: '0 auto',
};

// ============================================
// HEADER STYLES
// ============================================
export const adminHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  padding: '1.5rem 2rem',
  backgroundColor: '#ffffff',
  borderRadius: '1rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  border: `1px solid ${colors.neutral[200]}`,
};

export const adminHeaderTitle = {
  margin: 0,
  fontSize: '2rem',
  fontWeight: 700,
  background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.purple[600]} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export const adminHeaderSubtitle = {
  margin: '0.5rem 0 0',
  color: colors.neutral[600],
  fontSize: '0.95rem',
  fontWeight: 400,
};

export const adminHeaderRight = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
};

export const adminRoleText = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: colors.neutral[700],
  fontSize: '0.9rem',
  fontWeight: 500,
};

export const adminTag = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.4rem 0.8rem',
  borderRadius: '999px',
  background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.purple[500]} 100%)`,
  color: '#ffffff',
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
};

// ============================================
// BUTTON STYLES
// ============================================
const buttonBase = {
  padding: '0.65rem 1.25rem',
  borderRadius: '0.75rem',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

export const logoutButton = {
  ...buttonBase,
  background: `linear-gradient(135deg, ${colors.danger[500]} 0%, ${colors.danger[600]} 100%)`,
  color: '#ffffff',
};

export const logoutButtonHover = {
  background: `linear-gradient(135deg, ${colors.danger[600]} 0%, ${colors.danger[700]} 100%)`,
  transform: 'translateY(-2px)',
  boxShadow: '0 8px 16px rgba(239, 68, 68, 0.4)',
};

// ============================================
// STATISTICS CARDS
// ============================================
export const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '1.25rem',
  marginBottom: '2rem',
};

export const statCard = {
  backgroundColor: '#ffffff',
  borderRadius: '1rem',
  padding: '1.5rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  border: `1px solid ${colors.neutral[200]}`,
  transition: 'all 0.3s ease',
  cursor: 'default',
};

export const statCardHover = {
  transform: 'translateY(-4px)',
  boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.15)',
};

export const statCardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '0.75rem',
};

export const statCardIcon = {
  width: '3rem',
  height: '3rem',
  borderRadius: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  fontWeight: 600,
};

export const statCardTitle = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: colors.neutral[600],
  marginBottom: '0.5rem',
};

export const statCardValue = {
  fontSize: '2rem',
  fontWeight: 700,
  color: colors.neutral[900],
  lineHeight: 1,
};

// ============================================
// MAIN GRID LAYOUT
// ============================================
export const adminGrid = {
  display: 'grid',
  gridTemplateColumns: '1.5fr 1fr',
  gap: '1.5rem',
  alignItems: 'flex-start',
};

// ============================================
// CARD STYLES
// ============================================
export const card = {
  backgroundColor: '#ffffff',
  borderRadius: '1rem',
  padding: '1.75rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  border: `1px solid ${colors.neutral[200]}`,
};

export const cardTitleRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
  paddingBottom: '1rem',
  borderBottom: `2px solid ${colors.neutral[100]}`,
};

export const cardTitle = {
  margin: 0,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: colors.neutral[900],
};

export const badge = {
  padding: '0.35rem 0.75rem',
  borderRadius: '999px',
  background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.purple[500]} 100%)`,
  color: '#ffffff',
  fontSize: '0.75rem',
  fontWeight: 700,
  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
};

// ============================================
// SEARCH BAR
// ============================================
export const searchContainer = {
  marginBottom: '1.25rem',
};

export const searchInput = {
  width: '100%',
  padding: '0.75rem 1rem 0.75rem 2.75rem',
  borderRadius: '0.75rem',
  border: `2px solid ${colors.neutral[200]}`,
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'all 0.2s ease',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z\'%3E%3C/path%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0.75rem center',
  backgroundSize: '1.25rem',
};

export const searchInputFocus = {
  borderColor: colors.primary[500],
  boxShadow: `0 0 0 3px ${colors.primary[100]}`,
};

// ============================================
// CLASS FILTER CHIPS
// ============================================
export const classFilterContainer = {
  marginBottom: '1.25rem',
};

export const classFilterTitle = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: colors.neutral[700],
  marginBottom: '0.5rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export const classChipsWrapper = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
};

export const classChip = {
  padding: '0.4rem 0.75rem',
  borderRadius: '999px',
  border: `2px solid ${colors.neutral[200]}`,
  backgroundColor: '#ffffff',
  color: colors.neutral[700],
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
};

export const classChipHover = {
  borderColor: colors.primary[300],
  backgroundColor: colors.primary[50],
  color: colors.primary[700],
  transform: 'translateY(-1px)',
};

export const classChipActive = {
  background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.purple[500]} 100%)`,
  color: '#ffffff',
  borderColor: 'transparent',
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
};

export const clearFilterButton = {
  padding: '0.4rem 0.75rem',
  borderRadius: '999px',
  border: `2px solid ${colors.danger[200]}`,
  backgroundColor: colors.danger[50],
  color: colors.danger[700],
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

export const clearFilterButtonHover = {
  backgroundColor: colors.danger[100],
  borderColor: colors.danger[300],
  transform: 'translateY(-1px)',
};

// ============================================
// TABLE STYLES
// ============================================
export const tableWrapper = {
  borderRadius: '0.75rem',
  border: `1px solid ${colors.neutral[200]}`,
  overflow: 'hidden',
  maxHeight: '600px',
  overflowY: 'auto',
};

export const table = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.875rem',
};

export const tableHeadRow = {
  background: `linear-gradient(135deg, ${colors.neutral[50]} 0%, ${colors.primary[50]} 100%)`,
  position: 'sticky',
  top: 0,
  zIndex: 10,
};

export const th = {
  textAlign: 'left',
  padding: '0.875rem 1rem',
  fontWeight: 700,
  color: colors.neutral[700],
  borderBottom: `2px solid ${colors.neutral[200]}`,
  whiteSpace: 'nowrap',
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export const td = {
  padding: '1rem',
  borderBottom: `1px solid ${colors.neutral[100]}`,
  color: colors.neutral[800],
  verticalAlign: 'middle',
};

export const tdCenter = {
  ...td,
  textAlign: 'center',
};

export const row = {
  backgroundColor: '#ffffff',
  transition: 'all 0.2s ease',
};

export const rowHover = {
  backgroundColor: colors.neutral[50],
  transform: 'scale(1.01)',
};

// ============================================
// ROLE BADGES
// ============================================
const rolePill = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.35rem 0.75rem',
  fontSize: '0.75rem',
  borderRadius: '999px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export const roleStudent = {
  ...rolePill,
  background: `linear-gradient(135deg, ${colors.success[400]} 0%, ${colors.success[600]} 100%)`,
  color: '#ffffff',
  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
};

export const roleTeacher = {
  ...rolePill,
  background: `linear-gradient(135deg, ${colors.purple[400]} 0%, ${colors.purple[600]} 100%)`,
  color: '#ffffff',
  boxShadow: '0 2px 8px rgba(168, 85, 247, 0.3)',
};

export const roleAdmin = {
  ...rolePill,
  background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[700]} 100%)`,
  color: '#ffffff',
  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
};

export const roleUser = roleStudent; // Fallback

export const userSelfTag = {
  fontSize: '0.75rem',
  color: colors.neutral[500],
  fontStyle: 'italic',
  fontWeight: 500,
};

// ============================================
// ACTION BUTTONS
// ============================================
export const deleteButton = {
  padding: '0.4rem 0.85rem',
  borderRadius: '0.5rem',
  border: 'none',
  background: `linear-gradient(135deg, ${colors.danger[400]} 0%, ${colors.danger[600]} 100%)`,
  color: '#ffffff',
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)',
};

export const deleteButtonHover = {
  background: `linear-gradient(135deg, ${colors.danger[500]} 0%, ${colors.danger[700]} 100%)`,
  transform: 'translateY(-2px)',
  boxShadow: '0 6px 12px rgba(239, 68, 68, 0.4)',
};

// ============================================
// EMPTY & ERROR STATES
// ============================================
export const emptyState = {
  padding: '3rem 1.5rem',
  textAlign: 'center',
  color: colors.neutral[500],
  fontSize: '0.95rem',
  fontWeight: 500,
};

export const errorText = {
  marginTop: '0.75rem',
  padding: '0.75rem 1rem',
  borderRadius: '0.5rem',
  backgroundColor: colors.danger[50],
  color: colors.danger[700],
  fontSize: '0.875rem',
  fontWeight: 500,
  border: `1px solid ${colors.danger[200]}`,
};

// ============================================
// FORM STYLES
// ============================================
export const form = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

export const formRow = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
};

export const formGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

export const label = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: colors.neutral[700],
  letterSpacing: '0.01em',
};

export const input = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '0.75rem',
  border: `2px solid ${colors.neutral[200]}`,
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'all 0.2s ease',
  fontFamily: 'inherit',
};

export const inputFocus = {
  borderColor: colors.primary[500],
  boxShadow: `0 0 0 3px ${colors.primary[100]}`,
};

export const select = {
  ...input,
  cursor: 'pointer',
};

export const submitButton = {
  marginTop: '0.5rem',
  width: '100%',
  padding: '0.875rem',
  borderRadius: '0.75rem',
  border: 'none',
  background: `linear-gradient(135deg, ${colors.success[500]} 0%, ${colors.success[700]} 100%)`,
  color: '#ffffff',
  fontWeight: 700,
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 8px rgba(16, 185, 129, 0.3)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export const submitButtonDisabled = {
  background: colors.neutral[400],
  cursor: 'not-allowed',
  boxShadow: 'none',
};

export const submitButtonHover = {
  background: `linear-gradient(135deg, ${colors.success[600]} 0%, ${colors.success[700]} 100%)`,
  transform: 'translateY(-2px)',
  boxShadow: '0 8px 16px rgba(16, 185, 129, 0.5)',
};

export const helpText = {
  marginTop: '0.25rem',
  fontSize: '0.75rem',
  color: colors.neutral[500],
  lineHeight: 1.5,
};

// ============================================
// LOADING SPINNER
// ============================================
export const loadingSpinner = {
  display: 'inline-block',
  width: '1.25rem',
  height: '1.25rem',
  border: `3px solid ${colors.neutral[200]}`,
  borderTop: `3px solid ${colors.primary[500]}`,
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

export const loadingContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
  padding: '3rem',
  color: colors.neutral[600],
  fontSize: '0.95rem',
  fontWeight: 500,
};

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================
export const toastContainer = {
  position: 'fixed',
  top: '1.5rem',
  right: '1.5rem',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  maxWidth: '400px',
};

export const toast = {
  padding: '1rem 1.25rem',
  borderRadius: '0.75rem',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  animation: 'slideInRight 0.3s ease-out',
  border: '1px solid',
  minWidth: '300px',
};

export const toastSuccess = {
  ...toast,
  backgroundColor: colors.success[50],
  color: colors.success[800],
  borderColor: colors.success[200],
};

export const toastError = {
  ...toast,
  backgroundColor: colors.danger[50],
  color: colors.danger[800],
  borderColor: colors.danger[200],
};

export const toastWarning = {
  ...toast,
  backgroundColor: colors.warning[50],
  color: colors.warning[800],
  borderColor: colors.warning[200],
};

export const toastInfo = {
  ...toast,
  backgroundColor: colors.primary[50],
  color: colors.primary[800],
  borderColor: colors.primary[200],
};

export const toastIcon = {
  fontSize: '1.25rem',
  flexShrink: 0,
};

export const toastMessage = {
  flex: 1,
};

export const toastClose = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '0.25rem',
  fontSize: '1.25rem',
  opacity: 0.6,
  transition: 'opacity 0.2s ease',
  lineHeight: 1,
};

export const toastCloseHover = {
  opacity: 1,
};

// ============================================
// CONFIRMATION MODAL
// ============================================
export const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9998,
  animation: 'fadeIn 0.2s ease-out',
};

export const modal = {
  backgroundColor: '#ffffff',
  borderRadius: '1rem',
  padding: '2rem',
  maxWidth: '450px',
  width: '90%',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  animation: 'scaleIn 0.3s ease-out',
};

export const modalHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '1rem',
};

export const modalIcon = {
  fontSize: '2rem',
};

export const modalTitle = {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: colors.neutral[900],
  margin: 0,
};

export const modalBody = {
  color: colors.neutral[700],
  fontSize: '0.95rem',
  lineHeight: 1.6,
  marginBottom: '1.5rem',
};

export const modalFooter = {
  display: 'flex',
  gap: '0.75rem',
  justifyContent: 'flex-end',
};

export const modalButton = {
  padding: '0.65rem 1.5rem',
  borderRadius: '0.5rem',
  border: 'none',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

export const modalButtonCancel = {
  ...modalButton,
  backgroundColor: colors.neutral[100],
  color: colors.neutral[700],
};

export const modalButtonCancelHover = {
  backgroundColor: colors.neutral[200],
};

export const modalButtonConfirm = {
  ...modalButton,
  background: `linear-gradient(135deg, ${colors.danger[500]} 0%, ${colors.danger[600]} 100%)`,
  color: '#ffffff',
};

export const modalButtonConfirmHover = {
  background: `linear-gradient(135deg, ${colors.danger[600]} 0%, ${colors.danger[700]} 100%)`,
  transform: 'translateY(-1px)',
  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
};
