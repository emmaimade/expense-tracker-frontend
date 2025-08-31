import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import AlertMessage from "./ui/AlertMessage";
import FormInput from "./ui/FormInput";
import PasswordInput from "./ui/PasswordInput";
import GoogleAuthButton from "./ui/GoogleAuthButton";
import getPasswordStrength from "../utils/passwordUtils";

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
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


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
    // API call to register user
    const response = await fetch('https://expense-tracker-api-hvss.onrender.com/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific API errors
      if (response.status === 400) {
        if (data.message && data.message.toLowerCase().includes('email')) {
          setGeneralError('This email is already registered. Please use a different email.');
        } else if (data.errors) {
          // Handle field-specific validation errors from backend
          const backendErrors = {};
          if (Array.isArray(data.errors)) {
            data.errors.forEach(error => {
              backendErrors[error.field] = error.message;
            });
          }
          setErrors(prev => ({ ...prev, ...backendErrors }));
          return;
        } else {
          setGeneralError(data.message || 'Invalid input. Please check your details.');
        }
      } else if (response.status === 409) {
        setGeneralError('This email is already registered. Please use a different email.');
      } else if (response.status === 422) {
        setGeneralError('Invalid data format. Please check your input.');
      } else if (response.status >= 500) {
        setGeneralError('Server error. Please try again later.');
      } else {
        setGeneralError(data.message || 'Failed to create account. Please try again.');
      }
      return;
    }

    // Handle successful signup
    setSuccessMessage('Account created successfully! Redirecting to dashboard...');
    
    // Store authentication data
    if (data.token || data.accessToken) {
      localStorage.setItem('authToken', data.token || data.accessToken);
    }

    // Store user info if provided
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    // Redirect to dashboard after showing success message
    setTimeout(() => {
      navigate("/dashboard", {
        state: {
          message: `Welcome ${data.user?.firstName || 'to your dashboard'}!`,
        },
      });
    }, 2000);

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle different types of errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      setGeneralError('Network error. Please check your internet connection and try again.');
    } else if (error.name === 'AbortError') {
      setGeneralError('Request timeout. Please try again.');
    } else if (error.message.includes('JSON')) {
      setGeneralError('Server response error. Please try again later.');
    } else {
      setGeneralError('An unexpected error occurred. Please try again later.');
    }
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
      <AlertMessage
        type="success"
        message={successMessage}
      />
      {/* General Error Message */}
      <AlertMessage
        type="error"
        message={generalError}
      />

      {/* Google OAuth Button */}
      <GoogleAuthButton
        onClick={handleGoogleAuth}
        disabled={isSubmitting}
        className="mt-4"
      />

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
          <FormInput
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            error={errors.firstName}
            placeholder="John"
            disabled={isSubmitting}
          />
          <FormInput
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            error={errors.lastName}
            placeholder="Doe"
            disabled={isSubmitting}
          />
        </div>

        {/* Email Field */}
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          placeholder="email@example.com"
          disabled={isSubmitting}
        />

        {/* Password Fields */}
        <div className="grid grid-cols-2 gap-4">
          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            placeholder="Enter your password"
            disabled={isSubmitting}
            showStrength={true}
          />
          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            placeholder="Confirm your password"
            disabled={isSubmitting}
          />
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
