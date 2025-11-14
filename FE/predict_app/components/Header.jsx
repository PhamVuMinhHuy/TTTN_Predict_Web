import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../src/hooks/useAuth";
import {
  header,
  headerContent,
  logo,
  logoText,
  authButtons,
  loginBtn,
  loginBtnHover,
  signupBtn,
  signupBtnHover,
  navBar,
  navLink,
  navLinkHover,
  navLinkActive,
} from "../assets/styles/landing.styles";

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [hoveredElement, setHoveredElement] = useState(null);

  const getHoverStyle = (elementType, hoverStyle) => {
    return hoveredElement === elementType ? hoverStyle : {};
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header style={header}>
      <div style={headerContent}>
        {/* Logo - Left */}
        <div style={logo}>
          📊 <span style={logoText}>PredictGrade</span>
        </div>

        {/* Navigation Bar - Center */}
        <nav style={navBar}>
          <Link
            to="/"
            style={{
              ...navLink,
              ...(isActive("/") ? navLinkActive : {}),
              ...getHoverStyle("nav-home", navLinkHover),
              textDecoration: "none",
            }}
            onMouseEnter={() => setHoveredElement("nav-home")}
            onMouseLeave={() => setHoveredElement(null)}
          >
            Home
          </Link>
          {user && (
            <>
              <Link
                to="/predict"
                style={{
                  ...navLink,
                  ...(isActive("/predict") ? navLinkActive : {}),
                  ...getHoverStyle("nav-predict", navLinkHover),
                  textDecoration: "none",
                }}
                onMouseEnter={() => setHoveredElement("nav-predict")}
                onMouseLeave={() => setHoveredElement(null)}
              >
                Predict
              </Link>
              <Link
                to="/history"
                style={{
                  ...navLink,
                  ...(isActive("/history") ? navLinkActive : {}),
                  ...getHoverStyle("nav-history", navLinkHover),
                  textDecoration: "none",
                }}
                onMouseEnter={() => setHoveredElement("nav-history")}
                onMouseLeave={() => setHoveredElement(null)}
              >
                History
              </Link>
            </>
          )}
        </nav>

        {/* Auth Buttons - Right */}
        {!user && (
          <div style={authButtons}>
            <Link
              to="/auth?mode=login"
              style={{
                ...loginBtn,
                ...getHoverStyle("login-btn", loginBtnHover),
                textDecoration: "none",
                display: "inline-block",
              }}
              onMouseEnter={() => setHoveredElement("login-btn")}
              onMouseLeave={() => setHoveredElement(null)}
            >
              Đăng nhập
            </Link>
            <Link
              to="/auth?mode=register"
              style={{
                ...signupBtn,
                ...getHoverStyle("signup-btn", signupBtnHover),
                textDecoration: "none",
                display: "inline-block",
              }}
              onMouseEnter={() => setHoveredElement("signup-btn")}
              onMouseLeave={() => setHoveredElement(null)}
            >
              Đăng ký
            </Link>
          </div>
        )}
        {user && <div style={{ width: "1px" }} />}
      </div>
    </header>
  );
};

export default Header;
