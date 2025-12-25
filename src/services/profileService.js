import { apiService } from './apiService';

export const profileService = {
  getProfile: async () => {
    try {
      const response = await apiService.get('/user/me');
      console.log('📡 getProfile response:', response);
      return response;
    } catch (error) {
      console.error('❌ getProfile error:', error);
      throw error;
    }
  },

  updateProfile: async (data) => {
    try {
      console.log('📤 Sending profile update:', data);
      const response = await apiService.put('/user/profile', data);
      console.log('📡 updateProfile RAW response:', response);
      
      return response;
    } catch (error) {
      console.error('❌ updateProfile error:', error);
      console.error('❌ Error response data:', error.response?.data);
      throw error;
    }
  },

  changePassword: async (data) => {
    try {
      console.log('📤 Sending password change request');
      const response = await apiService.put('/user/change-password', data);
      console.log('📡 changePassword response:', response);
      return response;
    } catch (error) {
      console.error('❌ changePassword error:', error);
      throw error;
    }
  },
};