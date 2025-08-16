import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Logo from "./Logo";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Password strength validation
  const getPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear general messages when user modifies form
    if (generalError) setGeneralError("");
    if (successMessage) setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = "First name can only contain letters";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = "Last name can only contain letters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const { checks, score } = getPasswordStrength(formData.password);
      if (!checks.length) {
        newErrors.password = "Password must be at least 8 characters long";
      } else if (score < 3) {
        newErrors.password =
          "Password is too weak. Include uppercase, lowercase, numbers, and special characters";
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setGeneralError('');
    setSuccessMessage('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with your actual signup endpoint
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     firstName: formData.firstName.trim(),
      //     lastName: formData.lastName.trim(),
      //     email: formData.email.trim().toLowerCase(),
      //     password: formData.password
      //   }),
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   // Handle specific error responses
      //   switch (response.status) {
      //     case 400:
      //       if (data.field) {
      //         // Field-specific error
      //         setErrors(prev => ({
      //           ...prev,
      //           [data.field]: data.message
      //         }));
      //       } else {
      //         setGeneralError(data.message || 'Invalid request. Please check your input.');
      //       }
      //       break;
      //     case 409:
      //       setErrors(prev => ({
      //         ...prev,
      //         email: 'An account with this email already exists. Please use a different email or sign in.'
      //       }));
      //       break;
      //     case 422:
      //       setGeneralError('Please check your input and try again.');
      //       break;
      //     case 429:
      //       setGeneralError('Too many signup attempts. Please wait a few minutes and try again.');
      //       break;
      //     case 500:
      //       setGeneralError('Server error. Please try again later.');
      //       break;
      //     default:
      //       setGeneralError(data.message || 'Signup failed. Please try again.');
      //   }
      //   return;
      // }

      // Handle successful signup
      setSuccessMessage('Account created successfully! Redirecting to login...');
      
      // console.log('Account created successfully:', data);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Account created successfully! Please sign in with your credentials.' 
          }
        });
      }, 2000);

    } catch (error) {
      console.error('Signup error:', error);
      
      // // Handle network and other errors
      // if (error.name === 'TypeError' && error.message.includes('fetch')) {
      //   setGeneralError('Unable to connect to server. Please check your internet connection.');
      // } else if (error.name === 'AbortError') {
      //   setGeneralError('Request timed out. Please try again.');
      // } else {
      //   setGeneralError('An unexpected error occurred. Please try again.');
      // }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsSubmitting(true);
      setGeneralError("");

      // Your Google OAuth logic here
      console.log("Google OAuth clicked");

      // Simulate Google OAuth error handling
      // Replace with actual Google OAuth implementation
      throw new Error("Google OAuth not implemented yet");
    } catch (error) {
      console.error("Google OAuth error:", error);

      if (error.message.includes("popup_closed_by_user")) {
        setGeneralError("Google sign-up was cancelled.");
      } else if (error.message.includes("access_denied")) {
        setGeneralError("Google sign-up was denied. Please try again.");
      } else {
        setGeneralError(
          "Google sign-up failed. Please try again or use email/password."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="Logo size-12 flex justify-center mx-auto mb-6">
        <Logo />
      </div>
      <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
      <p className="text-center text-gray-600">
        Enter your personal data to create your account
      </p>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
          <CheckCircleIcon
            className="text-green-500 mt-0.5 mr-2 flex-shrink-0"
            fontSize="small"
          />
          <span className="text-sm text-green-700">{successMessage}</span>
        </div>
      )}

      {/* General Error Alert */}
      {generalError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
          <ErrorIcon
            className="text-red-500 mt-0.5 mr-2 flex-shrink-0"
            fontSize="small"
          />
          <span className="text-sm text-red-700">{generalError}</span>
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        type="button"
        className={`w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 mt-4 transition-colors ${
          isSubmitting
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        }`}
        onClick={handleGoogleAuth}
        disabled={isSubmitting}
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
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`block w-full h-12 px-3 rounded-md border shadow-sm focus:ring-1 sm:text-sm transition-colors ${
                errors.firstName
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              } ${isSubmitting ? "bg-gray-50 cursor-not-allowed" : ""}`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ErrorIcon className="mr-1" fontSize="small" />
                {errors.firstName}
              </p>
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
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`block w-full h-12 px-3 rounded-md border shadow-sm focus:ring-1 sm:text-sm transition-colors ${
                errors.lastName
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              } ${isSubmitting ? "bg-gray-50 cursor-not-allowed" : ""}`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ErrorIcon className="mr-1" fontSize="small" />
                {errors.lastName}
              </p>
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
            value={formData.email}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className={`block w-full h-12 px-3 rounded-md border shadow-sm focus:ring-1 sm:text-sm transition-colors ${
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            } ${isSubmitting ? "bg-gray-50 cursor-not-allowed" : ""}`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <ErrorIcon className="mr-1" fontSize="small" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative mt-1 rounded-md shadow-md">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`block w-full h-12 px-3 pr-10 rounded-md border shadow-sm focus:ring-1 sm:text-sm transition-colors ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                } ${isSubmitting ? "bg-gray-50 cursor-not-allowed" : ""}`}
                placeholder="Enter password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <VisibilityOffIcon
                    className="text-gray-400 hover:text-gray-500"
                    fontSize="small"
                  />
                ) : (
                  <VisibilityIcon
                    className="text-gray-400 hover:text-gray-500"
                    fontSize="small"
                  />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ErrorIcon className="mr-1" fontSize="small" />
                {errors.password}
              </p>
            )}

            {/* Password Strength Indicator */}
            {formData.password && !errors.password && (
              <div className="mt-2">
                <div className="flex space-x-1 mb-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded ${
                        level <= passwordStrength.score
                          ? passwordStrength.score <= 2
                            ? "bg-red-400"
                            : passwordStrength.score <= 3
                            ? "bg-yellow-400"
                            : "bg-green-400"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Strength:{" "}
                  {passwordStrength.score <= 2
                    ? "Weak"
                    : passwordStrength.score <= 3
                    ? "Medium"
                    : "Strong"}
                </p>
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="mt-1 relative rounded-md shadow-md">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`block w-full h-12 px-3 pr-10 rounded-md border shadow-sm focus:ring-1 sm:text-sm transition-colors ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                } ${isSubmitting ? "bg-gray-50 cursor-not-allowed" : ""}`}
                placeholder="Re-enter password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={toggleConfirmPasswordVisibility}
                disabled={isSubmitting}
              >
                {showConfirmPassword ? (
                  <VisibilityOffIcon
                    className="text-gray-400 hover:text-gray-500"
                    fontSize="small"
                  />
                ) : (
                  <VisibilityIcon
                    className="text-gray-400 hover:text-gray-500"
                    fontSize="small"
                  />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ErrorIcon className="mr-1" fontSize="small" />
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md shadow-sm font-medium mt-6 transition-colors ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating Account...
            </div>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?
          <button
            type="button"
            className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 bg-transparent border-none cursor-pointer disabled:opacity-50"
            onClick={() => navigate("/login")}
            disabled={isSubmitting}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;
