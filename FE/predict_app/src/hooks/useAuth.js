import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

// Mock database of users
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@predict.com',
    password: 'Admin123',
    name: 'Quản trị viên',
    role: 'admin'
  },
  {
    id: 2,
    email: 'student@email.com',
    password: 'Student123',
    name: 'Nguyễn Văn An',
    role: 'student'
  },
  {
    id: 3,
    email: 'teacher@school.edu',
    password: 'Teacher123',
    name: 'Cô Trần Thị Lan',
    role: 'teacher'
  },
  {
    id: 4,
    email: 'test@gmail.com',
    password: 'Test123456',
    name: 'Người dùng thử nghiệm',
    role: 'student'
  }
];

export const useAuth = () => {
  const [user, setUser] = useLocalStorage('user', null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock database
      const foundUser = MOCK_USERS.find(
        user => user.email.toLowerCase() === credentials.email.toLowerCase() && 
                user.password === credentials.password
      );
      
      if (foundUser) {
        // Don't store password in user data
        const { password: _password, ...userData } = foundUser;
        setUser(userData);
        return { success: true };
      } else {
        throw new Error('Email hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email already exists
      const existingUser = MOCK_USERS.find(
        user => user.email.toLowerCase() === userData.email.toLowerCase()
      );
      
      if (existingUser) {
        throw new Error('Email này đã được sử dụng');
      }
      
      // Validate required fields
      if (!userData.email || !userData.password || !userData.confirmPassword) {
        throw new Error('Vui lòng điền đầy đủ thông tin');
      }
      
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Mật khẩu xác nhận không khớp');
      }
      
      // Create new user
      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name || 'Người dùng mới',
        role: 'student'
      };
      
      // Add to mock database (in real app, this would be API call)
      MOCK_USERS.push({
        ...newUser,
        password: userData.password
      });
      
      setUser(newUser);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, [setUser]);

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!email) {
        throw new Error('Vui lòng nhập email');
      }
      
      // Check if email exists
      const existingUser = MOCK_USERS.find(
        user => user.email.toLowerCase() === email.toLowerCase()
      );
      
      if (!existingUser) {
        throw new Error('Email này không tồn tại trong hệ thống');
      }
      
      return { success: true, message: 'Email khôi phục mật khẩu đã được gửi' };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    clearError: () => setError(null)
  };
};

// Export mock users for reference (remove in production)
export { MOCK_USERS };