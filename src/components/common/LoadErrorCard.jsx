import { AlertCircle, RefreshCw } from 'lucide-react';
import Card from './Card';

// Shown when a page's data couldn't be loaded, instead of an empty state that would
// look like the data is gone
const LoadErrorCard = ({ title = "Couldn't load this page", message, onRetry }) => (
  <Card className="py-12 text-center">
    <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
      <AlertCircle className="h-6 w-6" />
    </span>
    <h2 role="alert" className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
    {message && <p className="mx-auto mt-1 max-w-md text-sm text-gray-600 dark:text-gray-400">{message}</p>}
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    )}
  </Card>
);

export default LoadErrorCard;
