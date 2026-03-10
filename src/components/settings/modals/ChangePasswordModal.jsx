import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingOverlay from '../../common/LoadingOverlay';
import { useProfile } from '../hooks/useProfile';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { changePassword, passwordChangeLoading } = useProfile();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });

      // Reset form and close modal with small delay for toast to show
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      await new Promise(resolve => setTimeout(resolve, 150));

      onClose();
    } catch (err) {
      console.error('Password change failed:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 dark:bg-gray-900/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Change Password</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg p-2 transition-colors disabled:opacity-50 dark:bg-gray-500 dark:hover:bg-gray-700"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {passwordChangeLoading && <LoadingOverlay />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                name="currentPassword"
                type={showPassword.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                required
                disabled={passwordChangeLoading}
              />
              <button
                type="button"
                onClick={() => togglePassword('current')}
                className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 dark:text-gray-400"
                aria-label={showPassword.current ? 'Hide password' : 'Show password'}
              >
                {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                required
                disabled={passwordChangeLoading}
              />
              <button
                type="button"
                onClick={() => togglePassword('new')}
                className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 dark:text-gray-400"
              >
                {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                required
                disabled={passwordChangeLoading}
              />
              <button
                type="button"
                onClick={() => togglePassword('confirm')}
                className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={passwordChangeLoading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {passwordChangeLoading ? 'Changing...' : 'Change Password'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={passwordChangeLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors dark:border-gray-600 dark:bg-gray-500 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
