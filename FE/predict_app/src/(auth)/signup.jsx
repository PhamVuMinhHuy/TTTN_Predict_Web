import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  formStyle,
  labelStyle,
  inputStyle,
  primaryButton,
  smallLink,
} from "../../assets/styles/auth.styles";
import { useForm } from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";
import { validationRules } from "../utils/validation";

// UI-only Signup page with enhanced hooks. onBack should be a function that navigates back to login (e.g. setMode('login')).
export default function Signup({ onBack, onSuccess }) {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const { register, loading, error, clearError } = useAuth();

  const signupValidationRules = useMemo(
    () => ({
      email: validationRules.email,
      password: validationRules.password,
      confirmPassword: validationRules.confirmPassword,
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
  } = useForm(
    { email: "", password: "", confirmPassword: "" },
    signupValidationRules
  );

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

      const result = await register(values);

      if (result.success) {
        console.log("Registration successful");
        if (onSuccess) {
          onSuccess();
        } else {
          onBack();
        }
      }

      setIsSubmitting(false);
    },
    [values, validateAll, setIsSubmitting, register, onBack, onSuccess]
  );

  const isFormValid = useMemo(() => {
    return Object.keys(signupValidationRules).every(
      (key) => !errors[key] && values[key]
    );
  }, [errors, values, signupValidationRules]);

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
          placeholder="abc@gmail.com"
          style={{
            ...inputStyle,
            borderColor:
              touched.email && errors.email ? "#e74c3c" : inputStyle.borderColor,
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
          placeholder="Ít nhất 8 ký tự"
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

      <div>
        <label style={labelStyle}>Xác nhận mật khẩu</label>
        <input
          ref={confirmPasswordRef}
          type="password"
          value={values.confirmPassword}
          onChange={(e) => setValue("confirmPassword", e.target.value)}
          onBlur={() => setFieldTouched("confirmPassword")}
          placeholder="Nhập lại mật khẩu"
          style={{
            ...inputStyle,
            borderColor:
              touched.confirmPassword && errors.confirmPassword
                ? "#e74c3c"
                : inputStyle.borderColor,
          }}
          disabled={loading || isSubmitting}
        />
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
