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
  settingsContentInner,
  settingsLabel,
  settingsValue,
  settingsButton,
  settingsButtonHover,
  homeButton,
  homeButtonHover,
  buttonContainer,
  loadingContainer,
  errorContainer,
  errorText,
  retryButton,
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

  // Lấy thông tin user từ API khi component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const tokenFromStorage = localStorage.getItem("token");
      const tokenToUse = token || tokenFromStorage;
      
      if (!tokenToUse) {
        navigate("/auth?mode=login");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await authService.getUserProfile();
        
        if (result.success) {
          setUser(result.data);
        } else {
          setError(result.error);
          
          if (result.error && (
            result.error.includes("Authentication expired") || 
            result.error.includes("No authentication token") ||
            result.error.includes("Invalid token") ||
            result.error.includes("Token expired")
          )) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/auth?mode=login");
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hiển thị loading state
  if (loading) {
    return (
      <>
        <Header />
        <div style={loadingContainer}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "24px", animation: "spin 1s linear infinite" }}>⏳</span>
            <span>Đang tải thông tin người dùng...</span>
          </div>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </>
    );
  }

  // Hiển thị error state
  if (error && !user) {
    return (
      <>
        <Header />
        <div style={errorContainer}>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>😕</div>
          <div style={errorText}>Lỗi: {error}</div>
          <button
            onClick={() => navigate("/auth?mode=login")}
            style={retryButton}
          >
            🔑 Đăng nhập lại
          </button>
        </div>
      </>
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
    className: user.class_name || user.className || null,
  };

  const sections = [
    {
      id: "name",
      icon: "👤",
      label: "Họ và tên",
      value: safeUser.name,
    },
    {
      id: "email",
      icon: "📧",
      label: "Email",
      value: safeUser.email,
    },
    {
      id: "class",
      icon: "🏫",
      label: "Lớp",
      value: safeUser.className || "Chưa được phân lớp",
    },
    {
      id: "password",
      icon: "🔒",
      label: "Mật khẩu",
      value: "••••••••",
    },
  ];

  return (
    <>
      <Header />
      <div style={settingsContainer}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h1 style={settingsTitle}>⚙️ Cài đặt tài khoản</h1>
          <p style={settingsSubtitle}>Quản lý thông tin tài khoản của bạn</p>

          <div style={settingsCard}>
            <div style={settingsCardHeader}>
              <div style={settingsAvatar}>
                {getInitials(safeUser.name)}
              </div>
              <div style={settingsUserName}>{safeUser.name}</div>
              <div style={settingsUserEmail}>{safeUser.email}</div>
              {safeUser.className && (
                <div style={{ 
                  marginTop: "8px", 
                  padding: "6px 16px", 
                  background: "rgba(102, 126, 234, 0.2)", 
                  borderRadius: "20px",
                  display: "inline-block",
                  color: "#a5b4fc",
                  fontSize: "14px",
                  fontWeight: "600"
                }}>
                  🎓 {safeUser.className}
                </div>
              )}
            </div>

            {sections.map((section, index) => (
              <div
                key={section.id}
                style={{
                  ...settingsSection,
                  ...(hoveredSection === section.id ? settingsSectionHover : {}),
                  marginBottom: index === sections.length - 1 ? 0 : "16px",
                }}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div style={settingsIcon}>
                  {section.icon}
                </div>
                <div style={settingsContentInner}>
                  <div style={settingsLabel}>{section.label}</div>
                  <div
                    style={{
                      ...settingsValue,
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span>
                      {section.getValue ? section.getValue() : section.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={buttonContainer}>
            <button
              onClick={() => navigate("/")}
              style={{
                ...homeButton,
                ...(homeButtonHovered ? homeButtonHover : {}),
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
      </div>
    </>
  );
}
