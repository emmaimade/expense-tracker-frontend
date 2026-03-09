import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Trophy,
  X,
  Check,
  CheckCheck,
  Trash2
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationPanel = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  } = useNotifications();

  const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'budget_alert':
        return <AlertTriangle className={iconClass} />;
      case 'bill_reminder':
        return <Calendar className={iconClass} />;
      case 'unusual_spending':
        return <TrendingUp className={iconClass} />;
      case 'summary':
        return <FileText className={iconClass} />;
      case 'achievement':
        return <Trophy className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') {
      return {
        bg: 'bg-red-50 dark:bg-red-900/10',
        border: 'border-red-200 dark:border-red-800/30',
        icon: 'text-red-600 dark:text-red-400',
        iconBg: 'bg-red-100 dark:bg-red-900/20'
      };
    }
    
    switch (type) {
      case 'budget_alert':
      case 'unusual_spending':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/10',
          border: 'border-orange-200 dark:border-orange-800/30',
          icon: 'text-orange-600 dark:text-orange-400',
          iconBg: 'bg-orange-100 dark:bg-orange-900/20'
        };
      case 'bill_reminder':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/10',
          border: 'border-blue-200 dark:border-blue-800/30',
          icon: 'text-blue-600 dark:text-blue-400',
          iconBg: 'bg-blue-100 dark:bg-blue-900/20'
        };
      case 'achievement':
        return {
          bg: 'bg-green-50 dark:bg-green-900/10',
          border: 'border-green-200 dark:border-green-800/30',
          icon: 'text-green-600 dark:text-green-400',
          iconBg: 'bg-green-100 dark:bg-green-900/20'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800/50',
          border: 'border-gray-200 dark:border-gray-700',
          icon: 'text-gray-600 dark:text-gray-400',
          iconBg: 'bg-gray-100 dark:bg-gray-800'
        };
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
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

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-16 right-4 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in slide-in-from-top-4 fade-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Notifications</h2>
                <p className="text-xs text-blue-100">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No notifications
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We'll notify you when something important happens
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {notifications.map((notification, index) => {
                const colors = getNotificationColor(notification.type, notification.priority);
                return (
                  <div
                    key={notification.id}
                    className={`group relative transition-all duration-200 ${
                      !notification.read 
                        ? 'bg-blue-50/50 dark:bg-blue-900/5' 
                        : 'bg-white dark:bg-gray-800'
                    } hover:bg-gray-50 dark:hover:bg-gray-750 animate-in fade-in slide-in-from-right-2`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={`p-4 cursor-pointer ${notification.actionUrl ? 'pr-20' : 'pr-12'}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center ${colors.icon}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1.5" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                navigate('/dashboard/settings');
                onClose();
              }}
              className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
            >
              Notification Settings
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;
