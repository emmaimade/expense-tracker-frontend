const USER_KEY = 'expense-tracker-user';

/**
 * Safely retrieve user from localStorage
 * @returns {Object|null} User object or null if not found/invalid
 */
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);

    // Re-attach token if missing but exists in authToken
    if (!user.token) {
      const token = localStorage.getItem('authToken');
      if (token) user.token = token;
    }
    return user;
  } catch (error) {
    console.warn('Invalid user data:', error);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('authToken');
    return null;
  }
};

/**
 * Get user name safely
 * @returns {string} User's full name or empty string
 */
export const getUserName = () => {
  const user = getCurrentUser();
  return user?.name?.trim() || '';
};

/**
 * Save user to localStorage
 * @param {Object} userData
 */
export const setUser = (userData) => {
  if (!userData || typeof userData !== 'object') {
    throw new Error('Invalid user data');
  }
  try {
    // Save full user object (including token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData));

    // Also ensure authToken is in sync (defensive)
    if (userData.token) {
      localStorage.setItem('authToken', userData.token);
    }
  } catch (error) {
    console.error('Failed to save user:', error);
    throw error;
  }
};

/**
 * Clear user session
 */
export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('authToken');
};

// Export as object (industry standard)
export const userService = {
  getCurrentUser,
  getUserName,
  setUser,
  clearUser,
};