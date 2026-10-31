import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AlertMessage from "../common/AlertMessage";
import FormInput from "../common/FormInput";
import { inputClasses } from "../common/inputClasses";
import PasswordInput from "../common/PasswordInput";
import GoogleAuthButton from "../auth/GoogleAuthButton";
import AuthLayout from '../auth/AuthLayout';
import AuthDivider from '../auth/AuthDivider';
import AuthSubmitButton from '../auth/AuthSubmitButton';
import { meetsPasswordRules } from "../../utils/passwordUtils";
import { detectCurrencyByLocale } from '../../utils/detectCurrency';
import { CURRENCIES } from '../settings/currencies';
import { API_BASE_URL } from '../../services/apiService';
import SlowServerNotice from '../common/SlowServerNotice';

const NAME_PATTERN = /^[\p{L}\s'-]+$/u;

const schema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'At least 2 characters')
    .matches(NAME_PATTERN, 'Letters, spaces, hyphens and apostrophes only'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'At least 2 characters')
    .matches(NAME_PATTERN, 'Letters, spaces, hyphens and apostrophes only'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .test('rules', "Password doesn't meet all the requirements below", (value) => meetsPasswordRules(value || '')),
  currency: yup
    .string()
    .required('Please choose a currency')
    .matches(/^[A-Z]{3}$/, 'Invalid currency code'),
}).required();

const isSupported = (code) => CURRENCIES.some((c) => c.code === code);
const describeCurrency = (code) => {
  const found = CURRENCIES.find((c) => c.code === code);
  return found ? `${found.code} · ${found.name} (${found.symbol})` : code;
};

// An instant guess from the browser's locale, so the form never waits on the server
const localeGuess = () => {
  const code = detectCurrencyByLocale();
  return isSupported(code) ? code : 'USD';
};

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [currencySource, setCurrencySource] = useState('your browser settings');
  // Once the user picks a currency, a late server suggestion must not override it
  const currencyChosenByUser = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setFocus,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      currency: localeGuess(),
    },
  });

  const currency = watch('currency');

  useEffect(() => {
    const keys = Object.keys(errors);
    if (keys.length > 0 && typeof setFocus === 'function') {
      if (keys[0] === 'currency') setShowCurrencyPicker(true);
      setFocus(keys[0]);
    }
  }, [errors, setFocus]);

  // Refine the guess with the server's location-based suggestion, in the background.
  // This can take a while when the API is waking up, so it never blocks the form.
  useEffect(() => {
    let cancelled = false;
    const refine = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/detect-currency`);
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && data.success && isSupported(data.currency) && !currencyChosenByUser.current) {
          setValue('currency', data.currency);
          setCurrencySource('your location');
        }
      } catch {
        // Keep the locale guess
      }
    };
    refine();
    return () => {
      cancelled = true;
    };
  }, [setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setGeneralError('');

    try {
      const response = await fetch(
        `${API_BASE_URL}/user/register`,
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
            // The API still expects a confirmation; the show-password toggle replaces the second field
            confirmPassword: data.password,
            currency: data.currency,
          }),
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Signup failed');
      }

      // Same shape as login and /user/me; the API set the session cookies
      const userObject = {
        ...resData.user,
        isFirstLogin: true,
      };

      if (!userObject.id) {
        throw new Error('Invalid response from server - missing user ID');
      }

      login(userObject);
      // The dashboard's verification banner tells them to check their email
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Signup error:', error);
      setGeneralError(error.message || 'An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking in under a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Sign in
          </Link>
        </>
      }
    >
      <GoogleAuthButton onClick={handleGoogleSignup} disabled={isSubmitting} />
      <AuthDivider />

      <AlertMessage type="error" message={generalError} className="mb-4" />

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset className="grid grid-cols-2 gap-3">
          <legend className="sr-only">Your name</legend>
          <FormInput
            label="First name"
            name="firstName"
            register={register}
            error={errors.firstName?.message}
            disabled={isSubmitting}
            autoComplete="given-name"
            aria-required="true"
          />
          <FormInput
            label="Last name"
            name="lastName"
            register={register}
            error={errors.lastName?.message}
            disabled={isSubmitting}
            autoComplete="family-name"
            aria-required="true"
          />
        </fieldset>

        <FormInput
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          register={register}
          error={errors.email?.message}
          disabled={isSubmitting}
          autoComplete="email"
          aria-required="true"
        />

        <PasswordInput
          label="Password"
          name="password"
          register={register}
          error={errors.password?.message}
          disabled={isSubmitting}
          showChecklist={true}
          autoComplete="new-password"
          aria-required="true"
        />

        {/* Currency: detected for you, one line; "Change" opens the full list */}
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Currency
            </label>
            {!showCurrencyPicker && (
              <button
                type="button"
                onClick={() => setShowCurrencyPicker(true)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                disabled={isSubmitting}
              >
                Change
              </button>
            )}
          </div>
          {showCurrencyPicker ? (
            <select
              id="currency"
              {...register("currency", {
                onChange: () => {
                  currencyChosenByUser.current = true;
                },
              })}
              disabled={isSubmitting}
              aria-invalid={!!errors.currency}
              aria-describedby={errors.currency ? "currency-error" : undefined}
              className={inputClasses(errors.currency)}
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} - {curr.name} ({curr.symbol})
                </option>
              ))}
            </select>
          ) : (
            <>
              <input type="hidden" {...register("currency")} />
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {describeCurrency(currency)}
                <span className="text-gray-500 dark:text-gray-400"> · based on {currencySource}</span>
              </p>
            </>
          )}
          {errors.currency && (
            <p id="currency-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.currency.message}
            </p>
          )}
        </div>

        <AuthSubmitButton loading={isSubmitting} loadingText="Creating account...">
          Create account
        </AuthSubmitButton>
        <SlowServerNotice active={isSubmitting} />

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          By creating an account, you agree to our{' '}
          <Link to="/privacy" className="text-indigo-600 underline hover:text-indigo-500 dark:text-indigo-400">Privacy Policy</Link>.
        </p>
      </form>
    </AuthLayout>
  );
}

export default Signup;
