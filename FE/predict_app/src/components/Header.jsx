import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  headerStyle,
  headerContent,
  logo,
  logoText,
  navBar,
  navLink,
  navLinkHover,
  navLinkActive,
  userMenuContainer,
  userIconButton,
  userIconButtonHover,
  userDropdown,
  userInfo,
  userName,
  userEmail,
  menuButtonSettings,
  menuButtonLogout,
  authButtons,
  loginBtn,
  loginBtnHover,
} from "../../assets/styles/header.styles";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredUserBtn, setHoveredUserBtn] = useState(false);
  const [hoveredLoginBtn, setHoveredLoginBtn] = useState(false);
  const userMenuRef = useRef(null);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleSettings = () => {
    navigate("/settings");
    setShowUserMenu(false);
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/predict", label: "Predict" },
    { path: "/history", label: "History" },
    { path: "/scoreboard", label: "Scoreboard" },
  ];

  return (
    <header style={headerStyle}>
      <div style={headerContent}>
        <div style={logo}>
          📊 <span style={logoText}>PredictGrade</span>
        </div>

        {user && (
          <>
            <nav style={navBar}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    ...navLink,
                    ...(isActive(link.path) ? navLinkActive : {}),
                    ...(hoveredLink === link.path && !isActive(link.path)
                      ? navLinkHover
                      : {}),
                  }}
                  onMouseEnter={() => setHoveredLink(link.path)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div style={userMenuContainer} ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  ...userIconButton,
                  ...(hoveredUserBtn ? userIconButtonHover : {}),
                }}
                onMouseEnter={() => setHoveredUserBtn(true)}
                onMouseLeave={() => setHoveredUserBtn(false)}
              >
                👤
              </button>
              {showUserMenu && (
                <div style={userDropdown}>
                  <div style={userInfo}>
                    <div style={userName}>{user.name}</div>
                    <div style={userEmail}>{user.email}</div>
                  </div>
                  <button onClick={handleSettings} style={menuButtonSettings}>
                    ⚙️ Cài đặt
                  </button>
                  <button onClick={handleLogout} style={menuButtonLogout}>
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {!user && (
          <div style={authButtons}>
            <Link
              to="/auth?mode=login"
              style={{
                ...loginBtn,
                ...(hoveredLoginBtn ? loginBtnHover : {}),
              }}
              onMouseEnter={() => setHoveredLoginBtn(true)}
              onMouseLeave={() => setHoveredLoginBtn(false)}
            >
              Đăng nhập
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
