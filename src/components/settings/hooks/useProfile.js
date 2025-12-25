import { useState, useEffect } from 'react';
import { profileService } from '../../../services/profileService';
import { userService } from '../../../services/userService';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

export const useProfile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      console.log("Profile fetched:", data);
      setProfile(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async ({ firstName, lastName, email, currentPassword }) => {
    try {
      // Store old email BEFORE making the API call
      const oldEmail = profile?.user?.email;
      
      const updated = await profileService.updateProfile({
        firstName,
        lastName,
        email,
        currentPassword,
      });
      
      console.log("✅ Profile updated:", updated);
      
      // ✅ Handle different API response structures
      let userData;
      
      if (updated.user) {
        userData = updated.user;
      } else if (updated.data?.user) {
        userData = updated.data.user;
      } else if (updated.data) {
        userData = updated.data;
      } else {
        userData = updated;
      }

      console.log("✅ Extracted user data:", userData);
      
      // Update local profile state
      setProfile({ user: userData });
      
      // ✅ Get current token
      const currentUser = userService.getCurrentUser();
      const token = currentUser?.token || localStorage.getItem('authToken');
      
      if (!token) {
        console.error('❌ No token found! User might get logged out.');
      }
      
      // ✅ Build complete user object with token
      const completeUserData = {
        id: userData.id || userData._id,
        fullName: userData.fullName || `${userData.firstName} ${userData.lastName}`.trim(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        token: token,
      };
      
      console.log("✅ Complete user data to save:", completeUserData);
      
      // Update localStorage
      userService.setUser(completeUserData);
      
      // ✅ Update AuthContext
      if (updateUser) {
        updateUser(completeUserData);
        console.log("✅ AuthContext updated");
      } else {
        console.error("❌ updateUser function not available!");
      }

      // ✅ Show toast notification
      const emailChanged = email && oldEmail && email.toLowerCase() !== oldEmail.toLowerCase();
      
      if (emailChanged) {
        toast.success('📧 Check your email to verify the new address', {
          position: 'top-right',
          autoClose: 5000,
        });
      } else {
        toast.success('✅ Profile updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }

      return updated;
    } catch (err) {
      console.error("❌ Update profile error:", err);
      console.error("❌ Error response:", err.response?.data);
      
      const msg = err.response?.data?.message || err.message || 'Failed to update profile';
      toast.error(`❌ ${msg}`, {
        position: 'top-right',
        autoClose: 4000,
      });
      
      throw err;
    }
  };

  const changePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
    try {
      setPasswordChangeLoading(true);
      await profileService.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });
      
      toast.success('✅ Password changed successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to change password';
      toast.error(`❌ ${msg}`, {
        position: 'top-right',
        autoClose: 4000,
      });
      throw err;
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    changePassword,
    refetch: fetchProfile,
    passwordChangeLoading,
  };
};