// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';

const AuthContext = createContext();

/**
 * Auth Provider with robust error handling and cleanup
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state safely
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = userService.getCurrentUser();
        setUser(storedUser);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user
   * @param {Object} userData
   */
  const login = useCallback((userData) => {
    try {
      userService.setUser(userData);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  /**
   * ✅ NEW: Update user data (for profile changes)
   * @param {Object} updatedData - Partial user data to update
   */
  const updateUser = useCallback((updatedData) => {
    try {
      // Merge with existing user data
      const updatedUser = {
        ...user,
        ...updatedData,
      };
      
      // Update localStorage
      userService.setUser(updatedUser);
      
      // Update state (triggers re-render everywhere)
      setUser(updatedUser);
      
      console.log('✅ User updated in AuthContext:', updatedUser);
    } catch (error) {
      console.error('Update user failed:', error);
      throw error;
    }
  }, [user]);

  /**
   * Logout user with cleanup
   */
  const logout = useCallback(() => {
    try {
      userService.clearUser();
      setUser(null);
      // Use navigate if available, fallback to window
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    updateUser, // ✅ NEW: Export this function
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook with error boundary
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};