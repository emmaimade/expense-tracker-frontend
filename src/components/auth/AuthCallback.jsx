import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';

// Google sends the user back here after signing in; the API has already set
// the session cookies, so we only need to load the profile.
function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    apiService.get('/user/me')
      .then((data) => {
        if (!data.success) throw new Error('Sign-in failed');
        const isFirstLogin =
          !!data.user?.firstLoginAt &&
          !!data.user?.lastLoginAt &&
          data.user.firstLoginAt === data.user.lastLoginAt;

        login({ ...data.user, isFirstLogin });
        navigate('/dashboard', { replace: true });
      })
      .catch(() => navigate('/login?error=google_failed', { replace: true }));
  }, [login, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Signing you in...</p>
      </div>
    </div>
  );
}

export default AuthCallback;
