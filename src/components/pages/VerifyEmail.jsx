import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CircleAlert, CircleCheck } from 'lucide-react';
import { API_BASE_URL } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import SlowServerNotice from '../common/SlowServerNotice';

// Opened from the link in the confirmation email: /verify-email?token=...
function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { user, updateUser } = useAuth();

  const [status, setStatus] = useState(token ? 'verifying' : 'error');
  const [message, setMessage] = useState(token ? '' : 'This confirmation link is missing its token.');
  // Links are single-use, so make sure we only send one request
  // (React runs effects twice in development)
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;

    const confirmEmail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const resData = await response.json();
        if (!response.ok) throw new Error(resData.message || 'Could not confirm your email');

        // Update the signed-in user in this browser so the reminder banner disappears
        if (user && user.email === resData.user?.email) {
          updateUser({ emailVerified: true });
        }
        setStatus('success');
      } catch (error) {
        setMessage(error.message || 'Could not confirm your email');
        setStatus('error');
      }
    };

    confirmEmail();
  }, [token, user, updateUser]);

  const primaryAction = user
    ? { label: 'Go to Dashboard', onClick: () => navigate('/dashboard') }
    : { label: 'Sign In', onClick: () => navigate('/login') };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mx-auto mb-2">
          {/* Logo goes back to the landing page */}
          <Link to="/" className="inline-block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <img src="/logo.svg" alt="SpendWise home" className="h-9" />
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">Confirm Email</h1>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center dark:bg-gray-800" aria-live="polite">
          {status === 'verifying' && (
            <>
              <div className="animate-spin h-10 w-10 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-700 dark:text-gray-300">Confirming your email…</p>
              <SlowServerNotice active />
            </>
          )}

          {status === 'success' && (
            <>
              <CircleCheck className="text-green-500 w-12 h-12" />
              <p className="text-gray-800 font-medium mt-4 mb-2 dark:text-gray-100">Email confirmed!</p>
              <p className="text-sm text-gray-500 mb-6 dark:text-gray-400">
                Thanks for confirming. You'll now receive security alerts and account emails from SpendWise.
              </p>
              <button
                onClick={primaryAction.onClick}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {primaryAction.label}
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <CircleAlert className="text-red-500 w-12 h-12" />
              <p className="text-gray-800 font-medium mt-4 mb-2 dark:text-gray-100">We couldn't confirm your email</p>
              <p className="text-sm text-gray-500 mb-6 dark:text-gray-400">
                {message} {user
                  ? 'You can send a new link from the banner on your dashboard.'
                  : 'Sign in to send yourself a new link.'}
              </p>
              <button
                onClick={primaryAction.onClick}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {primaryAction.label}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
