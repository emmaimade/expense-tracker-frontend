import { useState, useEffect, useMemo, useCallback } from 'react';
import { budgetService } from '../../../services/budgetService';

/**
 * Custom hook for analytics data processing and budget management
 * @param {Array} recentTransactions - Array of transaction objects
 * @param {string} timeRange - Time range: '3months', '6months', or '1year'
 * @returns {Object} Analytics data, loading state, and utility functions
 */
export const useAnalytics = (recentTransactions = [], timeRange = '6months') => {
  const [budgetData, setBudgetData] = useState(null);
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch budget data
  const fetchBudgetData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [overview] = await Promise.all([
        budgetService.getBudgetOverview().catch(() => ({ data: {} })),
      ]);

      console.log('Budget Overview:', overview?.data);

      setBudgetData(overview?.data || {});
      setCategoryBudgets(overview?.data?.categories || []);
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
    // Early return with safe defaults
    if (!recentTransactions || recentTransactions.length === 0) {
      return {
        avgMonthlySpending: 0,
        largestExpense: { amount: 0, date: 'N/A', description: 'N/A' },
        categoryData: budgetData?.categories || [],
        monthlyData: [],
        totalBudget: budgetData?.totalBudget || 0,
        totalSpent: budgetData?.totalSpent || 0,
        budgetAdherence: 0,
      };
    }

    const expenses = recentTransactions.filter(tx => tx.type === 'expense');
    
    // Calculate date range
    const monthsToAnalyze = timeRange === '3months' ? 3 : timeRange === '1year' ? 12 : 6;
    const now = new Date();
    const rangeStartDate = new Date(now.getFullYear(), now.getMonth() - monthsToAnalyze + 1, 1);
    
    // Filter expenses by date range
    const recentExpenses = expenses.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= rangeStartDate && txDate <= now;
    });

    const totalSpent = recentExpenses.reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);
    const avgMonthlySpending = totalSpent / monthsToAnalyze;

    // Find largest expense (from recent expenses only)
    const largestExpense = recentExpenses.reduce((max, tx) => {
      return Math.abs(tx.amount || 0) > Math.abs(max.amount || 0) ? tx : max;
    }, { amount: 0, date: new Date(), description: 'N/A' });

    // ──────────────────────────────────────────────────────
    // FIX #1: Category totals from RECENT expenses only
    // ──────────────────────────────────────────────────────
    const categoryTotals = {};
    recentExpenses.forEach(tx => {
      const categoryName = tx.category?.name || tx.category || 'Uncategorized';
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Math.abs(tx.amount || 0);
    });

    const categoryData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // ──────────────────────────────────────────────────────
    // FIX #2: Monthly data with YEAR-MONTH keys to prevent collision
    // ──────────────────────────────────────────────────────
    const monthlyTotals = new Map();
    
    // Generate all months in range with unique keys
    let currentDate = new Date(rangeStartDate);
    while (currentDate <= now) {
      const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const displayMonth = currentDate.toLocaleDateString('en-US', { month: 'short' });
      
      monthlyTotals.set(yearMonth, {
        key: yearMonth,
        month: displayMonth,
        amount: 0,
      });
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Aggregate transactions into months
    recentExpenses.forEach(tx => {
      const txDate = new Date(tx.date);
      const yearMonth = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
      
      const monthData = monthlyTotals.get(yearMonth);
      if (monthData) {
        monthData.amount += Math.abs(tx.amount || 0);
      }
    });

    // Convert to array and round amounts
    const monthlyData = Array.from(monthlyTotals.values()).map(item => ({
      month: item.month,
      amount: Math.round(item.amount),
    }));

    const totalBudget = budgetData?.totalBudget || 0;
    const spent = budgetData?.totalSpent || totalSpent;
    const budgetAdherence = totalBudget > 0 ? Math.round((spent / totalBudget) * 100) : 0;

    return {
      avgMonthlySpending: Math.round(avgMonthlySpending),
      largestExpense: {
        amount: Math.abs(largestExpense.amount || 0),
        date: new Date(largestExpense.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        }),
        description: largestExpense.description || 'N/A',
      },
      categoryData,
      monthlyData,
      totalBudget,
      totalSpent: Math.round(spent),
      budgetAdherence,
    };
  }, [
    recentTransactions, 
    timeRange, 
    budgetData?.totalBudget, 
    budgetData?.totalSpent,
    budgetData?.categories
  ]);

  // Trend analysis
  const trendInsight = useMemo(() => {
    if (!analytics.monthlyData || analytics.monthlyData.length < 2) return null;

    const currentMonth = analytics.monthlyData[analytics.monthlyData.length - 1].amount;
    const previousMonths = analytics.monthlyData.slice(0, -1);
    const avgPrevious = previousMonths.reduce((sum, m) => sum + m.amount, 0) / previousMonths.length;
    
    if (avgPrevious === 0) return null;
    
    const change = ((currentMonth - avgPrevious) / avgPrevious) * 100;

    if (change > 20) {
      return {
        type: 'warning',
        title: 'High Spending Alert',
        message: `Your spending this month is ${Math.round(change)}% higher than your average.`,
        icon: '⚡',
      };
    } else if (change < -20) {
      return {
        type: 'success',
        title: 'Spending Trend',
        message: `Your spending this month is ${Math.round(Math.abs(change))}% lower than your average. Great job!`,
        icon: '✅',
      };
    }
    
    return null;
  }, [analytics.monthlyData]);

  // Export function
  const exportToCSV = useCallback(() => {
    const csvData = [
      ['Analytics Export'],
      [''],
      ['Monthly Data'],
      ['Month', 'Amount'],
      ...analytics.monthlyData.map(item => [item.month, item.amount]),
      [''],
      ['Category Data'],
      ['Category', 'Amount'],
      ...analytics.categoryData.map(item => [item.name, item.value]),
      [''],
      ['Summary'],
      ['Metric', 'Value'],
      ['Total Budget', analytics.totalBudget],
      ['Total Spent', analytics.totalSpent],
      ['Budget Adherence', `${analytics.budgetAdherence}%`],
      ['Avg Monthly Spending', analytics.avgMonthlySpending],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }, [analytics]);

  return {
    analytics,
    categoryBudgets,
    isLoading,
    error,
    trendInsight,
    exportToCSV,
    refetch: fetchBudgetData,
  };
};