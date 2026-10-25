import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { apiService } from '../../../services/apiService';
import { userService } from '../../../services/userService';

/**
 * Permanently deletes the account. Password accounts confirm with their
 * password; Google-only accounts (no password) type DELETE.
 */
const DeleteAccountModal = ({ isOpen, onClose, hasPassword, email, userId }) => {
  const [value, setValue] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setValue('');
    setError('');
    inputRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !deleting) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when opened
  }, [isOpen]);

  if (!isOpen) return null;

  const canSubmit = hasPassword ? value.length > 0 : value === 'DELETE';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || deleting) return;

    setDeleting(true);
    setError('');
    try {
      await apiService.delete('/user/me', hasPassword ? { password: value } : { confirmation: 'DELETE' });
      // The account is gone: wipe this browser's copy and leave the app
      userService.clearAllUserData(userId);
      window.location.href = '/login?deleted=1';
    } catch (err) {
      setError(err.message || 'Could not delete your account. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 dark:bg-gray-900/50"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !deleting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 dark:bg-gray-800"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center dark:bg-red-900/40">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <h2 id="delete-account-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Delete account
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg p-2 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          This permanently deletes <strong>{email}</strong> and everything in it:
        </p>
        <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-1 mb-4">
          <li>all of your expenses</li>
          <li>your budgets and custom categories</li>
          <li>your profile and settings</li>
        </ul>
        <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-4">
          This can't be undone. Export your expenses first if you want a copy.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="delete-confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {hasPassword ? 'Enter your password to confirm' : <>Type <strong>DELETE</strong> to confirm</>}
            </label>
            <input
              ref={inputRef}
              id="delete-confirm"
              type={hasPassword ? 'password' : 'text'}
              autoComplete={hasPassword ? 'current-password' : 'off'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={deleting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || deleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-500 dark:hover:bg-red-600"
            >
              {deleting ? 'Deleting...' : 'Delete my account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
