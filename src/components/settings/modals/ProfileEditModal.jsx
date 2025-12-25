import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingOverlay from '../../common/LoadingOverlay';
import { useProfile } from '../hooks/useProfile';

const ProfileEditModal = ({ isOpen, onClose, profile: initialProfile }) => {
  const { updateProfile } = useProfile();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
  });

  const [pendingEmail, setPendingEmail] = useState(null);

  useEffect(() => {
    if (initialProfile) {
      setFormData({
        firstName: initialProfile.user?.firstName || '',
        lastName: initialProfile.user?.lastName || '',
        email: initialProfile.user?.email || '',
        currentPassword: '',
      });

      if (initialProfile.emailChangeInProgress) {
        setPendingEmail(initialProfile.newEmailPending);
      } else {
        setPendingEmail(null);
      }
    }
  }, [initialProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword) {
      toast.error('Current password is required to save changes');
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        currentPassword: formData.currentPassword,
      };

      await updateProfile(payload);
      
      // ✅ Small delay to ensure toast renders before modal closes
      await new Promise(resolve => setTimeout(resolve, 150));
      
      setFormData(prev => ({ ...prev, currentPassword: '' }));
      onClose();
    } catch (err) {
      // Error toast already shown by hook
      console.error('Update failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSaving && <LoadingOverlay />}

        {pendingEmail && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-700 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Email change in progress
              </p>
              <p className="text-xs text-yellow-700">
                Check <strong>{initialProfile?.user?.email}</strong> for verification link.
                New email: <strong>{pendingEmail}</strong>
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="John"
              required
              disabled={isSaving}
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Smith"
              required
              disabled={isSaving}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="john@example.com"
              required
              disabled={isSaving}
            />
          </div>

          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-red-700 mb-1">
              Current Password <span className="text-xs font-normal text-gray-500">(required)</span>
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="••••••••"
              required
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500 mt-1">
              Required to save any changes
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;