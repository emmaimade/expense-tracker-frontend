/**
 * Preferences Context
 * Single source of truth for user preferences (theme, notifications, etc.)
 * Automatically persists to localStorage and applies dark mode globally
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { detectCurrencyByIP, detectCurrencyByLocale } from '../utils/detectCurrency';

const PreferencesContext = createContext();

const DEFAULT_PREFERENCES = {
  theme: 'light',
  currency: 'USD',
  notifications: true,
  language: 'en',
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  NGN: '₦',
};

export const PreferencesProvider = ({ children, userId }) => {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  // Apply dark mode class to HTML element whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    console.log('🎨 Theme applied:', preferences.theme, '| Classes:', root.classList.toString());
  }, [preferences.theme]);

  // Load preferences from localStorage on mount or user change
  useEffect(() => {
    (async () => {
      try {
        // First try per-user preferences if we have a user
        const storageKey = userId ? `preferences_${userId}` : 'preferences_local';
        const saved = localStorage.getItem(storageKey);

        if (saved) {
          const parsed = JSON.parse(saved);
          setPreferences(parsed);
          console.log('📥 Loaded preferences from', storageKey, parsed);

          // If currency missing OR equals the app default, attempt detection and save merged.
          // This preserves any explicit user-set currency while updating stale defaults.
          const shouldDetectCurrency = !parsed.currency || parsed.currency === DEFAULT_PREFERENCES.currency;
          if (shouldDetectCurrency) {
            const detected = (await detectCurrencyByIP()) || detectCurrencyByLocale() || DEFAULT_PREFERENCES.currency;
            if (detected && detected !== parsed.currency) {
              const merged = { ...parsed, currency: detected };
              setPreferences(merged);
              localStorage.setItem(storageKey, JSON.stringify(merged));
              console.log('🔍 Detected and saved currency for', storageKey, detected);
            }
          }
        } else {
          // No saved prefs; start with defaults then attempt detection
          setPreferences(DEFAULT_PREFERENCES);
          console.log('ℹ️ No saved preferences found, using defaults');

          const detected = (await detectCurrencyByIP()) || detectCurrencyByLocale() || DEFAULT_PREFERENCES.currency;
          const merged = { ...DEFAULT_PREFERENCES, currency: detected };
          setPreferences(merged);
          localStorage.setItem(storageKey, JSON.stringify(merged));
          console.log('🔍 Detected and saved currency for', storageKey, detected);
        }
      } catch (error) {
        console.error('❌ Failed to load preferences:', error);
        setPreferences(DEFAULT_PREFERENCES);
      }
    })();
  }, [userId]);

  const updatePreferences = (newPrefs) => {
    console.log('💾 Updating preferences:', newPrefs);

    setPreferences((prev) => {
      const merged = { ...prev, ...newPrefs };

      if (userId) {
        try {
          localStorage.setItem(`preferences_${userId}`, JSON.stringify(merged));
          console.log('✅ Preferences saved to localStorage');
        } catch (error) {
          console.error('❌ Failed to save preferences:', error);
        }
      }

      return merged;
    });
  };

  const formatCurrency = (amount) => {
    const symbol = CURRENCY_SYMBOLS[preferences.currency] || '$';
    const num = typeof amount === 'number' ? amount : 0;

    return `${symbol}${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getCurrencySymbol = () => CURRENCY_SYMBOLS[preferences.currency] || '$';

  const value = {
    preferences,
    updatePreferences,
    formatCurrency,
    getCurrencySymbol,
    theme: preferences.theme,
    currency: preferences.currency,
    notifications: preferences.notifications,
    language: preferences.language,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferencesContext = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferencesContext must be used within PreferencesProvider');
  }
  return context;
};