// Signup.jsx - Fixed with proper auto-login
import { useState, useEffect } from 'react';
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

// Validation schema with currency
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
  currency: yup
    .string()
    .required('Please select your preferred currency')
    .matches(/^[A-Z]{3}$/, 'Invalid currency code'),
}).required();

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
];

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [suggestedCurrency, setSuggestedCurrency] = useState(null);
  const [isDetecting, setIsDetecting] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setFocus,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      currency: '',
    },
  });

  useEffect(() => {
    const keys = Object.keys(errors);
    if (keys.length > 0 && typeof setFocus === 'function') {
      setFocus(keys[0]);
    }
  }, [errors, setFocus]);

  // Fetch currency suggestion from backend on mount
  useEffect(() => {
    const detectCurrency = async () => {
      try {
        const response = await fetch(
          'https://expense-tracker-api-hvss.onrender.com/user/detect-currency'
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.currency) {
            setSuggestedCurrency({
              code: data.currency,
              symbol: data.symbol,
              reason: data.message || `Detected from your location`
            });
            setValue('currency', data.currency);
            console.log('✅ Currency detected:', data.currency);
          }
        }
      } catch (error) {
        console.error('Currency detection failed:', error);
        setValue('currency', 'USD');
      } finally {
        setIsDetecting(false);
      }
    };

    detectCurrency();
  }, [setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setGeneralError('');
    setSuccessMessage('');

    try {
      const response = await fetch(
        "https://expense-tracker-api-hvss.onrender.com/user/register",
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
            confirmPassword: data.confirmPassword,
            currency: data.currency,
          }),
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Signup failed');
      }

      console.log('✅ Signup response:', resData);

      // ✅ CRITICAL FIX: Properly structure the user object for AuthContext
      const userObject = {
        // Use the ID from response (could be _id or id)
        id: resData.user?.id || resData.user?._id,
        // Full name for display
        name: `${data.firstName.trim()} ${data.lastName.trim()}`,
        // Email from response (or use submitted email)
        email: resData.user?.email || data.email.trim().toLowerCase(),
        // Currency from response (backend confirmed)
        currency: resData.user?.currency || data.currency,
        // Token is REQUIRED for authenticated requests
        token: resData.token,
      };

      console.log('👤 User object for login:', userObject);

      // Validate that we have required fields
      if (!userObject.id || !userObject.token) {
        throw new Error('Invalid response from server - missing user ID or token');
      }

      // Store token in localStorage (for apiService to use)
      localStorage.setItem('authToken', userObject.token);

      // Login user (this updates AuthContext AND localStorage via userService)
      login(userObject);

      setSuccessMessage('Account created successfully! Redirecting...');
      reset();
      
      // Wait a bit for state to update, then redirect
      setTimeout(() => {
        console.log('🚀 Redirecting to dashboard...');
        navigate('/dashboard', { replace: true });
      }, 1500);

    } catch (error) {
      console.error('❌ Signup error:', error);
      setGeneralError(error.message || 'An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log('Google signup initiated');
    // Implement Google signup logic
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="Logo size-12 flex justify-center mx-auto mb-6">
          <Logo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {generalError && (
            <AlertMessage
              type="error"
              message={generalError}
              className="mb-4"
            />
          )}
          {successMessage && (
            <AlertMessage
              type="success"
              message={successMessage}
              className="mb-4"
            />
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Fields */}
            <fieldset
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              aria-labelledby="name-fieldset"
            >
              <legend id="name-fieldset" className="sr-only">
                Full name
              </legend>
              <FormInput
                label="First Name"
                name="firstName"
                register={register}
                error={errors.firstName?.message}
                placeholder="John"
                disabled={isSubmitting}
                autoComplete="given-name"
                aria-required="true"
              />
              <FormInput
                label="Last Name"
                name="lastName"
                register={register}
                error={errors.lastName?.message}
                placeholder="Doe"
                disabled={isSubmitting}
                autoComplete="family-name"
                aria-required="true"
              />
            </fieldset>

            {/* Email Input */}
            <FormInput
              label="Email address"
              name="email"
              type="email"
              register={register}
              error={errors.email?.message}
              placeholder="email@example.com"
              disabled={isSubmitting}
              autoComplete="email"
              aria-required="true"
            />

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordInput
                label="Password"
                name="password"
                register={register}
                error={errors.password?.message}
                placeholder="Enter your password"
                disabled={isSubmitting}
                showStrength={true}
                autoComplete="new-password"
                aria-required="true"
              />
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                register={register}
                error={errors.confirmPassword?.message}
                placeholder="Confirm your password"
                disabled={isSubmitting}
                autoComplete="new-password"
                aria-required="true"
              />
            </div>

            {/* Currency Selection */}
            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Preferred Currency <span className="text-red-500">*</span>
              </label>

              {suggestedCurrency && !isDetecting && (
                <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Suggested:</strong> {suggestedCurrency.code} (
                    {suggestedCurrency.symbol})
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {suggestedCurrency.reason}
                  </p>
                </div>
              )}

              {isDetecting ? (
                <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">
                    Detecting your currency...
                  </span>
                </div>
              ) : (
                <select
                  id="currency"
                  {...register("currency")}
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-invalid={errors.currency ? "true" : "false"}
                  aria-describedby={
                    errors.currency ? "currency-error" : undefined
                  }
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.currency ? "border-red-500" : "border-gray-300"
                  } ${
                    isSubmitting ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                  }`}
                >
                  <option value="">-- Select Currency --</option>

                  {suggestedCurrency && (
                    <>
                      <option value={suggestedCurrency.code}>
                        ✨ {suggestedCurrency.code} -{" "}
                        {
                          CURRENCIES.find(
                            (c) => c.code === suggestedCurrency.code
                          )?.name
                        }{" "}
                        ({suggestedCurrency.symbol}) - Suggested
                      </option>
                      <option disabled>──────────────</option>
                    </>
                  )}

                  {CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name} ({curr.symbol})
                    </option>
                  ))}
                </select>
              )}

              {errors.currency && (
                <p
                  id="currency-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                  aria-live="assertive"
                >
                  {errors.currency.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isDetecting}
              aria-busy={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting || isDetecting
                  ? "opacity-75 cursor-not-allowed"
                  : ""
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
              ) : isDetecting ? (
                "Detecting Currency..."
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Google OAuth Button */}
          <div className="mt-6">
            <GoogleAuthButton
              onClick={handleGoogleSignup}
              disabled={isSubmitting}
            />
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={() => navigate("/login")}
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