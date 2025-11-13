import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
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
import Signup from "./signup";
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
        Object.keys(LOGIN_VALIDATION_RULES).forEach(field => {
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
    const email = values.email;
    if (email) {
      // You could implement forgot password functionality here
      window.alert(`Chức năng quên mật khẩu cho email: ${email}`);
    } else {
      window.alert("Vui lòng nhập email trước khi chọn quên mật khẩu");
    }
  }, [values.email]);

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
            placeholder="Ít nhất 8 ký tự gồm chữ và số"
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
          justifyContent: "space-between",
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
      </div>
    </form>
  );
}

// Register form moved into src/(auth)/signup.jsx as Signup component

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = searchParams.get("mode") || "login";
  const [mode, setMode] = useState(initialMode);

  const handleSuccess = () => {
    navigate("/");
  };

  // Get header content based on mode
  const headerContent = mode === "login" 
    ? {
        title: "Chào mừng trở lại!",
        subtitle: "Đăng nhập vào hệ thống dự đoán điểm học tập",
      }
    : {
        title: "Tạo tài khoản mới", 
        subtitle: "Điền thông tin để tạo tài khoản",
      };

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

  // Handle mode switch with useCallback to prevent unnecessary re-renders
  const handleModeSwitch = useCallback((newMode) => {
    setMode(newMode);
  }, []);

  // Handle back to login
  const handleBackToLogin = useCallback(() => {
    setMode("login");
  }, []);

  const supportCopy =
    mode === "login"
      ? "Tiếp tục theo dõi tiến bộ học tập và xem các dự đoán mới nhất của bạn."
      : "Tạo tài khoản để lưu kết quả, nhận lộ trình ôn tập và đồng bộ tiến độ.";

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={infoPanelStyle}>
          <span style={infoBadge}>PredictGrade Learning Hub</span>
          <h2 style={infoTitle}>Định hướng học tập thông minh cho từng học sinh</h2>
          <p style={infoSubtitle}>
            Biến dữ liệu điểm số thành lộ trình học tập rõ ràng, giúp bạn tự tin trước mỗi
            kỳ kiểm tra.
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

          {mode === "login" ? (
            <LoginForm onSwitch={handleModeSwitch} onSuccess={handleSuccess} />
          ) : (
            <Signup onBack={handleBackToLogin} onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}
