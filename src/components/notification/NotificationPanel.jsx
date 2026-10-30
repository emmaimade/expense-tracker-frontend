import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AlertTriangle, Bell, CalendarDays, Check, CheckCheck, X } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const STYLES = {
  high: { icon: 'text-red-600 dark:text-red-400', iconBg: 'bg-red-100 dark:bg-red-900/30' },
  medium: { icon: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-900/30' },
  low: { icon: 'text-indigo-600 dark:text-indigo-400', iconBg: 'bg-indigo-100 dark:bg-indigo-900/30' },
};

const TypeIcon = ({ type }) =>
  type === 'monthly_reset'
    ? <CalendarDays className="w-5 h-5" aria-hidden="true" />
    : <AlertTriangle className="w-5 h-5" aria-hidden="true" />;

const formatTimestamp = (timestamp) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const NotificationPanel = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const {
    notifications,
    unreadCount,
    isLoading,
    isError,
    refresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  // Escape closes; focus moves into the panel and back to the bell afterwards
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement;
    panelRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const openNotification = (notification) => {
    if (!notification.read) markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  const handleClearAll = async () => {
    const undo = await clearAll();
    toast.info(
      ({ closeToast }) => (
        <div className="flex items-center justify-between gap-3">
          <span>Notifications cleared</span>
          <button
            type="button"
            onClick={() => { undo(); closeToast(); }}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Undo
          </button>
        </div>
      ),
      { autoClose: 5000, closeOnClick: false }
    );
  };

  return (
    <>
      {/* Mobile-only dim scrim */}
      <div className="fixed inset-0 top-16 bg-black/30 z-40 sm:hidden" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-label="Notifications"
        tabIndex={-1}
        className="fixed top-16 left-0 right-0 sm:absolute sm:top-12 sm:left-auto sm:right-0 sm:w-96 max-h-[80vh] bg-white dark:bg-gray-800 sm:rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden flex flex-col focus:outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="inline-flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
              >
                <CheckCheck className="w-4 h-4" aria-hidden="true" />
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
              className="p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">Loading notifications…</div>
          ) : isError && notifications.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Couldn&apos;t load notifications.</p>
              <button
                type="button"
                onClick={() => refresh()}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-gray-400" aria-hidden="true" />
              </div>
              <p className="font-medium text-gray-900 dark:text-gray-100">No notifications</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                You&apos;ll get an alert here when spending reaches 80% of a budget.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {notifications.map((notification) => {
                const style = STYLES[notification.priority] || STYLES.low;
                return (
                  <li
                    key={notification.id}
                    className={`flex items-start gap-1 pr-2 ${notification.read ? '' : 'bg-indigo-50/60 dark:bg-indigo-900/10'}`}
                  >
                    <button
                      type="button"
                      onClick={() => openNotification(notification)}
                      className="flex-1 min-w-0 flex gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
                    >
                      <span className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${style.iconBg} ${style.icon}`}>
                        <TypeIcon type={notification.type} />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{notification.title}</span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0">
                              <span className="sr-only">Unread</span>
                            </span>
                          )}
                        </span>
                        <span className="block text-sm text-gray-600 dark:text-gray-300 mt-0.5">{notification.message}</span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">{formatTimestamp(notification.createdAt)}</span>
                      </span>
                    </button>

                    {/* Always visible, so they work on touch screens too */}
                    <div className="flex flex-col gap-1 pt-3">
                      {!notification.read && (
                        <button
                          type="button"
                          onClick={() => markAsRead(notification.id)}
                          aria-label={`Mark "${notification.title}" as read`}
                          title="Mark as read"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
                        >
                          <Check className="w-4 h-4" aria-hidden="true" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteNotification(notification.id)}
                        aria-label={`Delete "${notification.title}"`}
                        title="Delete"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer: the destructive action sits apart from "Mark all read" */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-right">
            <button
              type="button"
              onClick={handleClearAll}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;
