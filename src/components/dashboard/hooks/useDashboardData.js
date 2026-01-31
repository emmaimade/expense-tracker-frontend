import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { expenseService } from '../../../services/expenseService';
import { budgetService } from '../../../services/budgetService';
import { usePreferencesContext } from '../../../context/PreferencesContext';

/**
 * Unified dashboard data hook - fetches all data in parallel using TanStack Query
 */
export const useDashboardData = () => {
  const { formatCurrency } = usePreferencesContext();

  const queries = useQueries({
    queries: [
      {
        queryKey: ['currentMonthTransactions'],
        queryFn: () => expenseService.getTransactionsByDateRange("monthly"),
        select: (response) => Array.isArray(response) ? response : response?.data || [], // adjust if needed based on response shape
        placeholderData: [],
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
      {
        queryKey: ['prevMonthTransactions'],
        queryFn: () => {
          const previousMonthDates = getPreviousMonthDateRange();
          return expenseService.getTransactionsByDateRange("custom", {
            startDate: previousMonthDates.startDate,
            endDate: previousMonthDates.endDate,
          });
        },
        select: (response) => Array.isArray(response) ? response : response?.data || [],
        placeholderData: [],
      },
      {
        queryKey: ['totalMonthlyBudget'],
        queryFn: () => budgetService.getTotalMonthlyBudget(),
        select: (response) => response?.data?.totalBudget ?? response?.totalBudget ?? 0,
        placeholderData: 0,
      },
      {
        queryKey: ['budgetOverview'],
        queryFn: () => budgetService.getBudgetOverview(),
        select: (response) => response?.data ?? response ?? {},
        placeholderData: {},
      },
    ],
  });

  const [
    { data: currentTransactions, isLoading: loading1, error: error1 },
    { data: prevTransactions, isLoading: loading2, error: error2 },
    { data: totalBudget, isLoading: loading3, error: error3 },
    { data: budgetOverview, isLoading: loading4, error: error4 },
  ] = queries;

  const isLoading = loading1 || loading2 || loading3 || loading4;
  const error = error1 || error2 || error3 || error4;

  const memoizedData = useMemo(() => {
    const current = currentTransactions || [];
    const previous = prevTransactions || [];

    // Extract budget information
    const budgetLimit = parseFloat(totalBudget) || 0;
    const totalSpent = parseFloat(budgetOverview?.totalSpent) || 0;
    const totalRemaining = parseFloat(budgetOverview?.totalRemaining) || 0;
    const percentageUsed = parseFloat(budgetOverview?.summary?.percentageUsed) || 0;
    const isOverBudget = budgetOverview?.summary?.isOverBudget || false;

    // Calculate stats
    const stats = calculateFinancialStats(
      current,
      previous,
      budgetLimit,
      formatCurrency
    );

    return {
      // Budget overview data
      budget: {
        totalSpentThisMonth: totalSpent.toFixed(2),
        budgetLimit,
        totalRemaining: totalRemaining.toFixed(2),
        percentageUsed,
        isOverBudget,
      },
      
      // Financial stats
      stats,
      
      // Raw transaction data
      transactions: {
        current,
        previous,
      },
    };
  }, [currentTransactions, prevTransactions, totalBudget, budgetOverview, formatCurrency]);

  return {
    ...memoizedData,
    isLoading,
    error,
  };
};

/**
 * Helper to get previous month date range
 */
const getPreviousMonthDateRange = () => {
  const today = new Date();
  const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  return {
    startDate: previousMonthStart.toISOString().split('T')[0],
    endDate: previousMonthEnd.toISOString().split('T')[0],
  };
};

/**
 * Helper to get top category
 */
const getTopCategory = (transactions) => {
  const categorySpend = {};
  
  transactions.forEach(transaction => {
    const categoryName = transaction.category?.name || transaction.categoryName || 'Uncategorized';
    categorySpend[categoryName] = (categorySpend[categoryName] || 0) + Math.abs(transaction.amount);
  });

  let topCategory = { category: 'No Expenses Yet', amount: 0 };
  let maxAmount = 0;

  Object.entries(categorySpend).forEach(([category, amount]) => {
    if (amount > maxAmount) {
      maxAmount = amount;
      topCategory = { category, amount };
    }
  });

  return topCategory;
};

/**
 * Calculate financial stats
 */
const calculateFinancialStats = (
  currentMonthTransactions = [],
  prevMonthTransactions = [],
  budgetLimit = 0,
  formatCurrency = (v) => v.toString()
) => {
  // Current Month Spending
  const currentMonthSpending = currentMonthTransactions.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );

  // Previous Month Spending
  const prevMonthSpending = prevMonthTransactions.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );

  // Budget Utilization
  const budgetUtilization = budgetLimit > 0 ? currentMonthSpending / budgetLimit : 0;

  // Top Category
  const topCategory = getTopCategory(currentMonthTransactions);
  const topCategoryPercentage = currentMonthSpending > 0 
    ? topCategory.amount / currentMonthSpending 
    : 0;
  const topCategoryDisplay = topCategory.category === 'No Expenses Yet' ? 'No Expenses Yet' : topCategory.category;

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