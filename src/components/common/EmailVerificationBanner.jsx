import { useEffect, useState } from 'react';
import { MailWarning } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Reminds users who signed up with email/password to confirm their address.
 * Hidden for verified users, Google sign-ups, and accounts that predate
 * verification (the API reports emailVerified: true for those).
 */
const EmailVerificationBanner = () => {
  const { user, updateUser } = useAuth();
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text }

  const isUnverified = user?.emailVerified === false;

  // The user may have confirmed in another tab or device - check once
  useEffect(() => {
    if (!isUnverified) return;
    apiService.get('/user/me')
      .then((res) => {
        if (res?.user?.emailVerified) updateUser({ emailVerified: true });
      })
      .catch(() => {});
  }, [isUnverified, updateUser]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!isUnverified) return null;

  const handleResend = async () => {
    setSending(true);
    setFeedback(null);
    try {
      const res = await apiService.post('/user/resend-verification', {});
      setFeedback({ type: 'success', text: res.message || `Confirmation email sent to ${user.email}` });
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      // "already confirmed" means our stored user is out of date
      if (error.status === 400) {
        updateUser({ emailVerified: true });
        return;
      }
      setFeedback({ type: 'error', text: error.message || "Couldn't send the email. Please try again later." });
    } finally {
      setSending(false);
    }
  };

  const buttonLabel = sending
    ? 'Sending...'
    : cooldown > 0
      ? `Resend in ${cooldown}s`
      : 'Resend email';

  return (
    <div
      role="status"
      className="mb-4 sm:mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
    >
      <div className="flex items-start gap-3 flex-1">
        <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-full text-amber-700 dark:text-amber-200 flex-shrink-0">
          <MailWarning className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-amber-900 dark:text-amber-100 font-medium">Please confirm your email</p>
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            We sent a confirmation link to <strong>{user.email}</strong>. Check your inbox and spam folder.
          </p>
          {feedback && (
            <p className={`text-sm mt-1 ${feedback.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {feedback.text}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={handleResend}
        disabled={sending || cooldown > 0}
        className="px-4 py-2 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default EmailVerificationBanner;
