// PreferencesModal.jsx - Clean production version
import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { usePreferencesContext } from '../../../context/PreferencesContext';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
];

const PreferencesModal = ({ 
  isOpen, 
  onClose, 
  preferences, 
  onSave,
  onCurrencyChangeComplete 
}) => {
  const { user } = useAuth();
  const { changeCurrency } = usePreferencesContext();
  
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrencyConfirmation, setShowCurrencyConfirmation] = useState(false);
  const [conversionData, setConversionData] = useState(null);
  const [convertExisting, setConvertExisting] = useState(false);

  const [formData, setFormData] = useState({
    theme: preferences?.theme || 'light',
    notifications: preferences?.notifications ?? true,
    language: preferences?.language || 'en',
    currency: preferences?.currency || user?.currency || 'USD',
    currencyFormat: preferences?.currencyFormat || 'symbol',
    fontSize: preferences?.fontSize || 'md',
  });

  const [originalCurrency, setOriginalCurrency] = useState(formData.currency);

  useEffect(() => {
    if (preferences) {
      const newFormData = {
        theme: preferences.theme || 'light',
        notifications: preferences.notifications ?? true,
        language: preferences.language || 'en',
        currency: preferences.currency || user?.currency || 'USD',
        currencyFormat: preferences.currencyFormat || 'symbol',
        fontSize: preferences.fontSize || 'md',
      };
      setFormData(newFormData);
      setOriginalCurrency(newFormData.currency);
    }
  }, [preferences, user, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowCurrencyConfirmation(false);
      setConversionData(null);
      setConvertExisting(false);
      setIsSaving(false);
    }
  }, [isOpen]);

  const getCurrencyLabel = (code) => {
    const found = CURRENCIES.find(c => c.code === code);
    if (formData.currencyFormat === 'symbol') {
      return found?.symbol || code;
    }
    return code;
  };

  const formatSampleAmount = (value = 1234, display = null) => {
    try {
      const locale = navigator?.language || 'en-US';
      const currencyDisplay = display ? (display === 'code' ? 'code' : 'symbol') : (formData.currencyFormat === 'code' ? 'code' : 'symbol');
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: formData.currency || 'USD',
        currencyDisplay,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } catch (e) {
      const code = formData.currency || 'USD';
      const label = display === 'code' ? code : getCurrencyLabel(code);
      return `${label} ${value.toLocaleString()}`;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Instant theme preview
    if (name === 'theme') {
      const root = document.documentElement;
      if (newValue === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const handleSubmit = async () => {
    const currencyChanged = formData.currency !== originalCurrency;

    if (!currencyChanged) {
      setIsSaving(true);
      try {
        await onSave(formData);
        toast.success('Preferences saved!');
        setTimeout(() => onClose(), 150);
      } catch (err) {
        console.error('Failed to save preferences:', err);
        toast.error('Failed to save preferences');
      } finally {
        setIsSaving(false);
      }
      return;
    }

    // Currency changed - call API with undefined to trigger confirmation dialog
    setIsSaving(true);
    try {
      const result = await changeCurrency(formData.currency, undefined);

      if (result?.requiresConversion) {
        setConversionData({
          currentCurrency: originalCurrency,
          newCurrency: formData.currency,
          expenseCount: result.existingData?.expenseCount || 0,
          budgetCount: result.existingData?.budgetCount || 0,
        });
        setShowCurrencyConfirmation(true);
        setIsSaving(false);
        return;
      }

      // Success without conversion needed
      await onSave(formData);
      setOriginalCurrency(formData.currency);
      toast.success(`Currency updated to ${formData.currency}!`);
      
      if (onCurrencyChangeComplete) {
        await onCurrencyChangeComplete();
      }
      
      setTimeout(() => onClose(), 150);
    } catch (error) {
      console.error('Currency change error:', error);
      
      if (error?.data?.requiresConversion) {
        setConversionData({
          currentCurrency: originalCurrency,
          newCurrency: formData.currency,
          expenseCount: error.data.existingData?.expenseCount || 0,
          budgetCount: error.data.existingData?.budgetCount || 0,
        });
        setShowCurrencyConfirmation(true);
        toast.info('Please confirm whether to convert your existing data.');
      } else {
        toast.error(error.message || 'Failed to update currency');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmConversion = async () => {
    setIsSaving(true);
    try {
      const result = await changeCurrency(formData.currency, convertExisting);

      if (result?.success !== false) {
        await onSave(formData);
        setOriginalCurrency(formData.currency);

        if (result?.converted) {
          const eCount = result.conversion?.expenses?.converted || 0;
          const bCount = result.conversion?.budgets?.converted || 0;
          toast.success(
            `Currency updated! Converted ${eCount} expenses and ${bCount} budgets.`,
            { autoClose: 5000 }
          );
        } else {
          toast.success(`Currency updated to ${formData.currency}!`);
        }

        setShowCurrencyConfirmation(false);
        setConversionData(null);
        
        if (onCurrencyChangeComplete) {
          await onCurrencyChangeComplete();
        }
        
        setTimeout(() => onClose(), 150);
      }
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error(error.message || 'Failed to update currency');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const root = document.documentElement;
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    setShowCurrencyConfirmation(false);
    setConversionData(null);
    onClose();
  };

  if (!isOpen) return null;

  // Currency Conversion Confirmation Modal
  if (showCurrencyConfirmation && conversionData) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Convert Existing Data?
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                You have {conversionData.expenseCount} expenses and {conversionData.budgetCount} budgets. What would you like to do?
              </p>
            </div>
          </div>

          {/* Data Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Current Currency</p>
                <p className="font-semibold text-gray-900">
                  {conversionData.currentCurrency} ({getCurrencyLabel(conversionData.currentCurrency)})
                </p>
              </div>
              <div>
                <p className="text-gray-600">New Currency</p>
                <p className="font-semibold text-indigo-600">
                  {conversionData.newCurrency} ({getCurrencyLabel(conversionData.newCurrency)})
                </p>
              </div>
              <div>
                <p className="text-gray-600">Expenses</p>
                <p className="font-semibold text-gray-900">
                  {conversionData.expenseCount}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Budgets</p>
                <p className="font-semibold text-gray-900">
                  {conversionData.budgetCount}
                </p>
              </div>
            </div>
          </div>

          {/* Conversion Options */}
          <div className="space-y-3 mb-6">
            <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
              convertExisting 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                name="conversionChoice"
                checked={convertExisting === true}
                onChange={() => setConvertExisting(true)}
                className="mt-1 mr-3 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  ✓ Convert all existing data
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  All expenses and budgets will be converted using current exchange rates.
                  Original amounts will be preserved for reference.
                </p>
              </div>
            </label>

            <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
              !convertExisting 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                name="conversionChoice"
                checked={convertExisting === false}
                onChange={() => setConvertExisting(false)}
                className="mt-1 mr-3 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Keep amounts unchanged
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Only new expenses will use {conversionData.newCurrency}.
                  Existing amounts stay the same (numbers won't change).
                </p>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowCurrencyConfirmation(false);
                setConversionData(null);
              }}
              disabled={isSaving}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-900 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmConversion}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSaving ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Preferences Modal
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSaving}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['light', 'dark'].map((theme) => (
                <label key={theme} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.theme === theme
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="theme"
                    value={theme}
                    checked={formData.theme === theme}
                    onChange={handleChange}
                    className="mr-2 text-indigo-600 focus:ring-indigo-500"
                    disabled={isSaving}
                  />
                  <span className="text-gray-900">{theme === 'light' ? '☀️ Light' : '🌙 Dark'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isSaving}
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} - {curr.name} ({curr.symbol})
                </option>
              ))}
            </select>
            {formData.currency !== originalCurrency && (
              <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Currency will be updated when you save
              </p>
            )}
          </div>

          {/* Currency format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['symbol', 'code'].map((format) => (
                <label key={format} className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                  formData.currencyFormat === format 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="currencyFormat"
                    value={format}
                    checked={formData.currencyFormat === format}
                    onChange={handleChange}
                    className="mr-2"
                    disabled={isSaving}
                  />
                  <span className="text-gray-900 text-sm">{formatSampleAmount(1234, format)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Font size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'sm', label: 'Small' },
                { value: 'md', label: 'Medium' },
                { value: 'lg', label: 'Large' }
              ].map((size) => (
                <label
                  key={size.value}
                  className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${
                    formData.fontSize === size.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="fontSize"
                    value={size.value}
                    checked={formData.fontSize === size.value}
                    onChange={handleChange}
                    className="sr-only"
                    disabled={isSaving}
                  />
                  <span className="text-gray-900">{size.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">
                Receive budget alerts and summaries
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleChange}
                className="sr-only peer"
                disabled={isSaving}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-900 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;