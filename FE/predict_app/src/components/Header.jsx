import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
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
} from '../../assets/styles/landing.styles';

const Header = () => {
  const { user } = useAuth();
  const [hoveredElement, setHoveredElement] = useState(null);

  const getHoverStyle = (elementType, hoverStyle) => {
    return hoveredElement === elementType ? hoverStyle : {};
  };

  return (
    <header style={header}>
      <div style={headerContent}>
        <div style={logo}>
          📊 <span style={logoText}>PredictGrade</span>
        </div>
        
        {!user && (
          <div style={authButtons}>
            <Link 
              to="/auth?mode=login"
              style={{
                ...loginBtn,
                ...getHoverStyle('login-btn', loginBtnHover),
                textDecoration: 'none',
                display: 'inline-block'
              }}
              onMouseEnter={() => setHoveredElement('login-btn')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              Đăng nhập
            </Link>
            <Link 
              to="/auth?mode=register"
              style={{
                ...signupBtn,
                ...getHoverStyle('signup-btn', signupBtnHover),
                textDecoration: 'none',
                display: 'inline-block'
              }}
              onMouseEnter={() => setHoveredElement('signup-btn')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

