// src/settings/modals/PreferencesModal.jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';


const PreferencesModal = ({ isOpen, onClose, preferences, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    theme: preferences?.theme || 'light',
    notifications: preferences?.notifications ?? true,
    language: preferences?.language || 'en',
  });

  // Update form data when preferences change
  useEffect(() => {
    if (preferences) {
      setFormData({
        theme: preferences.theme || 'light',
        notifications: preferences.notifications ?? true,
        language: preferences.language || 'en',
      });
    }
  }, [preferences]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue,
    });

    // INSTANT THEME PREVIEW
    if (name === 'theme') {
      const root = document.documentElement;
      if (newValue === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      console.log('🔄 Theme preview:', newValue);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    try {
      await onSave(formData);
      await new Promise(resolve => setTimeout(resolve, 150));
      onClose();
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Revert theme to saved preference
    const root = document.documentElement;
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    console.log('↩️ Theme reverted to:', preferences.theme);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preferences</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close modal"
            disabled={isSaving}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                formData.theme === 'light'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}>
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={formData.theme === 'light'}
                  onChange={handleChange}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  disabled={isSaving}
                />
                <span className="text-gray-900 dark:text-white">☀️ Light</span>
              </label>
              <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                formData.theme === 'dark'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}>
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={formData.theme === 'dark'}
                  onChange={handleChange}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  disabled={isSaving}
                />
                <span className="text-gray-900 dark:text-white">🌙 Dark</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Theme changes preview instantly
            </p>
          </div>

          {/* Currency selection removed for MVP */}

          {/* Email Notifications Toggle */}
          <div className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
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
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-900 dark:text-white"
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