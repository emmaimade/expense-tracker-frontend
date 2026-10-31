import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { budgetService } from '../../../services/budgetService';
import { expenseService } from '../../../services/expenseService';
import { dateUtils } from '../../../utils/dateUtils';

const MONTHS_BY_RANGE = { '3months': 3, '6months': 6, '1year': 12 };

// First day of the oldest month in the range through today, as YYYY-MM-DD
const getRangeDates = (timeRange) => {
  const months = MONTHS_BY_RANGE[timeRange] || 6;
  const now = new Date();
  return {
    startDate: dateUtils.toLocalDateString(new Date(now.getFullYear(), now.getMonth() - months + 1, 1)),
    endDate: dateUtils.toLocalDateString(now),
  };
};

/**
 * Custom hook for analytics data processing and budget management.
 * Fetches the expenses for the whole time range itself; the query key starts
 * with 'recentTransactions', which the expense mutations invalidate.
 * @param {string} timeRange - Time range: '3months', '6months', or '1year'
 * @returns {Object} Analytics data, loading state, and utility functions
 */
export const useAnalytics = (timeRange = '6months') => {
  const rangeDates = useMemo(() => getRangeDates(timeRange), [timeRange]);
  const transactionsQuery = useQuery({
    queryKey: ['recentTransactions', 'analytics', rangeDates.startDate, rangeDates.endDate],
    queryFn: () => expenseService.getTransactionsByDateRange('custom', rangeDates),
    placeholderData: keepPreviousData,
  });
  const recentTransactions = transactionsQuery.data ?? null;

  const [budgetData, setBudgetData] = useState(null);
  const [categoryBudgets, setCategoryBudgets] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch budget data (once on mount)
  const fetchBudgetData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [overview] = await Promise.all([
        budgetService.getBudgetOverview().catch(() => ({ data: {} })),
      ]);

      setBudgetData(overview?.data || {});
      setCategoryBudgets(overview?.data?.categories || []); // Now sets [] after fetch, not initially
    } catch (err) {
      console.error('Failed to fetch budget data:', err);
      setError('Failed to load budget data');
      setBudgetData({});
      setCategoryBudgets([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  // Calculate analytics metrics
  const analytics = useMemo(() => {
    // Return null if transactions haven't loaded yet
    if (recentTransactions === null || recentTransactions === undefined) {
      return null;
    }

    // Default safe state (after transactions loaded but empty)
    const defaultAnalytics = {
      avgMonthlySpending: 0,
      largestExpense: { amount: 0, date: 'N/A', description: 'N/A' },
      categoryData: [],
      monthlyData: [],
      totalBudget: 0,
      totalSpent: 0,
      budgetAdherence: 0,
    };

    if (recentTransactions.length === 0) {
      return {
        ...defaultAnalytics,
        totalBudget: budgetData?.totalBudget || 0,
      };
    }

    const expenses = recentTransactions.filter(tx => tx.type === 'expense');
    if (expenses.length === 0) {
      return {
        ...defaultAnalytics,
        totalBudget: budgetData?.totalBudget || 0,
      };
    }

    // Determine months to analyze
    const monthsToAnalyze = timeRange === '3months' ? 3 : timeRange === '1year' ? 12 : 6;
    const now = new Date();
    const rangeStartDate = new Date(now.getFullYear(), now.getMonth() - monthsToAnalyze + 1, 1);

    // Filter expenses within the selected time range
    const recentExpenses = expenses.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= rangeStartDate && txDate <= now;
    });

    if (recentExpenses.length === 0) {
      return {
        ...defaultAnalytics,
        totalBudget: budgetData?.totalBudget || 0,
      };
    }

    // Total spent in time range
    const totalSpent = recentExpenses.reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);
    const avgMonthlySpending = totalSpent / monthsToAnalyze;

    // Largest expense
    let largestExpense = recentExpenses[0];
    for (const tx of recentExpenses) {
      if (Math.abs(tx.amount || 0) > Math.abs(largestExpense.amount || 0)) {
        largestExpense = tx;
      }
    }

    // Category totals (from recent expenses only)
    const categoryTotals = {};
    recentExpenses.forEach(tx => {
      const categoryName = tx.category?.name || tx.category || 'Uncategorized';
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Math.abs(tx.amount || 0);
    });

    const categoryData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);

    // Monthly data with YYYY-MM format for parsing
    const monthlyTotals = new Map();
    let currentDate = new Date(rangeStartDate);

    while (currentDate <= now) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const yearMonth = `${year}-${String(month + 1).padStart(2, '0')}`;

      monthlyTotals.set(yearMonth, {
        key: yearMonth,
        month: yearMonth, // Keep as YYYY-MM for parsing
        amount: 0,
      });

      currentDate.setMonth(month + 1);
    }

    // Aggregate expenses by month
    recentExpenses.forEach(tx => {
      const txDate = new Date(tx.date);
      const yearMonth = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
      const monthData = monthlyTotals.get(yearMonth);
      if (monthData) {
        monthData.amount += Math.abs(tx.amount || 0);
      }
    });

    const monthlyData = Array.from(monthlyTotals.values()).map(item => ({
      month: item.month, // YYYY-MM format
      amount: Math.round(item.amount),
    }));

    // Category with the biggest change from last month to this month
    const monthKey = (d) => `${d.getFullYear()}-${d.getMonth()}`;
    const thisMonth = monthKey(now);
    const lastMonth = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    const byCategory = {};
    recentExpenses.forEach(tx => {
      const key = monthKey(new Date(tx.date));
      if (key !== thisMonth && key !== lastMonth) return;
      const name = tx.category?.name || tx.category || 'Uncategorized';
      byCategory[name] = byCategory[name] || { current: 0, previous: 0 };
      byCategory[name][key === thisMonth ? 'current' : 'previous'] += Math.abs(tx.amount || 0);
    });
    const categoryChange = Object.entries(byCategory)
      .map(([name, { current, previous }]) => ({ name, current, previous, delta: current - previous }))
      .filter((c) => c.previous > 0 && Math.abs(c.delta) > 0)
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0] || null;

    // Budget adherence: compare time-range spending to prorated budget
    const monthlyBudget = budgetData?.totalBudget || 0;
    const totalBudgetForRange = monthlyBudget * monthsToAnalyze;
    const budgetAdherence = totalBudgetForRange > 0
      ? Math.min(999, Math.round((totalSpent / totalBudgetForRange) * 100)) // cap at 999%
      : 0;

    return {
      avgMonthlySpending: Math.round(avgMonthlySpending),
      largestExpense: {
        amount: Math.abs(largestExpense.amount || 0),
        date: new Date(largestExpense.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        description: largestExpense.name || largestExpense.description || 'N/A',
      },
      categoryData,
      monthlyData,
      totalBudget: Math.round(totalBudgetForRange),
      monthlyBudget: Math.round(monthlyBudget),
      totalSpent: Math.round(totalSpent),
      budgetAdherence,
      categoryChange,
    };
  }, [
    recentTransactions,
    timeRange,
    budgetData?.totalBudget,
  ]);

  // Trend insight: compare current month vs previous month
  const trendInsight = useMemo(() => {
    // Handle null analytics
    if (!analytics || !analytics.monthlyData || analytics.monthlyData.length < 2) {
      return null;
    }

    const current = analytics.monthlyData[analytics.monthlyData.length - 1]?.amount || 0;
    const previous = analytics.monthlyData[analytics.monthlyData.length - 2]?.amount || 0;

    if (previous === 0) return null;

    const change = ((current - previous) / previous) * 100;

    if (change > 20) {
      return {
        type: 'warning',
        title: 'Spending Spike',
        message: `This month is ${Math.round(change)}% higher than last month.`,
        icon: TrendingUp,
      };
    } else if (change < -20) {
      return {
        type: 'success',
        title: 'Great Progress!',
        message: `This month is ${Math.round(Math.abs(change))}% lower than last month.`,
        icon: TrendingDown,
      };
    }

    return null;
  }, [analytics]);

  // Export to CSV
  const exportToCSV = useCallback(() => {
    // Handle null analytics
    if (!analytics) {
      console.warn('No analytics data to export');
      return;
    }

    const csvData = [
      ['Analytics Export - Time Range:', timeRange],
      [''], // spacer
      ['Monthly Spending'],
      ['Month', 'Amount'],
      ...(analytics.monthlyData || []).map(item => [item.month, item.amount]),
      [''], // spacer
      ['Category Breakdown'],
      ['Category', 'Amount'],
      ...(analytics.categoryData || []).map(item => [item.name, item.value]),
      [''], // spacer
      ['Summary'],
      ['Metric', 'Value'],
      ['Total Budget (for period)', analytics.totalBudget || 0],
      ['Total Spent', analytics.totalSpent || 0],
      ['Budget Adherence', `${analytics.budgetAdherence || 0}%`],
      ['Avg Monthly Spending', analytics.avgMonthlySpending || 0],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_${timeRange}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }, [analytics, timeRange]);

  return {
    analytics, // Now returns null initially, then data
    categoryBudgets, // Now returns null initially, then [] or [...data]
    isLoading: isLoading || transactionsQuery.isLoading,
    // True only while a newly chosen time range loads
    isSwitching: transactionsQuery.isFetching && transactionsQuery.isPlaceholderData,
    error: error || (transactionsQuery.error ? 'Failed to load your expenses' : null),
    trendInsight,
    exportToCSV,
    refetch: fetchBudgetData,
  };
};

