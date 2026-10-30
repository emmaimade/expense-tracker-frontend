import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircleAlert, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import GoogleAuthButton from '../auth/GoogleAuthButton';
import { API_BASE_URL } from '../../services/apiService';
import SlowServerNotice from '../common/SlowServerNotice';

// Validation schema
const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Email is invalid'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
}).required();

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Set by the Delete account flow in Settings
  const accountDeleted = searchParams.get('deleted') === '1';
  // Set when a session can't be renewed (see apiService)
  const sessionExpired = searchParams.get('expired') === '1';
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');

    try {
      const response = await fetch(
        `${API_BASE_URL}/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: data.email.trim().toLowerCase(),
            password: data.password,
          }),
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Login failed');
      }

      // The API set the session cookies; we only keep the profile
      login({
        ...resData.user,
        isFirstLogin: resData.isFirstLogin === true,
      });
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-gray-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-6">
          <div className="flex flex-col items-center mb-8">
            <img src="/logo.svg" alt="SpendWise" className="h-10 mb-5" />
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Welcome Back!</h1>
          </div>

          <GoogleAuthButton onClick={handleGoogleLogin} disabled={isLoading} />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-400 dark:bg-gray-800">or continue with email</span>
            </div>
          </div>

          {sessionExpired && !serverError && (
            <div role="status" className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-200">
              Your session has ended. Please sign in again.
            </div>
          )}

          {accountDeleted && !serverError && (
            <div role="status" className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm dark:bg-green-900/30 dark:border-green-800 dark:text-green-200">
              Your account and all of its data have been permanently deleted.
            </div>
          )}

          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
              <CircleAlert className="h-4 w-4" />
              {serverError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white`}
                  {...register("email")}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`block w-full pl-10 pr-10 py-2 border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white`}
                  {...register("password")}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                onClick={() => navigate("/forgot-password")}
                disabled={isLoading}
              >
                Forgot your password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
            <SlowServerNotice active={isLoading} />
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400" onClick={() => navigate("/register")} disabled={isLoading}>
                Sign up
              </button>
            </p>
          </div>
      </div>
    </div>
  );
}

export default Login;