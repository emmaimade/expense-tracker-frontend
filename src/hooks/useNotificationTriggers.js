import { useEffect, useRef } from 'react';
import { useNotifications } from '../context/NotificationContext';

/**
 * Hook to automatically trigger notifications based on budget and transaction data
 * Use this in your dashboard components to create real-time alerts
 */
export const useNotificationTriggers = ({ budgets, transactions, userId }) => {
  const { addNotification } = useNotifications();
  const previousBudgets = useRef({});
  const notifiedTransactions = useRef(new Set());

  useEffect(() => {
    if (!budgets || !userId) return;

    budgets.forEach(budget => {
      const previous = previousBudgets.current[budget.id];
      const currentPercentage = (budget.spent / budget.limit) * 100;

      // Check for budget threshold alerts (80%, 90%, 100%, 120%)
      if (previous) {
        const previousPercentage = (previous.spent / previous.limit) * 100;

        // 80% threshold
        if (previousPercentage < 80 && currentPercentage >= 80) {
          addNotification({
            type: 'budget_alert',
            priority: 'medium',
            title: 'Budget Warning',
            message: `You've used ${Math.round(currentPercentage)}% of your ${budget.category} budget`,
            actionUrl: '/dashboard/budgets'
          });
        }

        // 90% threshold
        if (previousPercentage < 90 && currentPercentage >= 90) {
          addNotification({
            type: 'budget_alert',
            priority: 'high',
            title: 'Budget Alert',
            message: `You've used ${Math.round(currentPercentage)}% of your ${budget.category} budget`,
            actionUrl: '/dashboard/budgets'
          });
        }

        // 100% threshold (exceeded)
        if (previousPercentage < 100 && currentPercentage >= 100) {
          addNotification({
            type: 'budget_alert',
            priority: 'high',
            title: 'Budget Exceeded!',
            message: `You've exceeded your ${budget.category} budget by $${(budget.spent - budget.limit).toFixed(2)}`,
            actionUrl: '/dashboard/budgets'
          });
        }

        // 120% threshold (significantly exceeded)
        if (previousPercentage < 120 && currentPercentage >= 120) {
          addNotification({
            type: 'budget_alert',
            priority: 'high',
            title: 'Budget Significantly Exceeded',
            message: `Your ${budget.category} spending is ${Math.round(currentPercentage)}% of budget`,
            actionUrl: '/dashboard/budgets'
          });
        }
      }

      // Update previous state
      previousBudgets.current[budget.id] = {
        spent: budget.spent,
        limit: budget.limit
      };
    });
  }, [budgets, userId, addNotification]);

  // Monitor for unusual transactions
  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    // Get the most recent transaction
    const latestTransaction = transactions[0];
    const transactionKey = `${latestTransaction.id || latestTransaction._id}-${latestTransaction.date}`;
    
    // Only check if we haven't notified about this transaction yet
    if (notifiedTransactions.current.has(transactionKey)) return;
    
    // Calculate average transaction amount for the category
    const categoryTransactions = transactions.filter(
      t => t.category === latestTransaction.category && 
           (t.id || t._id) !== (latestTransaction.id || latestTransaction._id)
    );

    if (categoryTransactions.length >= 3) {
      const avgAmount = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / categoryTransactions.length;
      const currentAmount = Math.abs(latestTransaction.amount);

      // If transaction is 2x or more than average, it's unusual
      if (currentAmount >= avgAmount * 2 && currentAmount > 100) {
        addNotification({
          type: 'unusual_spending',
          priority: 'medium',
          title: 'Unusual Transaction Detected',
          message: `$${currentAmount.toFixed(2)} at ${latestTransaction.description} - ${Math.round(currentAmount / avgAmount)}x your average`,
          actionUrl: '/dashboard/analytics'
        });
        
        // Mark as notified
        notifiedTransactions.current.add(transactionKey);
      }
    }
  }, [transactions, addNotification]);

  return null;
};

/**
 * Hook to check for upcoming bills and create reminders
 * Call this with your recurring transactions or bills data
 */
export const useBillReminders = ({ bills, userId }) => {
  const { addNotification } = useNotifications();
  const notifiedBills = useRef(new Set());

  useEffect(() => {
    if (!bills || !userId) return;

    const now = new Date();
    
    bills.forEach(bill => {
      const dueDate = new Date(bill.dueDate);
      const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      const billKey = `${bill.id}-${daysUntilDue}`;

      // Only notify once per threshold
      if (notifiedBills.current.has(billKey)) return;

      // Remind at 7 days, 3 days, and 1 day before due
      if (daysUntilDue === 7 || daysUntilDue === 3 || daysUntilDue === 1) {
        addNotification({
          type: 'bill_reminder',
          priority: daysUntilDue <= 1 ? 'high' : 'medium',
          title: 'Bill Due Soon',
          message: `${bill.name} payment of $${bill.amount} due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`,
          actionUrl: '/dashboard/expenses'
        });
        
        notifiedBills.current.add(billKey);
      }
    });
  }, [bills, userId, addNotification]);

  return null;
};

/**
 * Hook to create achievement/milestone notifications
 */
export const useAchievementNotifications = ({ achievements, userId }) => {
  const { addNotification } = useNotifications();
  const notifiedAchievements = useRef(new Set());

  useEffect(() => {
    if (!achievements || !userId) return;

    achievements.forEach(achievement => {
      if (!notifiedAchievements.current.has(achievement.id) && achievement.unlocked) {
        addNotification({
          type: 'achievement',
          priority: 'low',
          title: achievement.title,
          message: achievement.message,
          actionUrl: '/dashboard'
        });
        notifiedAchievements.current.add(achievement.id);
      }
    });
  }, [achievements, userId, addNotification]);

  return null;
};