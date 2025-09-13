import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ErrorIcon from '@mui/icons-material/Error';
import Logo from '../common/Logo';
import GoogleAuthButton from '../auth/GoogleAuthButton';
function Login () {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
      let isValid = true;
      const newErrors = {};

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
        isValid = false;
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
        isValid = false;
      }

      setErrors(newErrors);
      return isValid;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsLoading(true);
      setErrors({}); // Clear previous errors

      try {
        // API call to login user
        const response = await fetch(
          "https://expense-tracker-api-hvss.onrender.com/user/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: formData.email.trim().toLowerCase(),
              password: formData.password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          // Handle specific API errors
          if (response.status === 401) {
            setErrors({
              email: "Invalid email or password",
              password: "Invalid email or password",
            });
          } else if (response.status === 400) {
            if (data.errors) {
              // Handle field-specific validation errors
              const backendErrors = {};
              if (Array.isArray(data.errors)) {
                data.errors.forEach((error) => {
                  backendErrors[error.field] = error.message;
                });
              }
              setErrors(backendErrors);
            } else {
              setErrors({ email: data.message || "Invalid credentials" });
            }
          } else if (response.status === 404) {
            setErrors({ email: "No account found with this email address" });
          } else if (response.status === 429) {
            setErrors({
              email: "Too many login attempts. Please try again later.",
            });
          } else if (response.status >= 500) {
            setErrors({ email: "Server error. Please try again later." });
          } else {
            setErrors({
              email: data.message || "Login failed. Please try again.",
            });
          }
          return;
        }

        // Handle successful login
        console.log("Login successful:", data);

        // Store authentication data
        if (data.token || data.accessToken) {
          const token = data.token || data.accessToken;
          localStorage.setItem("authToken", token);

          // If remember me is checked, set a longer expiration
          if (formData.rememberMe) {
            localStorage.setItem("rememberMe", "true");
          }
        }

        // Store user info if provided
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // Redirect to dashboard
        navigate("/dashboard", {
          state: {
            message: `Welcome back${
              data.user?.firstName ? `, ${data.user.firstName}` : ""
            }!`,
          },
        });
      } catch (error) {
        console.error("Login error:", error);

        // Handle different types of errors
        if (error.name === "TypeError" && error.message.includes("fetch")) {
          setErrors({
            email: "Network error. Please check your connection and try again.",
          });
        } else if (error.name === "AbortError") {
          setErrors({ email: "Request timeout. Please try again." });
        } else if (error.message.includes("JSON")) {
          setErrors({
            email: "Server response error. Please try again later.",
          });
        } else {
          setErrors({
            email: "An unexpected error occurred. Please try again.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    const handleGoogleLogin = () => {
        // Handle Google OAuth login here
        console.log("Google OAuth clicked");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    }

    return (
      <div className="Login justify-center border-2 border-gray-300 rounded-lg p-6 max-w-md mx-auto mt-10 bg-white shadow-md">
        <div className="Logo size-12 flex justify-center mx-auto mb-6">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">Welcome Back!</h1>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EmailIcon className="text-gray-400" fontSize="small" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                disabled={isLoading}
                className={`block w-full pl-10 h-12 rounded-md border shadow-sm focus:ring-indigo-500 sm:text-sm ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-indigo-500"
                } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <span className="mt-1 text-sm text-red-600">
                  <ErrorIcon className="inline mr-1" fontSize="small" />
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="text-gray-400" fontSize="small" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                disabled={isLoading}
                className={`block w-full pl-10 h-12 rounded-md border shadow-sm focus:ring-indigo-500 sm:text-sm ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-indigo-500"
                } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
                placeholder="password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? (
                  <VisibilityOffIcon
                    className="text-gray-400"
                    fontSize="small"
                  />
                ) : (
                  <VisibilityIcon className="text-gray-400" fontSize="small" />
                )}
              </button>
              {errors.password && (
                <span className="mt-1 text-sm text-red-600">
                  {errors.password}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                onChange={handleChange}
                checked={formData.rememberMe}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isLoading) {
                    navigate("/forgot-password");
                  }
                }}
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-2 px-4 rounded-md shadow-sm ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
            }`}
          >
            {isLoading ? (
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
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Google OAuth Button */}
        <div className="mt-6">
          <GoogleAuthButton onClick={handleGoogleLogin} />
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?
            <button
              type="button"
              className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 bg-transparent border-none cursor-pointer"
              onClick={() => navigate('/register')}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    );
}

export default Login