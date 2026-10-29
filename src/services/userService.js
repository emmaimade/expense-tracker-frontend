const USER_KEY = 'expense-tracker-user';

/**
 * Retrieves the current authenticated user from localStorage.
 * (The session itself lives in httpOnly cookies; this is just the profile.)
 * Clears corrupted storage entries and returns null on parse failure.
 *
 * @returns {object | null} The stored user object, or null if absent or malformed.
 */
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
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
 * Persists the authenticated user's profile to localStorage.
 * Tokens are never stored here - the session lives in httpOnly cookies.
 *
 * @param {object} userData - The authenticated user object to persist.
 * @throws {Error} If `userData` is absent or not a plain object.
 * @throws {Error} Propagates any localStorage write failure to the caller.
 */
export const setUser = (userData) => {
  if (!userData || typeof userData !== 'object') {
    throw new Error('Invalid user data');
  }
  try {
    // eslint-disable-next-line no-unused-vars -- drop any token before saving
    const { token, ...profile } = userData;
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
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
 * Removes everything this app stored in the browser for a user: session,
 * preferences and in-app notifications. Used after account deletion.
 *
 * @param {string} userId - The deleted user's id.
 */
export const clearAllUserData = (userId) => {
  clearUser();
  if (userId) {
    localStorage.removeItem(`preferences_${userId}`);
    localStorage.removeItem(`notifications_${userId}`);
  }
  localStorage.removeItem('spendwise_last_seen_month');
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
  clearAllUserData,
};