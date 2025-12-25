import { useState, useEffect, useMemo } from 'react';
import { expenseService } from '../../../services/expenseService';
import { budgetService } from '../../../services/budgetService';
import { usePreferencesContext } from '../../../context/PreferencesContext';

/**
 * Unified dashboard data hook - fetches all data once and shares it
 */
export const useDashboardData = () => {
  const { formatCurrency } = usePreferencesContext();
  const [data, setData] = useState({
    // Budget data
    budgetLimit: 0,
    totalSpent: 0,
    totalRemaining: 0,
    percentageUsed: 0,
    isOverBudget: false,
    
    // Transaction data
    currentMonthTransactions: [],
    prevMonthTransactions: [],
    
    // Stats
    stats: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Calculate previous month date range
        const previousMonthDates = getPreviousMonthDateRange();

        // ✅ Fetch all data in ONE parallel call
        const [
          currentMonthTransactions,
          prevMonthTransactions,
          totalBudgetData,
          budgetOverviewData,
        ] = await Promise.all([
          expenseService.getTransactionsByDateRange("monthly"),
          expenseService.getTransactionsByDateRange("custom", {
            startDate: previousMonthDates.startDate,
            endDate: previousMonthDates.endDate,
          }),
          budgetService.getTotalMonthlyBudget(),
          budgetService.getBudgetOverview(),
        ]);

        // Extract budget information
        const budgetLimit = totalBudgetData?.data?.totalBudget || 0;
        const totalSpent = budgetOverviewData?.data?.totalSpent || 0;
        const totalRemaining = budgetOverviewData?.data?.totalRemaining || 0;
        const percentageUsed = budgetOverviewData?.data?.summary?.percentageUsed || 0;
        const isOverBudget = budgetOverviewData?.data?.summary?.isOverBudget || false;

        // Calculate stats
        const stats = calculateFinancialStats(
          currentMonthTransactions,
          prevMonthTransactions,
          budgetLimit,
          formatCurrency
        );

        // Update state with all data
        setData({
          budgetLimit: parseFloat(budgetLimit),
          totalSpent: parseFloat(totalSpent),
          totalRemaining: parseFloat(totalRemaining),
          percentageUsed: parseFloat(percentageUsed),
          isOverBudget,
          currentMonthTransactions,
          prevMonthTransactions,
          stats,
        });

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.message || "Could not retrieve dashboard data.");
        setData({
          budgetLimit: 0,
          totalSpent: 0,
          totalRemaining: 0,
          percentageUsed: 0,
          isOverBudget: false,
          currentMonthTransactions: [],
          prevMonthTransactions: [],
          stats: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDashboardData();
  }, []);

  // Memoize formatted data for stable references
  const formattedData = useMemo(
    () => ({
      // Budget overview data
      budget: {
        totalSpentThisMonth: data.totalSpent.toFixed(2),
        budgetLimit: data.budgetLimit,
        totalRemaining: data.totalRemaining.toFixed(2),
        percentageUsed: data.percentageUsed,
        isOverBudget: data.isOverBudget,
      },
      
      // Financial stats
      stats: data.stats,
      
      // Raw transaction data (if needed elsewhere)
      transactions: {
        current: data.currentMonthTransactions,
        previous: data.prevMonthTransactions,
      },
      
      // Loading and error states
      isLoading,
      error,
    }),
    [data, isLoading, error]
  );

  return formattedData;
};

// ============================================
// Helper Functions
// ============================================

/**
 * Calculate previous month date range
 */
const getPreviousMonthDateRange = () => {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const startOfPreviousMonth = new Date(startOfCurrentMonth);
  startOfPreviousMonth.setDate(startOfCurrentMonth.getDate() - 1);
  startOfPreviousMonth.setDate(1);

  const endOfPreviousMonth = new Date(startOfCurrentMonth);
  endOfPreviousMonth.setDate(endOfPreviousMonth.getDate() - 1);

  const toISODateString = (date) => date.toISOString().split('T')[0];

  return {
    startDate: toISODateString(startOfPreviousMonth),
    endDate: toISODateString(endOfPreviousMonth),
  };
};

/**
 * Calculate financial statistics from transactions
 */
const calculateFinancialStats = (
  currentMonthTransactions,
  prevMonthTransactions,
  budgetLimit,
  formatCurrency
) => {
  const currentMonthExpenses = currentMonthTransactions.filter(tx => tx.type === 'expense');
  const prevMonthExpenses = prevMonthTransactions.filter(tx => tx.type === 'expense');

  const currentMonthSpending = currentMonthExpenses.reduce((acc, tx) => acc + tx.amount, 0);
  const prevMonthSpending = prevMonthExpenses.reduce((acc, tx) => acc + tx.amount, 0);
  const budgetUtilization = budgetLimit > 0 ? currentMonthSpending / budgetLimit : 0;

  // Top Spending Category
  const categoryMap = currentMonthExpenses.reduce((acc, tx) => {
    acc[tx.category.name] = (acc[tx.category.name] || 0) + tx.amount;
    return acc;
  }, {});
  
  const topCategory = Object.entries(categoryMap).reduce(
    (max, [category, amount]) => (amount > max.amount ? { category, amount } : max),
    { category: 'Uncategorized', amount: 0 }
  );
  
  const topCategoryPercentage = currentMonthSpending > 0 ? topCategory.amount / currentMonthSpending : 0;
  const topCategoryDisplay = topCategory.category === 'Uncategorized' ? 'No Expenses Yet' : topCategory.category;

  // Month-over-Month Change
  let momChange = 0;
  let momChangeDirection = 'flat';
  if (prevMonthSpending > 0) {
    momChange = ((currentMonthSpending - prevMonthSpending) / prevMonthSpending) * 100;
    momChangeDirection = momChange > 0 ? 'up' : momChange < 0 ? 'down' : 'flat';
  }

  // Daily Burn Rate
  const currentDay = new Date().getDate();
  const dailyBurnRate = currentDay > 0 ? currentMonthSpending / currentDay : 0;

  // Financial Health Score
  const healthScore = calculateHealthScore(currentMonthSpending, prevMonthSpending, budgetLimit);

    return [
    {
      name: 'Total Monthly Expenses',
      value: formatCurrency(currentMonthSpending),
      change: `Utilized ${(budgetUtilization * 100).toFixed(1)}% of budget`,
      icon: '💸',
      style: budgetUtilization > 1 ? 'danger' : 'success',
      secondaryValue: `${formatCurrency(budgetLimit)} Budget Limit`
    },
    {
      name: 'Top Spending Category',
      value: topCategoryDisplay,
      change: `${(topCategoryPercentage * 100).toFixed(0)}% of Total`,
      icon: '🏷️',
      style: 'info',
      secondaryValue: formatCurrency(topCategory.amount)
    },
    {
      name: 'Spending Month-over-Month Change',
      value: `${Math.abs(momChange).toFixed(1)}%`,
      change: momChangeDirection === 'up'
        ? `Increase vs. last month`
        : momChangeDirection === 'down'
        ? `Decrease vs. last month`
        : `No significant change`,
      icon: momChangeDirection === 'up' ? '📈' : momChangeDirection === 'down' ? '📉' : '↔️',
      style: momChangeDirection === 'up' ? 'danger' : 'success',
      secondaryValue: momChangeDirection === 'up' ? `Spent ${formatCurrency(currentMonthSpending - prevMonthSpending)} more` : ''
    },
    {
      name: 'Daily Burn Rate',
      value: formatCurrency(dailyBurnRate),
      change: `Avg daily spend (Day ${currentDay})`,
      icon: '⏳',
      style: 'warning',
      secondaryValue: `${formatCurrency(currentMonthSpending)} Total Spent`
    },
    {
      name: 'Financial Health Score',
      value: `${healthScore.overall}`,
      change: `Compliance: ${healthScore.compliance.toFixed(0)}%, Stability: ${healthScore.stability.toFixed(0)}%`,
      icon: '❤️',
      style: healthScore.overall > 75 ? 'success' : healthScore.overall > 50 ? 'warning' : 'danger',
      secondaryValue: `Based on spending relative to Budget & Previous Month`
    },
  ];
};

/**
 * Calculate health score
 */
const calculateHealthScore = (currentMonthSpending, prevMonthSpending, budgetLimit) => {
  if (currentMonthSpending === 0 && prevMonthSpending === 0 && budgetLimit === 0) {
    return { overall: 0, compliance: 0, stability: 0 };
  }

  // Budget Compliance (50% weight)
  const budgetUtilization = budgetLimit > 0 ? currentMonthSpending / budgetLimit : 1;
  let complianceScore;

  if (budgetUtilization >= 1) {
    complianceScore = Math.max(0, 100 - (budgetUtilization - 1) * 500);
  } else {
    complianceScore = 100 - (budgetUtilization * 50);
  }
  complianceScore = Math.round(Math.max(0, Math.min(100, complianceScore)));

  // Spending Stability (50% weight)
  let stabilityScore = 100;
  if (prevMonthSpending > 0) {
    const momChange = ((currentMonthSpending - prevMonthSpending) / prevMonthSpending) * 100;
    if (momChange > 0) {
      stabilityScore = Math.max(0, 100 - (momChange * 3));
    } else {
      stabilityScore = Math.min(100, 100 - (momChange / 2));
    }
  } else if (currentMonthSpending > 0) {
    stabilityScore = 75;
  }
  stabilityScore = Math.round(Math.max(0, Math.min(100, stabilityScore)));

  const overallScore = Math.round(complianceScore * 0.50 + stabilityScore * 0.50);

  return {
    overall: overallScore,
    compliance: complianceScore,
    stability: stabilityScore,
  };
};