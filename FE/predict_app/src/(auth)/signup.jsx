import React, { useCallback, useRef, useEffect, useState } from "react";
import {
  formStyle,
  labelStyle,
  inputStyle,
  primaryButton,
  smallLink,
  passwordInputWrapper,
  passwordToggleIcon,
} from "../../assets/styles/auth.styles";
import { useForm } from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";
import { validationRules } from "../utils/validation";

const SIGNUP_VALIDATION_RULES = {
  name: validationRules.name,
  email: validationRules.email,
  password: validationRules.password,
  confirmPassword: validationRules.confirmPassword,
};

// UI-only Signup page with enhanced hooks. onBack should be a function that navigates back to login (e.g. setMode('login')).
export default function Signup({ onBack, onSuccess }) {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, loading, error, clearError } = useAuth();

  const {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    setValue,
    setFieldTouched,
    validateAll,
  } = useForm(
    { name: "", email: "", password: "", confirmPassword: "" },
    SIGNUP_VALIDATION_RULES
  );

  // Focus on name input when component mounts
  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
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
        Object.keys(SIGNUP_VALIDATION_RULES).forEach((field) => {
          setFieldTouched(field);
        });
        return;
      }

      setIsSubmitting(true);

      console.log("DEBUG: Submitting registration with values:", values);
      const result = await register(values);
      console.log("DEBUG: Registration result in component:", result);

      if (result.success) {
        console.log("Registration successful, should redirect");
        // Luôn gọi onSuccess để chuyển về trang home
        if (onSuccess) {
          console.log("Calling onSuccess callback");
          onSuccess();
        } else {
          console.log("No onSuccess callback provided");
        }
      } else {
        console.log("Registration failed:", result.error);
      }

      setIsSubmitting(false);
    },
    [values, validateAll, setIsSubmitting, register, onSuccess, setFieldTouched]
  );

  const isFormValid = Object.keys(SIGNUP_VALIDATION_RULES).every(
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
        <label style={labelStyle}>Tên hiển thị</label>
        <input
          ref={nameRef}
          type="text"
          value={values.name}
          onChange={(e) => setValue("name", e.target.value)}
          placeholder="Ví dụ: Nguyễn Văn An"
          style={{
            ...inputStyle,
            borderColor:
              touched.name && errors.name ? "#e74c3c" : inputStyle.borderColor,
          }}
          disabled={loading || isSubmitting}
        />
        {touched.name && errors.name && (
          <div style={{ color: "#e74c3c", fontSize: "12px", marginTop: "4px" }}>
            {errors.name}
          </div>
        )}
      </div>

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

      <div>
        <label style={labelStyle}>Xác nhận mật khẩu</label>
        <div style={passwordInputWrapper}>
          <input
            ref={confirmPasswordRef}
            type={showConfirmPassword ? "text" : "password"}
            value={values.confirmPassword}
            onChange={(e) => setValue("confirmPassword", e.target.value)}
            placeholder="Nhập lại mật khẩu vừa tạo"
            style={{
              ...inputStyle,
              paddingRight: "45px",
              borderColor:
                touched.confirmPassword && errors.confirmPassword
                  ? "#e74c3c"
                  : inputStyle.borderColor,
            }}
            disabled={loading || isSubmitting}
          />
          <span
            style={passwordToggleIcon}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0f172a")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowConfirmPassword(!showConfirmPassword);
              }
            }}
            aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </span>
        </div>
        {touched.confirmPassword && errors.confirmPassword && (
          <div style={{ color: "#e74c3c", fontSize: "12px", marginTop: "4px" }}>
            {errors.confirmPassword}
          </div>
        )}
      </div>

      <div style={{ marginTop: 14 }}>
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
          {loading || isSubmitting ? "Đang đăng ký..." : "Hoàn tất đăng ký"}
        </button>
      </div>

      <div style={{ marginTop: 12, textAlign: "center" }}>
        <button
          type="button"
          style={smallLink}
          onClick={onBack}
          disabled={loading || isSubmitting}
        >
          Quay lại Đăng nhập
        </button>
      </div>
    </form>
  );
}
