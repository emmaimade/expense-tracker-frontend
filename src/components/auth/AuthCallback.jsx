import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';

// Google sends the user back here after signing in. With BASE_URL pointing at
// the /api proxy, the API has already set the session cookies. Until then the
// API passes a token in the URL instead, kept as a temporary fallback.
function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const legacyToken = searchParams.get('token');
    if (legacyToken) {
      localStorage.setItem('authToken', legacyToken);
    }

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
  }, [login, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500 text-sm dark:text-gray-400">Signing you in...</p>
      </div>
    </div>
  );
}

export default AuthCallback;
