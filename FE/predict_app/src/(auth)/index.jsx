import React, {
  useState,
  useCallback,
  useMemo,
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
} from "../../assets/styles/auth.styles";
import Signup from "./signup";
import { useForm } from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";
import { validationRules } from "../utils/validation";

function LoginForm({ onSwitch, onSuccess }) {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const { login, loading, error, clearError } = useAuth();

  const loginValidationRules = useMemo(
    () => ({
      email: validationRules.email,
      password: validationRules.password,
    }),
    []
  );

  const {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    setValue,
    setFieldTouched,
    validateAll,
  } = useForm({ email: "", password: "" }, loginValidationRules);

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

      if (!validateAll()) {
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
    [values, validateAll, setIsSubmitting, login, onSuccess]
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

  const isFormValid = useMemo(() => {
    return Object.keys(loginValidationRules).every(
      (key) => !errors[key] && values[key]
    );
  }, [errors, values, loginValidationRules]);

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
          onBlur={() => setFieldTouched("email")}
          placeholder="Nhập email của bạn"
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
        <input
          ref={passwordRef}
          type="password"
          value={values.password}
          onChange={(e) => setValue("password", e.target.value)}
          onBlur={() => setFieldTouched("password")}
          placeholder="Nhập mật khẩu của bạn"
          style={{
            ...inputStyle,
            borderColor:
              touched.password && errors.password
                ? "#e74c3c"
                : inputStyle.borderColor,
          }}
          disabled={loading || isSubmitting}
        />
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

  // Memoize the header content based on mode
  const headerContent = useMemo(() => {
    if (mode === "login") {
      return {
        title: "Chào mừng trở lại!",
        subtitle: "Đăng nhập vào hệ thống dự đoán điểm học tập",
      };
    } else {
      return {
        title: "Tạo tài khoản mới",
        subtitle: "Điền thông tin để tạo tài khoản",
      };
    }
  }, [mode]);

  // Handle mode switch with useCallback to prevent unnecessary re-renders
  const handleModeSwitch = useCallback((newMode) => {
    setMode(newMode);
  }, []);

  // Handle back to login
  const handleBackToLogin = useCallback(() => {
    setMode("login");
  }, []);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div>
            <div style={brandStyle}>{headerContent.title}</div>
            <div style={subtitleStyle}>{headerContent.subtitle}</div>
          </div>
          {/* tabs removed - single-column card design like the mock */}
        </div>

        {mode === "login" ? (
          <LoginForm onSwitch={handleModeSwitch} onSuccess={handleSuccess} />
        ) : (
          <Signup onBack={handleBackToLogin} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}
