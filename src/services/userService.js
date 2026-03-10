const USER_KEY = 'expense-tracker-user';

/**
 * Retrieves the current authenticated user from localStorage.
 * If the parsed user object is missing a token but one exists under the
 * "authToken" key, it is re-attached before returning.
 * Clears corrupted storage entries and returns null on parse failure.
 *
 * @returns {object | null} The stored user object, or null if absent or malformed.
 */
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);

    if (!user.token) {
      const token = localStorage.getItem('authToken');
      if (token) user.token = token;
    }
    return user;
  } catch (error) {
    console.warn('Invalid user data in localStorage:', error);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('authToken');
    return null;
  }
};

/**
 * Retrieves the current authenticated user's full name.
 * Returns an empty string if the user is unauthenticated or the name is absent.
 *
 * @returns {string} The trimmed full name of the current user, or an empty string.
 */
export const getUserName = () => {
  const user = getCurrentUser();
  return user?.name?.trim() || '';
};

/**
 * Persists the authenticated user object to localStorage.
 * If a token is present on the user object, it is also written to the
 * "authToken" key to keep both storage entries in sync.
 *
 * @param {object} userData - The authenticated user object to persist.
 * @param {string} [userData.token] - The user's authentication token, if available.
 * @throws {Error} If `userData` is absent or not a plain object.
 * @throws {Error} Propagates any localStorage write failure to the caller.
 */
export const setUser = (userData) => {
  if (!userData || typeof userData !== 'object') {
    throw new Error('Invalid user data');
  }
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));

    if (userData.token) {
      localStorage.setItem('authToken', userData.token);
    }
  } catch (error) {
    console.error('Failed to save user to localStorage:', error);
    throw error;
  }
};

/**
 * Clears the current user session by removing all associated
 * localStorage entries.
 *
 * @returns {void}
 */
export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('authToken');
};

/**
 * Service module for managing the authenticated user's session state.
 * Provides methods for reading, writing, and clearing user data in localStorage.
 */
export const userService = {
  getCurrentUser,
  getUserName,
  setUser,
  clearUser,
};