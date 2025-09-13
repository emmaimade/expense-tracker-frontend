import ErrorIcon from "@mui/icons-material/Error";

export const FormInput = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  error, 
  placeholder, 
  disabled = false,
  className = "",
  ...props 
}) => {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`block w-full h-12 px-3 rounded-md border shadow-sm focus:ring-1 sm:text-sm transition-colors ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        } ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}`}
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <ErrorIcon className="mr-1" fontSize="small" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;