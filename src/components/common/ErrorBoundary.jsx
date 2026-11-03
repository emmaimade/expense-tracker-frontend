import { Component } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { isChunkLoadError, reloadOnce } from '../../utils/reloadOnce';

/**
 * Catches rendering errors so a crash shows a way out instead of a blank screen.
 * - fullPage: the app-level fallback (no providers needed, plain styles).
 * - resetKey: when it changes (e.g. the route), the boundary clears and tries again.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // A page that failed to load after a deploy: reload once to get the new build
    if (isChunkLoadError(error) && reloadOnce()) return;
    console.error('Unhandled UI error:', error, info?.componentStack);
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    const { fullPage } = this.props;
    return (
      <div
        role="alert"
        className={`flex flex-col items-center justify-center px-6 text-center ${
          fullPage ? 'min-h-screen bg-gray-50 dark:bg-gray-900' : 'py-16'
        }`}
      >
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-6 w-6" />
        </span>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Something went wrong</h1>
        <p className="mt-1 max-w-sm text-sm text-gray-600 dark:text-gray-400">
          This part of SpendWise couldn&apos;t be shown. Reloading usually fixes it, and your data is safe.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <RefreshCw className="h-4 w-4" />
          Reload
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
