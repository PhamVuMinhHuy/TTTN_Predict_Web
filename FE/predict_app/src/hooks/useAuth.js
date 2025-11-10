import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useAuth = () => {
  const [user, setUser] = useLocalStorage('user', null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      if (credentials.email && credentials.password) {
        const userData = {
          id: 1,
          email: credentials.email,
          name: 'User Name'
        };
        setUser(userData);
        return { success: true };
      } else {
        throw new Error('Email và mật khẩu không hợp lệ');
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock registration logic
      if (userData.email && userData.password && userData.confirmPassword) {
        if (userData.password !== userData.confirmPassword) {
          throw new Error('Mật khẩu xác nhận không khớp');
        }
        
        const newUser = {
          id: Date.now(),
          email: userData.email,
          name: userData.name || 'New User'
        };
        setUser(newUser);
        return { success: true };
      } else {
        throw new Error('Vui lòng điền đầy đủ thông tin');
      }
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email) {
        return { success: true, message: 'Email khôi phục mật khẩu đã được gửi' };
      } else {
        throw new Error('Vui lòng nhập email');
      }
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