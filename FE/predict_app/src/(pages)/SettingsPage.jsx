import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { authService } from "../services/authService";
import {
  settingsContainer,
  settingsTitle,
  settingsSubtitle,
  settingsCard,
  settingsCardHeader,
  settingsAvatar,
  settingsUserName,
  settingsUserEmail,
  settingsSection,
  settingsSectionHover,
  settingsIcon,
  settingsContent,
  settingsLabel,
  settingsValue,
  settingsButton,
  settingsButtonHover,
} from "../../assets/styles/settings.styles";

export default function SettingsPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [homeButtonHovered, setHomeButtonHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Lấy thông tin user từ API khi component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      // Kiểm tra token từ localStorage trực tiếp (fallback)
      const tokenFromStorage = localStorage.getItem("token");
      const tokenToUse = token || tokenFromStorage;
      
      console.log("DEBUG: SettingsPage - Token from useAuth:", token);
      console.log("DEBUG: SettingsPage - Token from localStorage:", tokenFromStorage);
      
      if (!tokenToUse) {
        console.log("DEBUG: SettingsPage - No token found, redirecting to login");
        navigate("/auth?mode=login");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("DEBUG: SettingsPage - Fetching user profile...");
        const result = await authService.getUserProfile();
        console.log("DEBUG: SettingsPage - Profile result:", result);
        
        if (result.success) {
          setUser(result.data);
          console.log("DEBUG: SettingsPage - User data set:", result.data);
        } else {
          setError(result.error);
          console.log("DEBUG: SettingsPage - Profile fetch failed:", result.error);
          
          // Chỉ redirect nếu thực sự là lỗi authentication
          if (result.error && (
            result.error.includes("Authentication expired") || 
            result.error.includes("No authentication token") ||
            result.error.includes("Invalid token") ||
            result.error.includes("Token expired")
          )) {
            console.log("DEBUG: SettingsPage - Authentication error, redirecting to login");
            // Xóa token và user nếu có
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/auth?mode=login");
          }
          // Nếu là lỗi khác (network, server), không redirect, chỉ hiển thị error
        }
      } catch (err) {
        setError(err.message);
        console.error("DEBUG: SettingsPage - Exception fetching user profile:", err);
        // Không redirect khi có exception (có thể là network error)
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy một lần khi mount

  // Hiển thị loading state
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div>Đang tải thông tin người dùng...</div>
      </div>
    );
  }

  // Hiển thị error state
  if (error && !user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ color: "#e74c3c", marginBottom: "1rem" }}>Lỗi: {error}</div>
        <button
          onClick={() => navigate("/auth?mode=login")}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          Đăng nhập lại
        </button>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getInitials = (name) => {
    if (!name || typeof name !== "string") {
      return "??";
    }
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const safeUser = {
    name: user.name || user.email?.split("@")[0] || "Người dùng",
    email: user.email || "No email",
    id: user.id || "guest",
  };

  const sections = [
    {
      id: "name",
      icon: "👤",
      label: "Tên",
      value: safeUser.name,
      iconBg: "#eff6ff",
    },
    {
      id: "email",
      icon: "📧",
      label: "Email",
      value: safeUser.email,
      iconBg: "#f0f9ff",
    },
    {
      id: "password",
      icon: "🔒",
      label: "Mật khẩu",
      getValue: () => "••••••••",
      iconBg: "#fef3c7",
    },
  ];

  return (
    <>
      <Header />
      <div style={settingsContainer}>
        <h1 style={settingsTitle}>Cài đặt tài khoản</h1>
        <p style={settingsSubtitle}>Quản lý thông tin tài khoản của bạn</p>

        <div style={settingsCard}>
          <div style={settingsCardHeader}>
            <div
              style={{
                ...settingsAvatar,
                backgroundColor: "#3b82f6",
                boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
              }}
            >
              {getInitials(safeUser.name)}
            </div>
            <div style={settingsUserName}>{safeUser.name}</div>
            <div style={settingsUserEmail}>{safeUser.email}</div>
          </div>

          {sections.map((section, index) => (
            <div
              key={section.id}
              style={{
                ...settingsSection,
                ...(hoveredSection === section.id ? settingsSectionHover : {}),
                marginBottom: index === sections.length - 1 ? 0 : "1.5rem",
              }}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div
                style={{
                  ...settingsIcon,
                  backgroundColor: section.iconBg,
                }}
              >
                {section.icon}
              </div>
              <div style={settingsContent}>
                <div style={settingsLabel}>{section.label}</div>
                <div
                  style={{
                    ...settingsValue,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    {section.getValue ? section.getValue() : section.value}
                  </span>
                  {section.id === "password" && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowPassword(!showPassword);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.25rem",
                        color: "#64748b",
                        transition: "all 0.2s ease",
                        borderRadius: "0.375rem",
                        minWidth: "32px",
                        minHeight: "32px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#3b82f6";
                        e.currentTarget.style.backgroundColor = "#eff6ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#64748b";
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      type="button"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "1rem 3rem",
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              ...(homeButtonHovered
                ? {
                    backgroundColor: "#2563eb",
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 20px rgba(59, 130, 246, 0.5)",
                  }
                : {}),
            }}
            onMouseEnter={() => setHomeButtonHovered(true)}
            onMouseLeave={() => setHomeButtonHovered(false)}
          >
            <span>🏠</span>
            Trang chủ
          </button>
          <button
            onClick={logout}
            style={{
              ...settingsButton,
              ...(buttonHovered ? settingsButtonHover : {}),
            }}
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
          >
            <span>🚪</span>
            Đăng xuất
          </button>
        </div>
      </div>
    </>
  );
}
