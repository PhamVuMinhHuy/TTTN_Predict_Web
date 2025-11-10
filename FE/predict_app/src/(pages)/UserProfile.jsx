import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) {
    return null; // Không hiển thị gì nếu chưa đăng nhập
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      border: '1px solid #dee2e6',
      minWidth: '200px'
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '8px',
        color: '#495057'
      }}>
        Đã đăng nhập
      </div>
      
      <div style={{
        fontSize: '13px',
        color: '#6c757d',
        marginBottom: '10px'
      }}>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Tên:</strong> {user.name}</div>
      </div>
      
      <button
        onClick={logout}
        style={{
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          cursor: 'pointer',
          width: '100%'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
      >
        Đăng xuất
      </button>
    </div>
  );
}