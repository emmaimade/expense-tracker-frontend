// SettingsContent.jsx
import { useState } from 'react';
import { useProfile } from './hooks/useProfile';
import { usePreferences } from './hooks/usePreferences';
import { usePreferencesContext } from '../../context/PreferencesContext';
import { useAuth } from '../../context/AuthContext';
import CategoryManagementModal from './modals/CategoryManagementModal';
import ProfileEditModal from './modals/ProfileEditModal';
import ChangePasswordModal from './modals/ChangePasswordModal';
import PreferencesModal from './modals/PreferencesModal';

const SettingsContent = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const { profile, loading: profileLoading, refetch } = useProfile();
  const { preferences, updatePreferences, loading: prefsLoading } = usePreferencesContext();

  const [activeSection, setActiveSection] = useState('profile');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);

  const handleProfileModalClose = () => {
    setIsProfileModalOpen(false);
    refetch();
  };

  // ✅ Handle preferences save - update both hook and context
  const handleSavePreferences = async (newPrefs) => {
    await updatePreferences(newPrefs);
  };

  if (!userId) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 inline-block">
          <p className="text-red-600 dark:text-red-400 font-medium">Please log in to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Settings</h2>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {["profile", "categories", "preferences"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSection(tab)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors capitalize ${
              activeSection === tab
                ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profile Section */}
      {activeSection === "profile" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Profile Information
            </h3>
            {profileLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading profile...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Name:</span>
                  <span className="text-gray-900 dark:text-white">
                    {profile?.user?.fullName || 
                     `${profile?.user?.firstName || ''} ${profile?.user?.lastName || ''}`.trim() || 
                     'Not set'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Email:</span>
                  <span className="text-gray-900 dark:text-white">{profile?.user?.email || 'Not set'}</span>
                </div>

                {profile?.emailChangeInProgress && (
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm">
                    <p className="font-medium text-yellow-800 dark:text-yellow-400">
                      ⚠️ Email change pending
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-500 mt-1">
                      Check <strong>{profile.user?.email}</strong> for verification link.
                      New email: <strong>{profile.newEmailPending}</strong>
                    </p>
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-900 dark:text-white"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Account Stats */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 p-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Account Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">User ID</p>
                <p className="text-sm font-mono text-gray-900 dark:text-white mt-1">{userId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Account Status</p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">Active</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "categories" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
            Category Management
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Create and organize your expense categories to better track your spending.
          </p>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Manage Categories
          </button>
        </div>
      )}

      {activeSection === "preferences" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
            Preferences
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Customize your experience with notifications and other preferences.
          </p>
          <button
            onClick={() => setIsPreferencesModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Edit Preferences
          </button>
        </div>
      )}

      {/* Modals */}
      <CategoryManagementModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        userId={userId}
      />
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={handleProfileModalClose}
        profile={profile}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      <PreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        preferences={preferences}
        onSave={handleSavePreferences}
      />
    </div>
  );
};

export default SettingsContent;