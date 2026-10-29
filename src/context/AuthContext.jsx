import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { API_BASE_URL } from '../services/apiService';

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
   * Update user data after profile edits
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
      
    } catch (error) {
      console.error('Update user failed:', error);
      throw error;
    }
  }, [user]);

  /**
   * Logout user with cleanup
   */
  const logout = useCallback(() => {
    // End the session on the server (clears the httpOnly cookies), then locally.
    // Sign out locally even if the request fails.
    fetch(`${API_BASE_URL}/user/logout`, { method: 'POST', credentials: 'same-origin' })
      .catch((error) => console.error('Logout request failed:', error))
      .finally(() => {
        userService.clearUser();
        setUser(null);
        window.location.href = '/login';
      });
  }, []);

  const value = {
    user,
    login,
    logout,
    updateUser,
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
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};



