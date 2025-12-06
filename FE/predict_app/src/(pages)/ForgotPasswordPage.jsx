import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Step 1: Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2);
        setResendTimer(60); // 60 seconds countdown
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(data.error || "Không thể gửi mã OTP. Vui lòng thử lại.");
      }
    } catch (an) {
      setError("Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(3);
      } else {
        setError(data.error || "Mã OTP không hợp lệ hoặc đã hết hạn.");
      }
    } catch (err) {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(4);
      } else {
        setError(data.error || "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthColors = [
    "#ef4444",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
  ];
  const strengthLabels = ["Rất yếu", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Progress Indicator */}
        <div style={styles.progressContainer}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={styles.progressStep}>
              <div
                style={{
                  ...styles.progressCircle,
                  ...(step >= s ? styles.progressCircleActive : {}),
                }}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  style={{
                    ...styles.progressLine,
                    ...(step > s ? styles.progressLineActive : {}),
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div style={styles.stepContainer}>
            <div style={styles.icon}>📧</div>
            <h1 style={styles.title}>Quên mật khẩu?</h1>
            <p style={styles.subtitle}>Nhập email của bạn để nhận mã OTP</p>

            <form onSubmit={handleSendOTP} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  style={styles.input}
                  required
                  disabled={loading}
                />
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <button
                type="submit"
                style={{
                  ...styles.button,
                  ...(loading ? styles.buttonDisabled : {}),
                }}
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Gửi mã OTP"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/auth")}
                style={styles.backButton}
              >
                ← Quay lại đăng nhập
              </button>
            </form>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div style={styles.stepContainer}>
            <div style={styles.icon}>🔢</div>
            <h1 style={styles.title}>Nhập mã OTP</h1>
            <p style={styles.subtitle}>
              Mã OTP đã được gửi đến <strong>{email}</strong>
            </p>

            <form onSubmit={handleVerifyOTP} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Mã OTP (6 số) *</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  style={{
                    ...styles.input,
                    textAlign: "center",
                    fontSize: "1.5rem",
                    letterSpacing: "0.5rem",
                  }}
                  maxLength={6}
                  required
                  disabled={loading}
                />
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <button
                type="submit"
                style={{
                  ...styles.button,
                  ...(loading || otp.length !== 6 ? styles.buttonDisabled : {}),
                }}
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Đang xác thực..." : "Xác nhận OTP"}
              </button>

              <div style={styles.resendContainer}>
                {resendTimer > 0 ? (
                  <p style={styles.resendText}>Gửi lại mã sau {resendTimer}s</p>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                      setError("");
                    }}
                    style={styles.linkButton}
                  >
                    Gửi lại mã OTP
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setError("");
                }}
                style={styles.backButton}
              >
                ← Thay đổi email
              </button>
            </form>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div style={styles.stepContainer}>
            <div style={styles.icon}>🔐</div>
            <h1 style={styles.title}>Đặt mật khẩu mới</h1>
            <p style={styles.subtitle}>
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>

            <form onSubmit={handleResetPassword} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Mật khẩu mới *</label>
                <div style={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ít nhất 8 ký tự"
                    style={styles.input}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.togglePassword}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {newPassword && (
                  <div style={styles.strengthContainer}>
                    <div style={styles.strengthBar}>
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            ...styles.strengthSegment,
                            background:
                              i < passwordStrength
                                ? strengthColors[passwordStrength - 1]
                                : "#e5e7eb",
                          }}
                        />
                      ))}
                    </div>
                    <p
                      style={{
                        ...styles.strengthLabel,
                        color:
                          strengthColors[passwordStrength - 1] || "#6b7280",
                      }}
                    >
                      {strengthLabels[passwordStrength - 1] || ""}
                    </p>
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Xác nhận mật khẩu *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  style={styles.input}
                  required
                  disabled={loading}
                />
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <button
                type="submit"
                style={{
                  ...styles.button,
                  ...(loading ? styles.buttonDisabled : {}),
                }}
                disabled={loading}
              >
                {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
              </button>
            </form>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div style={styles.stepContainer}>
            <div style={styles.successIcon}>✅</div>
            <h1 style={styles.title}>Thành công!</h1>
            <p style={styles.subtitle}>
              Mật khẩu của bạn đã được đặt lại thành công
            </p>

            <button onClick={() => navigate("/auth")} style={styles.button}>
              Quay trở lại trang đăng nhập
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "1rem",
    padding: "2.5rem",
    maxWidth: "500px",
    width: "100%",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "2rem",
  },
  progressStep: {
    display: "flex",
    alignItems: "center",
  },
  progressCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#e5e7eb",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "1rem",
    transition: "all 0.3s",
  },
  progressCircleActive: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
  },
  progressLine: {
    width: "60px",
    height: "3px",
    background: "#e5e7eb",
    transition: "all 0.3s",
  },
  progressLineActive: {
    background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
  },
  stepContainer: {
    textAlign: "center",
  },
  icon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
  successIcon: {
    fontSize: "5rem",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "1.875rem",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#6b7280",
    marginBottom: "2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  formGroup: {
    textAlign: "left",
  },
  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.5rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
  },
  passwordContainer: {
    position: "relative",
  },
  togglePassword: {
    position: "absolute",
    right: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.25rem",
  },
  strengthContainer: {
    marginTop: "0.75rem",
  },
  strengthBar: {
    display: "flex",
    gap: "0.25rem",
    marginBottom: "0.5rem",
  },
  strengthSegment: {
    flex: 1,
    height: "4px",
    borderRadius: "2px",
    transition: "background 0.3s",
  },
  strengthLabel: {
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  error: {
    background: "#fee2e2",
    color: "#ef4444",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    textAlign: "center",
  },
  button: {
    padding: "0.875rem 1.5rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  backButton: {
    padding: "0.75rem",
    background: "transparent",
    color: "#6b7280",
    border: "none",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "color 0.2s",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#667eea",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },
  resendContainer: {
    textAlign: "center",
  },
  resendText: {
    fontSize: "0.875rem",
    color: "#6b7280",
  },
};

export default ForgotPasswordPage;
