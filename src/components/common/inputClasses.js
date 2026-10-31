// Shared input styles for the auth forms, so every field looks the same in light and dark mode
export const inputClasses = (error, hasIcon = false) =>
  `block w-full h-11 ${hasIcon ? 'pl-10' : 'pl-3'} pr-3 rounded-lg border bg-white text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:disabled:bg-gray-900 ${
    error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/30 dark:border-gray-600'
  }`;

export default inputClasses;
