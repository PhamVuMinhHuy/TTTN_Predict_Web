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
  primaryButton,
  smallLink,
  footerStyle,
  passwordInputWrapper,
  passwordToggleIcon,
  infoPanelStyle,
  infoBadge,
  infoTitle,
  infoSubtitle,
  infoList,
  infoListItem,
  infoListIcon,
  infoFooter,
  formPanelStyle,
  supportText,
} from "../../assets/styles/auth.styles";
// Đã tắt chức năng đăng ký - không sử dụng nữa
// import Signup from "./signup";
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

  // Focus on email input when component mounts
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  // Clear auth error when form values change
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [values, error, clearError]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Force validation of all fields before submit
      const isValid = validateAll();
      if (!isValid) {
        // Mark all fields as touched to show validation errors
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
        <div
          style={{
            color: "#e74c3c",
            backgroundColor: "#fdf2f2",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "16px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <div>
        <label style={labelStyle}>Địa chỉ email</label>
        <input
          ref={emailRef}
          type="email"
          value={values.email}
          onChange={(e) => setValue("email", e.target.value)}
          placeholder="Ví dụ: hocvien@truong.edu.vn"
          style={{
            ...inputStyle,
            borderColor:
              touched.email && errors.email
                ? "#e74c3c"
                : inputStyle.borderColor,
          }}
          disabled={loading || isSubmitting}
        />
        {touched.email && errors.email && (
          <div style={{ color: "#e74c3c", fontSize: "12px", marginTop: "4px" }}>
            {errors.email}
          </div>
        )}
      </div>

      <div>
        <label style={labelStyle}>Mật khẩu</label>
        <div style={passwordInputWrapper}>
          <input
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            value={values.password}
            onChange={(e) => setValue("password", e.target.value)}
            placeholder="Nhập mật khẩu bất kì"
            style={{
              ...inputStyle,
              paddingRight: "45px",
              borderColor:
                touched.password && errors.password
                  ? "#e74c3c"
                  : inputStyle.borderColor,
            }}
            disabled={loading || isSubmitting}
          />
          <span
            style={passwordToggleIcon}
            onClick={() => setShowPassword(!showPassword)}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0f172a")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
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
          <div style={{ color: "#e74c3c", fontSize: "12px", marginTop: "4px" }}>
            {errors.password}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          type="submit"
          style={{
            ...primaryButton,
            opacity: !isFormValid || loading || isSubmitting ? 0.6 : 1,
            cursor:
              !isFormValid || loading || isSubmitting
                ? "not-allowed"
                : "pointer",
          }}
          disabled={!isFormValid || loading || isSubmitting}
        >
          {loading || isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 8,
        }}
      >
        <button
          type="button"
          style={smallLink}
          onClick={handleForgotPassword}
          disabled={loading || isSubmitting}
        >
          Quên mật khẩu?
        </button>
        {/* Đã ẩn phần đăng ký vì chức năng này không còn được sử dụng
        <div style={footerStyle}>
          Bạn chưa có tài khoản?{" "}
          <button
            style={{ ...smallLink, marginLeft: 6 }}
            onClick={() => onSwitch("register")}
            disabled={loading || isSubmitting}
          >
            Đăng ký
          </button>
        </div>
        */}
      </div>
    </form>
  );
}

// Register form moved into src/(auth)/signup.jsx as Signup component

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Luôn sử dụng mode "login" vì chức năng đăng ký đã bị tắt
  // const initialMode = searchParams.get("mode") || "login";
  // const [mode, setMode] = useState(initialMode);
  const mode = "login"; // Luôn là login mode
  const { user } = useAuth(); // <-- lấy user từ hook

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
      // Student - redirect to predict page
      navigate("/predict");
      return;
    }

    // Default fallback
    navigate("/predict");
  };

  // Header content - chỉ hiển thị nội dung đăng nhập
  const headerContent = {
    title: "Chào mừng trở lại!",
    subtitle: "Đăng nhập vào hệ thống dự đoán điểm học tập",
  };
  /* Đã tắt chức năng đăng ký
  const headerContent =
    mode === "login"
      ? {
          title: "Chào mừng trở lại!",
          subtitle: "Đăng nhập vào hệ thống dự đoán điểm học tập",
        }
      : {
          title: "Tạo tài khoản mới",
          subtitle: "Điền thông tin để tạo tài khoản",
        };
  */

  const infoHighlights = [
    {
      icon: "📊",
      text: "Theo dõi biểu đồ dự đoán điểm cho từng môn học và từng học kỳ.",
    },
    {
      icon: "🧠",
      text: "Nhận gợi ý ôn tập cá nhân hoá dựa trên năng lực hiện tại.",
    },
    {
      icon: "🎯",
      text: "Đặt mục tiêu điểm số và kiểm tra mức độ hoàn thành theo thời gian.",
    },
  ];

  /* Đã tắt chức năng đăng ký - không cần các handler này nữa
  // Handle mode switch with useCallback to prevent unnecessary re-renders
  const handleModeSwitch = useCallback((newMode) => {
    setMode(newMode);
  }, []);

  // Handle back to login
  const handleBackToLogin = useCallback(() => {
    console.log("DEBUG: handleBackToLogin called");
    setMode("login");
  }, []);
  */
  // Placeholder function để tránh lỗi - không thực sự được gọi
  const handleModeSwitch = useCallback(() => {}, []);

  console.log("DEBUG: Auth component - current mode:", mode);

  // Support text - chỉ hiển thị nội dung đăng nhập
  const supportCopy = "Tiếp tục theo dõi tiến bộ học tập và xem các dự đoán mới nhất của bạn.";

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={infoPanelStyle}>
          <span style={infoBadge}>PredictGrade Learning Hub</span>
          <h2 style={infoTitle}>
            Định hướng học tập thông minh cho từng học sinh
          </h2>
          <p style={infoSubtitle}>
            Biến dữ liệu điểm số thành lộ trình học tập rõ ràng, giúp bạn tự tin
            trước mỗi kỳ kiểm tra.
          </p>
          <ul style={infoList}>
            {infoHighlights.map((item) => (
              <li key={item.text} style={infoListItem}>
                <span style={infoListIcon}>{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <div style={infoFooter}>
            <span>✨</span>
            <span>Cùng bạn nuôi dưỡng tinh thần ham học mỗi ngày</span>
          </div>
        </div>

        <div style={formPanelStyle}>
          <div style={headerStyle}>
            <div>
              <div style={brandStyle}>{headerContent.title}</div>
              <div style={subtitleStyle}>{headerContent.subtitle}</div>
            </div>
            <p style={supportText}>{supportCopy}</p>
          </div>

          {/* Luôn hiển thị LoginForm - chức năng đăng ký đã bị tắt */}
          <LoginForm onSwitch={handleModeSwitch} onSuccess={handleSuccess} />
          {/* Đã tắt chức năng đăng ký
          {mode === "login" ? (
            <LoginForm onSwitch={handleModeSwitch} onSuccess={handleSuccess} />
          ) : (
            <Signup onBack={handleBackToLogin} onSuccess={handleSuccess} />
          )}
          */}
        </div>
      </div>
    </div>
  );
}
