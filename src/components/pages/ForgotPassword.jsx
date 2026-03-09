import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const schema = yup.object({
  email: yup.string().required('Email is required').email('Email is invalid'),
}).required();

function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    setSuccessMessage('');

    try {
      const response = await fetch(
        'https://expense-tracker-api-hvss.onrender.com/user/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ email: data.email.trim().toLowerCase() }),
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Something went wrong');
      }

      setSuccessMessage(resData.message || 'Password reset link sent! Check your email.');
    } catch (error) {
      setServerError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mx-auto mb-2">
          <img src="/logo.svg" alt="SpendWise" className="h-9" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-1">Forgot Password?</h1>
        <p className="text-center text-sm text-gray-500 mb-4">
          Enter your email and we'll send you a reset link
        </p>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-sm">
              <ErrorIcon fontSize="small" />
              {serverError}
            </div>
          )}

          {successMessage ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircleIcon className="text-green-500" style={{ fontSize: 48 }} />
              </div>
              <p className="text-gray-800 font-medium mb-2">Check your inbox</p>
              <p className="text-sm text-gray-500 mb-6">{successMessage}</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EmailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    {...register('email')}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

          {!successMessage && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                disabled={isLoading}
                className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              >
                <ArrowBackIcon fontSize="small" />
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
