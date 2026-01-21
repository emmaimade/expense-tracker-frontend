/**
 * usePreferences Hook
 * Lightweight wrapper for saving/loading user preferences
 * Uses localStorage + syncs with PreferencesContext
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const DEFAULT_PREFERENCES = {
  theme: 'light',
  currency: 'USD',
  currencyFormat: 'symbol',
  notifications: true,
  language: 'en',
  fontSize: 'md',
};

/**
 * @param {string|null} userId
 * @returns {{ preferences: Object, loading: boolean, savePreferences: Function }}
 */
export const usePreferences = (userId) => {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    if (!userId) {
      setPreferences(DEFAULT_PREFERENCES);
      setLoading(false);
      return;
    }

    try {
      const saved = localStorage.getItem(`preferences_${userId}`);
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Save preferences and show toast
   * @param {Object} updates
   * @returns {Promise<Object>}
   */
  const savePreferences = async (updates) => {
    if (!userId) {
      toast.error('Cannot save preferences: User not logged in');
      throw new Error('No user ID');
    }

    setLoading(true);
    try {
      const newPrefs = { ...preferences, ...updates };
      localStorage.setItem(`preferences_${userId}`, JSON.stringify(newPrefs));
      setPreferences(newPrefs);

      toast.success('Preferences saved successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });

      return newPrefs;
    } catch (error) {
      toast.error('Failed to save preferences');
      console.error('Save error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    preferences,
    loading,
    savePreferences,
  };
};