import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PredictPage = () => {
  const { user } = useAuth();

  return (
    <div style={{ 
      padding: '4rem 2rem', 
      textAlign: 'center',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '1rem',
        color: '#1f2937'
      }}>
        🎓 Trang Dự Đoán Điểm Số
      </h1>
      <p style={{ 
        fontSize: '1.2rem', 
        color: '#6b7280',
        marginBottom: '2rem'
      }}>
        Tính năng này đang được phát triển và sẽ sớm ra mắt!
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link 
          to="/"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '1rem',
            display: 'inline-block'
          }}
        >
          🏠 Quay lại trang chủ
        </Link>
        {user && (
          <button 
            onClick={() => alert('Chức năng đang phát triển')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '1rem'
            }}
          >
            📊 Bắt đầu dự đoán
          </button>
        )}
      </div>
    </div>
  );
};

export default PredictPage;