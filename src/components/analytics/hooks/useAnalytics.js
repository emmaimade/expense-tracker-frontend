import { useState, useEffect, useMemo, useCallback } from 'react';
import { budgetService } from '../../../services/budgetService';

/**
 * Custom hook for analytics data processing and budget management
 * @param {Array} recentTransactions - Array of transaction objects
 * @param {string} timeRange - Time range: '3months', '6months', or '1year'
 * @returns {Object} Analytics data, loading state, and utility functions
 */
// ✅ FIX: Remove default parameters so we can detect when data hasn't loaded
export const useAnalytics = (recentTransactions, timeRange = '6months') => {
  const [budgetData, setBudgetData] = useState(null);
  const [categoryBudgets, setCategoryBudgets] = useState(null); // ✅ Changed from [] to null
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('🔧 useAnalytics called:', {
    recentTransactions,
    recentTransactionsIsNull: recentTransactions === null,
    recentTransactionsIsUndefined: recentTransactions === undefined,
    recentTransactionsLength: recentTransactions?.length,
    timeRange,
  });

  // Fetch budget data (once on mount)
  const fetchBudgetData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [overview] = await Promise.all([
        budgetService.getBudgetOverview().catch(() => ({ data: {} })),
      ]);

      console.log('Budget Overview:', overview?.data);

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
    // ✅ FIX: Return null if transactions haven't loaded yet
    if (recentTransactions === null || recentTransactions === undefined) {
      console.log('⏳ Transactions not loaded yet, returning null analytics');
      return null;
    }

    console.log('⚙️ Computing analytics for', recentTransactions.length, 'transactions');

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
      console.log('📭 No transactions, returning default analytics');
      return {
        ...defaultAnalytics,
        totalBudget: budgetData?.totalBudget || 0,
      };
    }

    const expenses = recentTransactions.filter(tx => tx.type === 'expense');
    if (expenses.length === 0) {
      console.log('📭 No expenses found, returning default analytics');
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
      console.log('📭 No expenses in time range, returning default analytics');
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

    console.log('📊 useAnalytics - Generated analytics:', {
      categoryDataCount: categoryData.length,
      monthlyDataCount: monthlyData.length,
      totalSpent,
      avgMonthlySpending: Math.round(avgMonthlySpending),
    });

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
        description: largestExpense.description || 'N/A',
      },
      categoryData,
      monthlyData,
      totalBudget: Math.round(totalBudgetForRange),
      totalSpent: Math.round(totalSpent),
      budgetAdherence,
    };
  }, [
    recentTransactions,
    timeRange,
    budgetData?.totalBudget,
  ]);

  // Trend insight: compare current month vs previous month
  const trendInsight = useMemo(() => {
    // ✅ FIX: Handle null analytics
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
        icon: '⚡',
      };
    } else if (change < -20) {
      return {
        type: 'success',
        title: 'Great Progress!',
        message: `This month is ${Math.round(Math.abs(change))}% lower than last month.`,
        icon: '✅',
      };
    }

    return null;
  }, [analytics]);

  // Export to CSV
  const exportToCSV = useCallback(() => {
    // ✅ FIX: Handle null analytics
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
    isLoading,
    error,
    trendInsight,
    exportToCSV,
    refetch: fetchBudgetData,
  };
};