import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useProfile } from './hooks/useProfile';
import { useAuth } from '../../context/AuthContext';
import ProfileEditModal from './modals/ProfileEditModal';
import ChangePasswordModal from './modals/ChangePasswordModal';
import DeleteAccountModal from './modals/DeleteAccountModal';
import PreferencesSection from './components/PreferencesSection';
import CategoriesSection from './components/CategoriesSection';
import Card from '../common/Card';
import { ProfileInfoSkeleton } from '../common/SettingsSkeletons';

const SECTIONS = ['profile', 'preferences', 'categories'];

const SectionHeading = ({ title, description }) => (
  <div className="mb-3">
    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
    {description && (
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
    )}
  </div>
);

const DetailRow = ({ label, children }) => (
  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between py-3 first:pt-0 last:pb-0 min-w-0">
    <dt className="text-sm text-gray-500 dark:text-gray-400">{label}</dt>
    <dd className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words sm:text-right">{children}</dd>
  </div>
);

const SettingsContent = ({ onDataChange }) => {
  const { user } = useAuth();
  const userId = user?.id;
  const [searchParams] = useSearchParams();

  const { profile, loading: profileLoading, refetch } = useProfile();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ?section=<name> deep links scroll to that section
  useEffect(() => {
    const section = searchParams.get('section');
    if (section && SECTIONS.includes(section)) {
      document.getElementById(`settings-${section}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchParams]);

  const handleProfileModalClose = () => {
    setIsProfileModalOpen(false);
    refetch();
  };

  // Handle successful currency conversion
  const handleCurrencyChangeComplete = async () => {
    if (onDataChange) {
      try {
        await onDataChange();
      } catch (e) {
        console.warn('Failed to refresh data:', e);
        toast.warning('Currency updated but data refresh failed. Please reload the page.');
      }
    }

    await refetch();
  };

  // User not logged in
  if (!userId) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 inline-block">
          <p className="text-red-600 dark:text-red-400 font-medium">
            Please log in to access settings.
          </p>
        </div>
      </div>
    );
  }

  const profileUser = profile?.user;
  const fullName =
    profileUser?.fullName ||
    `${profileUser?.firstName || ''} ${profileUser?.lastName || ''}`.trim() ||
    'Not set';
  const initials = fullName === 'Not set'
    ? '?'
    : fullName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const email = profileUser?.email || user?.email;
  // Google sign-ups have no password; the API reports hasPassword: false for them
  const hasPassword = profileUser?.hasPassword !== false;
  const isVerified = profileUser?.emailVerified !== false;
  const memberSince = profileUser?.firstLoginAt
    ? new Date(profileUser.firstLoginAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : null;

  return (
    <div className="p-0 sm:p-6 max-w-3xl mx-auto space-y-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
        Settings
      </h2>

      {/* Profile */}
      <section id="settings-profile" className="scroll-mt-20">
        <SectionHeading title="Profile" />
        {profileLoading ? (
          <ProfileInfoSkeleton />
        ) : (
          <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="w-14 h-14 shrink-0 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-semibold"
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100 break-words">
                    {fullName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 break-all">
                    {email || 'Not set'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="w-full sm:w-auto shrink-0 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Edit profile
              </button>
            </div>

            {profile?.emailChangeInProgress && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  Email change pending
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                  Check <strong>{profileUser?.email}</strong> for verification link.
                  New email: <strong>{profile.newEmailPending}</strong>
                </p>
              </div>
            )}

            <dl className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
              <DetailRow label="Email status">
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-4 h-4" />
                    Not verified
                  </span>
                )}
              </DetailRow>
              <DetailRow label="Sign-in method">
                {hasPassword ? 'Email and password' : 'Google'}
              </DetailRow>
              {memberSince && <DetailRow label="Member since">{memberSince}</DetailRow>}
              {hasPassword && (
                <DetailRow label="Password">
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                  >
                    Change password
                  </button>
                </DetailRow>
              )}
            </dl>
          </Card>
        )}
      </section>

      {/* Preferences */}
      <section id="settings-preferences" className="scroll-mt-20">
        <SectionHeading title="Preferences" description="Changes are saved automatically." />
        <PreferencesSection onCurrencyChangeComplete={handleCurrencyChangeComplete} />
      </section>

      {/* Categories */}
      <section id="settings-categories" className="scroll-mt-20">
        <SectionHeading
          title="Categories"
          description="Add your own categories to track spending the way you think about it."
        />
        <CategoriesSection userId={userId} />
      </section>

      {/* Danger Zone */}
      <section className="rounded-xl border border-red-200 dark:border-red-900/60 p-4 sm:p-6">
        <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
          Delete account
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Permanently delete your account and all of your expenses, budgets and categories.
          This can't be undone. See our{' '}
          <Link to="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Privacy Policy
          </Link>{' '}
          for what we store.
        </p>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          Delete account
        </button>
      </section>

      {/* Modals */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={handleProfileModalClose}
        profile={profile}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        hasPassword={hasPassword}
        email={email}
        userId={userId}
      />
    </div>
  );
};

export default SettingsContent;
