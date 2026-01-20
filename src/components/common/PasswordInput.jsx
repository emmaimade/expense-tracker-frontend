import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ErrorIcon from "@mui/icons-material/Error";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

export const PasswordInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  placeholder, 
  disabled = false,
  showStrength = false,
  className = "",
  register,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [localValue, setLocalValue] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-md">
        <input
          type={showPassword ? "text" : "password"}
          id={name}
          {...(register ? register(name) : {})}
          name={name}
          value={value}
          onChange={onChange}
          onInput={(e) => setLocalValue(e.target.value)}
          disabled={disabled}
          className={`block w-full h-12 px-3 pr-10 rounded-md border shadow-sm focus:ring-1 sm:text-sm transition-colors ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          } ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}`}
          placeholder={placeholder}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={togglePasswordVisibility}
          disabled={disabled}
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
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600 flex items-center" role="alert" aria-live="assertive">
          <ErrorIcon className="mr-1" fontSize="small" />
          {error}
        </p>
      )}
      {showStrength && !error && <PasswordStrengthIndicator password={localValue || value} />}
    </div>
  );
};

export default PasswordInput;