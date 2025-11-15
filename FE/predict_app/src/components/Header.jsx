import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
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
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleSettings = () => {
    navigate('/settings');
    setShowUserMenu(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          📊 <span className="logo-text">PredictGrade</span>
        </div>

        {user && (
          <>
            <nav className="nav-bar">
              <Link
                to="/"
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Home
              </Link>
              <Link
                to="/predict"
                className={`nav-link ${isActive('/predict') ? 'active' : ''}`}
              >
                Predict
              </Link>
              <Link
                to="/history"
                className={`nav-link ${isActive('/history') ? 'active' : ''}`}
              >
                History
              </Link>
            </nav>
            <div className="user-menu-container" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="user-icon-button"
              >
                👤
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                  <button
                    onClick={handleSettings}
                    className="menu-button menu-button-settings"
                  >
                    ⚙️ Cài đặt
                  </button>
                  <button
                    onClick={handleLogout}
                    className="menu-button menu-button-logout"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        
        {!user && (
          <div className="auth-buttons">
            <Link to="/auth?mode=login" className="login-btn">
              Đăng nhập
            </Link>
            <Link to="/auth?mode=register" className="signup-btn">
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

