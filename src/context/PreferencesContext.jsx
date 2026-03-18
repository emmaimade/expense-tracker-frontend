/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import { useAuth } from "./AuthContext";

const PreferencesContext = createContext();

const DEFAULT_PREFERENCES = {
  theme: "light",
  currency: "USD",
  currencyFormat: "symbol",
  notifications: true,
  language: "en",
  fontSize: "md",
};

const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  NGN: "₦",
  JPY: "¥",
  CAD: "$",
  AUD: "$",
  ZAR: "R",
};

export const PreferencesProvider = ({ children, userId }) => {
  const { user, updateUser } = useAuth();
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  // Detect system theme preference on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const storageKey = userId ? `preferences_${userId}` : "preferences_local";
      const saved = localStorage.getItem(storageKey);

      if (!saved) {
        updatePreferences({ theme: e.matches ? "dark" : "light" });
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Apply dark mode class to HTML element whenever theme changes
  useEffect(() => {
    const root = document.documentElement;

    if (preferences.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [preferences.theme]);

  // Apply font-size class to HTML element when font size preference changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("font-size-sm", "font-size-md", "font-size-lg");
    const sizeClass = `font-size-${preferences.fontSize || DEFAULT_PREFERENCES.fontSize}`;
    root.classList.add(sizeClass);
  }, [preferences.fontSize]);

  // Load preferences from localStorage on mount or user change
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const storageKey = userId
          ? `preferences_${userId}`
          : "preferences_local";
        const saved = localStorage.getItem(storageKey);

        if (saved) {
          const parsed = JSON.parse(saved);
          setPreferences(parsed);
        } else {
          const initial = {
            ...DEFAULT_PREFERENCES,
            currency: user?.currency || DEFAULT_PREFERENCES.currency,
          };
          setPreferences(initial);
          localStorage.setItem(storageKey, JSON.stringify(initial));
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
        setPreferences({
          ...DEFAULT_PREFERENCES,
          currency: user?.currency || DEFAULT_PREFERENCES.currency,
        });
      }
    };

    loadPreferences();
  }, [userId, user?.currency]);

  const updatePreferences = (newPrefs) => {
    setPreferences((prev) => {
      const merged = { ...prev, ...newPrefs };

      try {
        const storageKey = userId
          ? `preferences_${userId}`
          : "preferences_local";
        localStorage.setItem(storageKey, JSON.stringify(merged));
      } catch (error) {
        console.error("Failed to save preferences:", error);
      }

      return merged;
    });
  };

  /**
   * Change preferred currency on server when logged in.
   * @param {string} newCurrency - New currency code (e.g., 'NGN')
   * @param {boolean|undefined} convertExisting - Whether to convert existing expenses/budgets (undefined = ask user)
   * @returns {Promise<Object>} Result with conversion details
   */
  const changeCurrency = async (newCurrency, convertExisting) => {
    // If user is not logged in, just update locally
    if (!user || !userId) {
      updatePreferences({ currency: newCurrency });
      return { converted: false, localOnly: true };
    }

    try {
      const requestBody = {
        currency: newCurrency,
        convertExisting: convertExisting,
      };

      const response = await apiService.put("/user/currency", requestBody);

      // On success, update preferences and user profile
      updatePreferences({ currency: newCurrency });

      try {
        if (response.data) {
          updateUser({
            currency: response.data.currency || newCurrency,
            lastCurrencyChange: response.data.lastCurrencyChange,
          });
        }
      } catch (e) {
        console.warn("Could not update user in AuthContext:", e);
      }

      return {
        success: true,
        converted: response.data?.dataConverted || false,
        conversion: response.data?.conversion,
        conversionRate: response.data?.conversionRate,
      };
    } catch (err) {
      // Check if it requires conversion decision
      if (err?.status === 400 && err?.data?.requiresConversion) {
        return {
          requiresConversion: true,
          existingData: err.data.existingData,
        };
      }

      console.error("Currency change failed:", err);
      throw err;
    }
  };

  /**
   * Format amount with current currency preferences
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  const formatCurrency = (amount) => {
    const num = typeof amount === "number" ? amount : 0;

    try {
      const currency = preferences.currency || DEFAULT_PREFERENCES.currency;
      const currencyDisplay =
        preferences.currencyFormat === "code"
          ? "code"
          : currency === "NGN"
            ? "narrowSymbol"
            : "symbol";

      const formatter = new Intl.NumberFormat(preferences.language || "en-US", {
        style: "currency",
        currency,
        currencyDisplay,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return formatter.format(num);
    } catch {
      const currency = preferences.currency || DEFAULT_PREFERENCES.currency;
      const symbol =
        preferences.currencyFormat === "code"
          ? currency
          : CURRENCY_SYMBOLS[currency] || "$";

      return `${symbol}${num.toLocaleString(preferences.language || "en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
  };

  /**
   * Get currency symbol for current currency
   * @returns {string} Currency symbol
   */
  const getCurrencySymbol = () => {
    const currency = preferences.currency || DEFAULT_PREFERENCES.currency;
    if (preferences.currencyFormat === "code") return currency;
    return CURRENCY_SYMBOLS[currency] || "$";
  };

  const value = {
    preferences,
    updatePreferences,
    changeCurrency,
    formatCurrency,
    getCurrencySymbol,
    theme: preferences.theme,
    currency: preferences.currency,
    notifications: preferences.notifications,
    currencyFormat: preferences.currencyFormat,
    fontSize: preferences.fontSize,
    language: preferences.language,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

// Custom hook with error boundary
export const usePreferencesContext = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error(
      "usePreferencesContext must be used within PreferencesProvider",
    );
  }
  return context;
};
