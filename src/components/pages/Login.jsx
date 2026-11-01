import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GoogleAuthButton from '../auth/GoogleAuthButton';
import AuthLayout from '../auth/AuthLayout';
import AuthDivider from '../auth/AuthDivider';
import AuthSubmitButton from '../auth/AuthSubmitButton';
import FormInput from '../common/FormInput';
import PasswordInput from '../common/PasswordInput';
import AlertMessage from '../common/AlertMessage';
import { API_BASE_URL } from '../../services/apiService';
import SlowServerNotice from '../common/SlowServerNotice';

// Sign-in only checks that something was entered; password rules apply when a password is created
const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required'),
}).required();

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Set by the Delete account flow in Settings
  const accountDeleted = searchParams.get('deleted') === '1';
  // Set when a session can't be renewed (see apiService)
  const sessionExpired = searchParams.get('expired') === '1';
  const { login } = useAuth();
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

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to see where your money stands."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Sign up
          </Link>
        </>
      }
    >
      {/* Page-level notices sit above everything, since they apply to both sign-in methods */}
      {sessionExpired && !serverError && (
        <AlertMessage type="info" message="Your session has ended. Please sign in again." className="mb-6" />
      )}
      {accountDeleted && !serverError && (
        <AlertMessage type="success" message="Your account and all of its data have been permanently deleted." className="mb-6" />
      )}

      <GoogleAuthButton onClick={handleGoogleLogin} disabled={isLoading} />
      <AuthDivider />

      <AlertMessage type="error" message={serverError} className="mb-4" />

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormInput
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          register={register}
          error={errors.email?.message}
          disabled={isLoading}
          autoComplete="email"
        />

        <PasswordInput
          label="Password"
          name="password"
          register={register}
          error={errors.password?.message}
          disabled={isLoading}
          autoComplete="current-password"
          labelAction={
            <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Forgot password?
            </Link>
          }
        />

        <AuthSubmitButton loading={isLoading} loadingText="Signing in...">
          Sign in
        </AuthSubmitButton>
        <SlowServerNotice active={isLoading} />
      </form>
    </AuthLayout>
  );
}

export default Login;
