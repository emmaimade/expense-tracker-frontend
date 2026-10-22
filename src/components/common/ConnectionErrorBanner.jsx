import { useState } from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';

/**
 * Shown when data fails to load, so a server outage isn't mistaken for
 * "you have no expenses".
 */
const ConnectionErrorBanner = ({ onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div
      role="alert"
      className="mb-4 sm:mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
    >
      <div className="flex items-start gap-3 flex-1">
        <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full text-red-600 dark:text-red-200 flex-shrink-0">
          <WifiOff className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-red-800 dark:text-red-200 font-medium">Couldn't load your data</p>
          <p className="text-red-600 dark:text-red-300 text-sm">
            The server may be waking up or your connection dropped. Your expenses are safe — try again in a moment.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleRetry}
        disabled={isRetrying}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-60 transition-colors"
      >
        <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} aria-hidden="true" />
        {isRetrying ? 'Retrying...' : 'Retry'}
      </button>
    </div>
  );
};

export default ConnectionErrorBanner;
