import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Tag, TrendingUp, TrendingDown, Minus, CalendarClock, HeartPulse } from 'lucide-react';
import { expenseService } from '../services/expenseService';
import { budgetService } from '../services/budgetService';
import { usePreferencesContext } from '../context/PreferencesContext';
import { dateUtils } from '../utils/dateUtils';

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
    ],
  });

  const [
    { data: currentTransactions, isLoading: loading1, error: error1 },
    { data: prevTransactions, isLoading: loading2, error: error2 },
    { data: totalBudget, isLoading: loading3, error: error3 },
  ] = queries;

  const isLoading = loading1 || loading2 || loading3;
  const error = error1 || error2 || error3;

  const memoizedData = useMemo(() => {
    const current = currentTransactions || [];
    const previous = prevTransactions || [];

    // Budget card: everything spent this month against the total budget.
    // (The API's budget overview only counts categories that have a budget, so
    // spending in other categories showed up as 0 here.)
    const budgetLimit = parseFloat(totalBudget) || 0;
    const totalSpent = current.reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
    const totalRemaining = budgetLimit - totalSpent;
    const percentageUsed = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;
    const isOverBudget = budgetLimit > 0 && totalSpent > budgetLimit;

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
  }, [currentTransactions, prevTransactions, totalBudget, formatCurrency]);

  // Refetch everything (used after currency changes and by the Retry button)
  const refreshData = () => Promise.all(queries.map((query) => query.refetch()));

  return {
    ...memoizedData,
    isLoading,
    error,
    refreshData,
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
    startDate: dateUtils.toLocalDateString(previousMonthStart),
    endDate: dateUtils.toLocalDateString(previousMonthEnd),
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

  // Top Category
  const topCategory = getTopCategory(currentMonthTransactions);
  const topCategoryPercentage = currentMonthSpending > 0 
    ? topCategory.amount / currentMonthSpending 
    : 0;
  const topCategoryDisplay = topCategory.category === 'No Expenses Yet' ? 'No Expenses Yet' : topCategory.category;

  // Month-over-Month Change
  let momChange = 0;
  let momChangeDirection = 'flat';
  const hasPreviousMonth = prevMonthSpending > 0;
  if (hasPreviousMonth) {
    momChange = ((currentMonthSpending - prevMonthSpending) / prevMonthSpending) * 100;
    momChangeDirection = momChange > 0 ? 'up' : momChange < 0 ? 'down' : 'flat';
  }

  // Daily Burn Rate, projected to month end
  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dailyBurnRate = currentDay > 0 ? currentMonthSpending / currentDay : 0;
  const projectedSpending = dailyBurnRate * daysInMonth;
  const projectedOverBudget = budgetLimit > 0 && projectedSpending > budgetLimit;

  // Financial Health Score
  const healthScore = calculateHealthScore(currentMonthSpending, prevMonthSpending, budgetLimit);

  // Total spent and budget usage live in the BudgetOverview hero card, so they aren't repeated here
  return [
    {
      name: 'Top category',
      value: topCategoryDisplay,
      change: `${(topCategoryPercentage * 100).toFixed(0)}% of spending`,
      icon: Tag,
      style: 'info',
      secondaryValue: formatCurrency(topCategory.amount)
    },
    {
      name: 'vs. last month',
      // Without last month's spending there's nothing to compare, so say so instead of "0.0%"
      value: hasPreviousMonth ? `${Math.abs(momChange).toFixed(1)}%` : '—',
      trend: momChangeDirection === 'flat' ? undefined : momChangeDirection,
      change: momChangeDirection === 'up'
        ? 'More spent'
        : momChangeDirection === 'down'
        ? 'Less spent'
        : hasPreviousMonth ? 'No change' : 'No spending last month',
      icon: momChangeDirection === 'up' ? TrendingUp : momChangeDirection === 'down' ? TrendingDown : Minus,
      style: momChangeDirection === 'up' ? 'danger' : momChangeDirection === 'down' ? 'success' : 'info',
      secondaryValue: momChangeDirection === 'flat'
        ? ''
        : `${formatCurrency(Math.abs(currentMonthSpending - prevMonthSpending))} ${momChangeDirection === 'up' ? 'more' : 'less'} than last month`
    },
    {
      name: 'Daily average',
      value: formatCurrency(dailyBurnRate),
      change: projectedOverBudget ? 'Over budget pace' : `Day ${currentDay} of ${daysInMonth}`,
      icon: CalendarClock,
      style: projectedOverBudget ? 'danger' : 'info',
      secondaryValue: `On pace for ${formatCurrency(projectedSpending)} this month`
    },
    {
      name: 'Financial health',
      value: healthScore.hasData ? `${healthScore.overall}` : '—',
      valueSuffix: healthScore.hasData ? '/100' : '',
      score: healthScore.hasData ? healthScore.overall : null,
      featured: true,
      change: !healthScore.hasData
        ? 'Not enough data'
        : healthScore.overall > 75 ? 'Healthy' : healthScore.overall > 50 ? 'Fair' : 'Needs attention',
      icon: HeartPulse,
      style: !healthScore.hasData
        ? 'info'
        : healthScore.overall > 75 ? 'success' : healthScore.overall > 50 ? 'warning' : 'danger',
      secondaryValue: describeHealth({ budgetLimit, currentMonthSpending, momChange, hasData: healthScore.hasData })
    },
  ];
};

/**
 * Plain-language explanation of the health score
 */
const describeHealth = ({ budgetLimit, currentMonthSpending, momChange, hasData }) => {
  if (!hasData) return 'Add expenses and a monthly budget to see your score.';
  if (budgetLimit === 0) return 'Set a monthly budget to get a full score.';
  if (currentMonthSpending > budgetLimit) return "You're over budget this month, which pulls your score down.";
  if (momChange > 10) return "You're under budget, but spending more than last month.";
  return "You're under budget and spending is steady. Keep it up!";
};

/**
 * Calculate health score
 */
const calculateHealthScore = (currentMonthSpending, prevMonthSpending, budgetLimit) => {
  if (currentMonthSpending === 0 && prevMonthSpending === 0 && budgetLimit === 0) {
    return { overall: 0, compliance: 0, stability: 0, hasData: false };
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
    hasData: true,
  };
};