import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mx-auto mb-2">
          <img src="/logo.svg" alt="SpendWise" className="h-9" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">Confirm Email</h1>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center" aria-live="polite">
          {status === 'verifying' && (
            <>
              <div className="animate-spin h-10 w-10 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-700">Confirming your email…</p>
              <SlowServerNotice active />
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircleIcon className="text-green-500" style={{ fontSize: 48 }} />
              <p className="text-gray-800 font-medium mt-4 mb-2">Email confirmed!</p>
              <p className="text-sm text-gray-500 mb-6">
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
              <ErrorIcon className="text-red-500" style={{ fontSize: 48 }} />
              <p className="text-gray-800 font-medium mt-4 mb-2">We couldn't confirm your email</p>
              <p className="text-sm text-gray-500 mb-6">
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
