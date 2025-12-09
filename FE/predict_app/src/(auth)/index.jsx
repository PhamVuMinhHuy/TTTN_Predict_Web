import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  containerStyle,
  cardStyle,
  headerStyle,
  brandStyle,
  subtitleStyle,
  formStyle,
  labelStyle,
  inputStyle,
  inputFocusStyle,
  primaryButton,
  primaryButtonHover,
  smallLink,
  smallLinkHover,
  footerStyle,
  passwordInputWrapper,
  passwordToggleIcon,
  passwordToggleIconHover,
  infoPanelStyle,
  infoPanelOverlay,
  infoBadge,
  infoTitle,
  infoSubtitle,
  infoList,
  infoListItem,
  infoListItemHover,
  infoListIcon,
  infoFooter,
  formPanelStyle,
  supportText,
  decorCircle1,
  decorCircle2,
  studyIconsContainer,
  studyIcon,
  studyIconHover,
  errorMessageStyle,
  animationStyles,
} from "../../assets/styles/auth.styles";
import { useForm } from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";
import { validationRules } from "../utils/validation";

const LOGIN_VALIDATION_RULES = {
  email: validationRules.email,
  password: validationRules.password,
};

function LoginForm({ onSwitch, onSuccess }) {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(false);
  const [hoveredToggle, setHoveredToggle] = useState(false);
  const navigate = useNavigate();

  const { login, loading, error, clearError } = useAuth();

  const {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    setValue,
    setFieldTouched,
    validateAll,
  } = useForm({ email: "", password: "" }, LOGIN_VALIDATION_RULES);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [values, error, clearError]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const isValid = validateAll();
      if (!isValid) {
        Object.keys(LOGIN_VALIDATION_RULES).forEach((field) => {
          setFieldTouched(field);
        });
        return;
      }

      setIsSubmitting(true);

      const result = await login(values);

      if (result.success) {
        console.log("Login successful");
        if (onSuccess) {
          onSuccess();
        }
      }

      setIsSubmitting(false);
    },
    [values, validateAll, setIsSubmitting, login, onSuccess, setFieldTouched]
  );

  const handleForgotPassword = useCallback(() => {
    navigate('/forgot-password');
  }, [navigate]);

  const isFormValid = Object.keys(LOGIN_VALIDATION_RULES).every(
    (key) => !errors[key] && values[key]
  );

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {error && (
        <div style={errorMessageStyle}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div>
        <label style={labelStyle}>📧 Địa chỉ email</label>
        <input
          ref={emailRef}
          type="email"
          value={values.email}
          onChange={(e) => setValue("email", e.target.value)}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
          placeholder="Ví dụ: hocvien@truong.edu.vn"
          style={{
            ...inputStyle,
            ...(focusedField === "email" ? inputFocusStyle : {}),
            borderColor:
              touched.email && errors.email
                ? "#ef4444"
                : focusedField === "email"
                ? "#667eea"
                : inputStyle.border,
          }}
          disabled={loading || isSubmitting}
        />
        {touched.email && errors.email && (
          <div style={{ color: "#ef4444", fontSize: "13px", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>❌</span> {errors.email}
          </div>
        )}
      </div>

      <div>
        <label style={labelStyle}>🔒 Mật khẩu</label>
        <div style={passwordInputWrapper}>
          <input
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            value={values.password}
            onChange={(e) => setValue("password", e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            placeholder="Nhập mật khẩu của bạn"
            style={{
              ...inputStyle,
              paddingRight: "52px",
              ...(focusedField === "password" ? inputFocusStyle : {}),
              borderColor:
                touched.password && errors.password
                  ? "#ef4444"
                  : focusedField === "password"
                  ? "#667eea"
                  : inputStyle.border,
            }}
            disabled={loading || isSubmitting}
          />
          <span
            style={{
              ...passwordToggleIcon,
              ...(hoveredToggle ? passwordToggleIconHover : {}),
            }}
            onClick={() => setShowPassword(!showPassword)}
            onMouseEnter={() => setHoveredToggle(true)}
            onMouseLeave={() => setHoveredToggle(false)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowPassword(!showPassword);
              }
            }}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        {touched.password && errors.password && (
          <div style={{ color: "#ef4444", fontSize: "13px", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>❌</span> {errors.password}
          </div>
        )}
      </div>

      <button
        type="submit"
        style={{
          ...primaryButton,
          ...(hoveredButton && !loading && !isSubmitting && isFormValid ? primaryButtonHover : {}),
          opacity: !isFormValid || loading || isSubmitting ? 0.6 : 1,
          cursor:
            !isFormValid || loading || isSubmitting
              ? "not-allowed"
              : "pointer",
        }}
        disabled={!isFormValid || loading || isSubmitting}
        onMouseEnter={() => setHoveredButton(true)}
        onMouseLeave={() => setHoveredButton(false)}
      >
        {loading || isSubmitting ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span>
            Đang đăng nhập...
          </span>
        ) : (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            🚀 Đăng nhập
          </span>
        )}
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 16,
        }}
      >
        <button
          type="button"
          style={{
            ...smallLink,
            ...(hoveredLink ? smallLinkHover : {}),
          }}
          onClick={handleForgotPassword}
          onMouseEnter={() => setHoveredLink(true)}
          onMouseLeave={() => setHoveredLink(false)}
          disabled={loading || isSubmitting}
        >
          🔑 Quên mật khẩu?
        </button>
      </div>
    </form>
  );
}

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = "login";
  const { user } = useAuth();
  const [hoveredItems, setHoveredItems] = useState({});
  const [hoveredIcons, setHoveredIcons] = useState({});

  const handleSuccess = () => {
    console.log("DEBUG: handleSuccess called");

    const currentUser =
      user || JSON.parse(localStorage.getItem("user") || "null");

    if (currentUser) {
      if (currentUser.role === "admin") {
        navigate("/admin");
        return;
      }
      if (currentUser.role === "teacher") {
        navigate("/teacher");
        return;
      }
      // Student - redirect to home page
      navigate("/");
      return;
    }

    navigate("/");
  };

  const headerContent = {
    title: "Chào mừng trở lại! 👋",
    subtitle: "Đăng nhập để tiếp tục hành trình học tập",
  };

  const infoHighlights = [
    {
      icon: "📊",
      text: "Theo dõi biểu đồ dự đoán điểm cho từng môn học và học kỳ",
    },
    {
      icon: "🧠",
      text: "Nhận gợi ý ôn tập cá nhân hoá dựa trên năng lực hiện tại",
    },
    {
      icon: "🎯",
      text: "Đặt mục tiêu và theo dõi tiến độ hoàn thành theo thời gian",
    },
  ];

  const studyIcons = ["📚", "✏️", "🎓", "💡", "🏆"];

  const handleModeSwitch = useCallback(() => {}, []);

  const supportCopy = "Hệ thống dự đoán điểm số thông minh sử dụng AI";

  return (
    <div style={containerStyle}>
      {/* Add animation styles */}
      <style>
        {animationStyles}
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}
      </style>
      
      {/* Floating background elements */}
      <div style={{ 
        position: "absolute", 
        top: "10%", 
        left: "5%", 
        fontSize: "60px", 
        opacity: 0.1,
        animation: "float 6s ease-in-out infinite"
      }}>📖</div>
      <div style={{ 
        position: "absolute", 
        bottom: "15%", 
        right: "8%", 
        fontSize: "50px", 
        opacity: 0.1,
        animation: "float 8s ease-in-out infinite",
        animationDelay: "1s"
      }}>🎓</div>
      <div style={{ 
        position: "absolute", 
        top: "25%", 
        right: "15%", 
        fontSize: "40px", 
        opacity: 0.08,
        animation: "float 7s ease-in-out infinite",
        animationDelay: "2s"
      }}>✨</div>
      
      <div style={cardStyle}>
        {/* Left Panel - Info */}
        <div style={infoPanelStyle}>
          {/* Overlay pattern */}
          <div style={infoPanelOverlay}></div>
          
          {/* Decorative circles */}
          <div style={decorCircle1}></div>
          <div style={decorCircle2}></div>
          
          <span style={infoBadge}>
            <span style={{ fontSize: "16px" }}>🎓</span>
            PredictGrade Learning Hub
          </span>
          
          <h2 style={infoTitle}>
            Định hướng học tập thông minh cho từng học sinh
          </h2>
          
          <p style={infoSubtitle}>
            Biến dữ liệu điểm số thành lộ trình học tập rõ ràng, giúp bạn tự tin trước mỗi kỳ kiểm tra.
          </p>
          
          <ul style={infoList}>
            {infoHighlights.map((item, index) => (
              <li 
                key={item.text} 
                style={{
                  ...infoListItem,
                  ...(hoveredItems[index] ? infoListItemHover : {}),
                  animationDelay: `${index * 0.1}s`,
                }}
                onMouseEnter={() => setHoveredItems(prev => ({ ...prev, [index]: true }))}
                onMouseLeave={() => setHoveredItems(prev => ({ ...prev, [index]: false }))}
              >
                <span style={infoListIcon}>{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          
          {/* Study icons */}
          <div style={studyIconsContainer}>
            {studyIcons.map((icon, index) => (
              <div 
                key={index}
                style={{
                  ...studyIcon,
                  ...(hoveredIcons[index] ? studyIconHover : {}),
                }}
                onMouseEnter={() => setHoveredIcons(prev => ({ ...prev, [index]: true }))}
                onMouseLeave={() => setHoveredIcons(prev => ({ ...prev, [index]: false }))}
              >
                {icon}
              </div>
            ))}
          </div>
          
          <div style={infoFooter}>
            <span style={{ fontSize: "20px" }}>✨</span>
            <span>Cùng bạn nuôi dưỡng tinh thần ham học mỗi ngày</span>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div style={formPanelStyle}>
          <div style={headerStyle}>
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>📚</div>
            <div style={brandStyle}>{headerContent.title}</div>
            <div style={subtitleStyle}>{headerContent.subtitle}</div>
            <p style={supportText}>{supportCopy}</p>
          </div>

          <LoginForm onSwitch={handleModeSwitch} onSuccess={handleSuccess} />
          
          {/* Footer info */}
          <div style={{ 
            marginTop: "32px", 
            paddingTop: "20px", 
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
            color: "#9ca3af",
            fontSize: "13px"
          }}>
            <span>🔒 Bảo mật bởi PredictGrade © 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}
