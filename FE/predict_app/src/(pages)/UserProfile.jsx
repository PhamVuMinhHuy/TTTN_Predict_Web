import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  profileContainer,
  profileTitle,
  profileInfo,
  profileLogoutButton,
  profileLogoutButtonHover,
} from '../../assets/styles/userProfile.styles';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [hovered, setHovered] = useState(false);

  if (!user) {
    return null; // Không hiển thị gì nếu chưa đăng nhập
  }

  return (
    <div style={profileContainer}>
      <div style={profileTitle}>
        Đã đăng nhập
      </div>
      
      <div style={profileInfo}>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Tên:</strong> {user.name}</div>
      </div>
      
      <button
        onClick={logout}
        style={{
          ...profileLogoutButton,
          ...(hovered ? profileLogoutButtonHover : {}),
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        Đăng xuất
      </button>
    </div>
  );
}