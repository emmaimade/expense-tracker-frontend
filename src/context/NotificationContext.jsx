import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children, userId }) => {
  const [notifications, setNotifications] = useState([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (userId) {
      const savedNotifications = localStorage.getItem(`notifications_${userId}`);
      
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications);
          // Convert timestamp strings back to Date objects
          const restored = parsed.map(notif => ({
            ...notif,
            timestamp: new Date(notif.timestamp)
          }));
          setNotifications(restored);
        } catch (error) {
          console.error('Error loading notifications:', error);
          // If there's an error, initialize with sample notifications
          initializeSampleNotifications();
        }
      } else {
        // First time user - show sample notifications
        initializeSampleNotifications();
      }
    }
  }, [userId]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (userId && notifications.length >= 0) {
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
    }
  }, [notifications, userId]);

  const initializeSampleNotifications = () => {
    const sampleNotifications = [
      {
        id: '1',
        type: 'budget_alert',
        priority: 'high',
        title: 'Budget Alert',
        message: "You've used 90% of your Groceries budget for January",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        actionUrl: '/dashboard/budgets'
      },
      {
        id: '2',
        type: 'bill_reminder',
        priority: 'high',
        title: 'Bill Due Soon',
        message: 'Netflix subscription payment due in 2 days',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        read: false,
        actionUrl: '/dashboard/expenses'
      },
      {
        id: '3',
        type: 'unusual_spending',
        priority: 'medium',
        title: 'Unusual Transaction',
        message: '$450 transaction at Electronics Store - 3x your average',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        read: false,
        actionUrl: '/dashboard/analytics'
      },
      {
        id: '4',
        type: 'summary',
        priority: 'low',
        title: 'Monthly Summary Ready',
        message: 'Your January spending report is now available',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        read: true,
        actionUrl: '/dashboard/analytics'
      },
      {
        id: '5',
        type: 'achievement',
        priority: 'low',
        title: 'Savings Milestone',
        message: 'Congratulations! You stayed under budget for 3 months straight',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
        actionUrl: '/dashboard'
      }
    ];
    
    setNotifications(sampleNotifications);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
      priority: 'medium',
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Optional: Limit to 50 most recent notifications to prevent storage bloat
    setNotifications(prev => prev.slice(0, 50));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Notification helpers ───────────────────────────────────
  const notifyMonthlyReset = () => {
    addNotification({
      type: 'summary',
      priority: 'low',
      title: 'Budgets Reset',
      message: "A new month has started. Your budgets have been reset and are ready to track.",
      actionUrl: '/dashboard/budgets',
    });
  };

  const notifyProfileUpdated = () => {
    addNotification({
      type: 'achievement',
      priority: 'low',
      title: 'Profile Updated',
      message: 'Your profile information has been updated successfully.',
      actionUrl: '/dashboard/settings',
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        addNotification,
        notifyMonthlyReset,
        notifyProfileUpdated,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};