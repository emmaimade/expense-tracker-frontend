import { CircleAlert } from 'lucide-react';
import { inputClasses } from './inputClasses';

export const FieldError = ({ name, error }) =>
  error ? (
    <p id={`${name}-error`} className="mt-1.5 text-sm text-red-600 flex items-center gap-1 dark:text-red-400" role="alert">
      <CircleAlert className="w-4 h-4 shrink-0" />
      {error}
    </p>
  ) : null;

export const FieldLabel = ({ name, label, labelAction }) => (
  <div className="mb-1.5 flex items-center justify-between gap-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    {labelAction}
  </div>
);

export const FormInput = ({
  label,
  name,
  type = "text",
  error,
  disabled = false,
  className = "",
  register,
  icon,
  labelAction,
  ...props
}) => {
  const Icon = icon;
  return (
    <div className={className}>
      <FieldLabel name={name} label={label} labelAction={labelAction} />
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        )}
        <input
          type={type}
          id={name}
          {...(register ? register(name) : {})}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={inputClasses(error, !!Icon)}
          {...props}
        />
      </div>
      <FieldError name={name} error={error} />
    </div>
  );
};

export default FormInput;
