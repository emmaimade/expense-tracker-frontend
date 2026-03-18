import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';

/**
 * useMonthlyResetNotification
 * Drop into DashboardContent. Fires once when the calendar month
 * changes since the user's last visit.
 */
const useMonthlyResetNotification = () => {
  const { notifyMonthlyReset } = useNotifications();

  useEffect(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    const storageKey = 'spendwise_last_seen_month';
    const lastSeenMonth = localStorage.getItem(storageKey);

    if (lastSeenMonth && lastSeenMonth !== currentMonth) {
      notifyMonthlyReset();
    }

    localStorage.setItem(storageKey, currentMonth);
  }, []); // runs once on mount
};

export default useMonthlyResetNotification;