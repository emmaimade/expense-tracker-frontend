import { apiService } from './apiService';

/**
 * Service module for managing the authenticated user's profile.
 * Provides methods for retrieving, updating, and managing account credentials.
 */
export const profileService = {
  /**
   * Retrieves the authenticated user's profile data.
   *
   * @async
   * @returns {Promise<object>} Resolved user profile object.
   * @throws {Error} Propagates any API or network error to the caller.
   */
  getProfile: async () => {
    try {
      const response = await apiService.get('/user/me');
      return response;
    } catch (error) {
      console.error('getProfile error:', error);
      throw error;
    }
  },

  /**
   * Updates the authenticated user's profile with the provided data.
   *
   * @async
   * @param {object} data - The profile fields to update.
   * @returns {Promise<object>} Resolved updated user profile object.
   * @throws {Error} Propagates any API or network error to the caller.
   */
  updateProfile: async (data) => {
    try {
      const response = await apiService.put('/user/profile', data);
      return response;
    } catch (error) {
      console.error('updateProfile error:', error);
      console.error('updateProfile error response data:', error.response?.data);
      throw error;
    }
  },

  /**
   * Updates the authenticated user's password.
   *
   * @async
   * @param {object} data - The password change payload.
   * @param {string} data.currentPassword - The user's current password for verification.
   * @param {string} data.newPassword - The desired new password.
   * @returns {Promise<object>} Resolved confirmation response from the server.
   * @throws {Error} Propagates any API or network error to the caller.
   */
  changePassword: async (data) => {
    try {
      const response = await apiService.put('/user/change-password', data);
      return response;
    } catch (error) {
      console.error('changePassword error:', error);
      throw error;
    }
  },
};