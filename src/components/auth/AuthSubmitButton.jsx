import { Loader2 } from 'lucide-react';

const AuthSubmitButton = ({ loading, loadingText, children, disabled }) => (
  <button
    type="submit"
    disabled={loading || disabled}
    aria-busy={loading}
    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus-visible:ring-offset-gray-900"
  >
    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
    {loading ? loadingText : children}
  </button>
);

export default AuthSubmitButton;
