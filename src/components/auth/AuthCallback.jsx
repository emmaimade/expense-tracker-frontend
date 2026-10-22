import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../services/apiService';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      navigate('/login?error=google_failed');
      return;
    }

    fetch(`${API_BASE_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const isFirstLogin =
              !!data.user?.firstLoginAt &&
              !!data.user?.lastLoginAt &&
              data.user.firstLoginAt === data.user.lastLoginAt;

            const normalizedUser = {
              ...data.user,
              isFirstLogin,
              token,
            };

          localStorage.setItem('authToken', token);
          login(normalizedUser);
          navigate('/dashboard');
        } else {
          navigate('/login?error=google_failed');
        }
      })
      .catch(() => navigate('/login?error=google_failed'));
  }, [login, navigate, searchParams]);

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
