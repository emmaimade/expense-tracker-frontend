import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

function Signup() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    console.log("Form Data:", { firstName, lastName, email, password, confirmPassword });

    // Validation
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) newErrors.email = 'Email is required';

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      console.log('Account created successfully:');
      setIsSubmitting(false);
      navigate('/login'); // Redirect to login after successful signup
    }, 1000);
  }
  
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="Logo size-12 flex justify-center mx-auto mb-6">
        <Logo />
      </div>
      <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
      <p className="text-center text-gray-600">
        Enter your personal data to create your account
      </p>

      {/* Google OAuth Button */}
      <button
        type="button"
        className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 mt-4"
        onClick={() => {
          // Your Google OAuth logic
          console.log("Google OAuth clicked");
        }}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="my-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>
      </div>

      {/* Signup Form */}
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className={`block w-full h-12 px-3 rounded-md border shadow-sm focus:ring-indigo-500 sm:text-sm ${
                errors.firstName
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-indigo-500"
              }`}
              placeholder="John"
              required
            />
            {errors.firstName && (
              <span className="mt-1 text-sm text-red-600">
                {errors.firstName}
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className={`block w-full h-12 px-3 rounded-md border shadow-sm  focus:ring-indigo-500 sm:text-sm 
                ${
                  errors.lastName
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-indigo-500"
                }`}
              placeholder="Doe"
              required
            />
            {errors.lastName && (
              <span className="mt-1 text-sm text-red-600">{errors.lastName}</span>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`block w-full h-12 px-3 rounded-md border shadow-sm  focus:ring-indigo-500 sm:text-sm ${
              errors.email
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-indigo-500"
            }`}
            placeholder="john@example.com"
            required
          />
          {errors.email && (
            <span className="mt-1 text-sm text-red-600">{errors.email}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`block w-full h-12 px-3 rounded-md border shadow-sm  focus:ring-indigo-500 sm:text-sm ${
                errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-indigo-500"
              }`}
              placeholder="Enter password"
              required
            />
            {errors.password && (
              <span className="mt-1 text-sm text-red-600">
                {errors.password}
              </span>
            )}
            <span className="block text-xs font-medium text-gray-400">
              Must be 8 characters long
            </span>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`block w-full h-12 px-3 rounded-md border shadow-sm  focus:ring-indigo-500 sm:text-sm ${
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-indigo-500"
              }`}
              placeholder="Re-enter password"
              required
            />
            {errors.confirmPassword && (
              <span className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </span>
            )}
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md shadow-sm font-medium mt-6 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?
          <button
            type="button"
            className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 bg-transparent border-none cursor-pointer"
            onClick={() => {
              // Navigate back to login
              navigate("/login");
            }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;