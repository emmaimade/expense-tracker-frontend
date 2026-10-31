import { useState } from "react";
import { Eye, EyeOff, Lock } from 'lucide-react';
import { FieldError, FieldLabel } from "./FormInput";
import { inputClasses } from "./inputClasses";
import { PasswordChecklist } from "./PasswordChecklist";

export const PasswordInput = ({
  label,
  name,
  error,
  disabled = false,
  showChecklist = false,
  className = "",
  register,
  labelAction,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [localValue, setLocalValue] = useState('');

  const describedBy = [error && `${name}-error`, showChecklist && `${name}-rules`].filter(Boolean).join(' ') || undefined;

  return (
    <div className={className}>
      <FieldLabel name={name} label={label} labelAction={labelAction} />
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          type={showPassword ? "text" : "password"}
          id={name}
          {...(register ? register(name) : {})}
          onInput={(e) => setLocalValue(e.target.value)}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`${inputClasses(error, true)} pr-10`}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:text-gray-200"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      <FieldError name={name} error={error} />
      {showChecklist && <PasswordChecklist id={`${name}-rules`} password={localValue} />}
    </div>
  );
};

export default PasswordInput;
