// Signup.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from "../common/Logo";
import AlertMessage from "../common/AlertMessage";
import FormInput from "../common/FormInput";
import PasswordInput from "../common/PasswordInput";
import GoogleAuthButton from "../auth/GoogleAuthButton";
import getPasswordStrength from "../../utils/passwordUtils";

// Validation schema
const schema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .test('strength', 'Password is too weak', (value) => {
      if (!value) return false;
      const { score } = getPasswordStrength(value);
      return score >= 3;
    }),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
}).required();

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setGeneralError('');
    setSuccessMessage('');

    try {
      const response = await fetch(
        "https://expense-tracker-api-hvss.onrender.com/user/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            email: data.email.trim().toLowerCase(),
            password: data.password,
          }),
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Signup failed');
      }

      // Assuming API returns { user: {...}, token: '...' }
      localStorage.setItem('authToken', resData.token);
      login(resData.user);
      setSuccessMessage('Account created successfully!');
      reset();
      navigate('/dashboard');
    } catch (error) {
      setGeneralError(error.message || 'An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    // Implement Google signup logic
    console.log('Google signup initiated');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo className="mx-auto h-12 w-auto" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {generalError && (
            <AlertMessage type="error" message={generalError} className="mb-4" />
          )}
          {successMessage && (
            <AlertMessage type="success" message={successMessage} className="mb-4" />
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                name="firstName"
                register={register}
                error={errors.firstName?.message}
                placeholder="John"
                disabled={isSubmitting}
              />
              <FormInput
                label="Last Name"
                name="lastName"
                register={register}
                error={errors.lastName?.message}
                placeholder="Doe"
                disabled={isSubmitting}
              />
            </div>

            {/* Email Input */}
            <FormInput
              label="Email address"
              name="email"
              type="email"
              register={register}
              error={errors.email?.message}
              placeholder="email@example.com"
              disabled={isSubmitting}
            />

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-4">
              <PasswordInput
                label="Password"
                name="password"
                register={register}
                error={errors.password?.message}
                placeholder="Enter your password"
                disabled={isSubmitting}
                showStrength={true}
              />
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                register={register}
                error={errors.confirmPassword?.message}
                placeholder="Confirm your password"
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
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
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          {/* Google OAuth Button */}
          <div className="mt-6">
            <GoogleAuthButton onClick={handleGoogleSignup} disabled={isSubmitting} />
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={() => navigate('/login')}
                disabled={isSubmitting}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;