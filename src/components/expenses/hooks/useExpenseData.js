import { useState, useMemo } from 'react';

export const useExpenseData = (recentTransactions = []) => {
  const [dateRange, setDateRange] = useState('month');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [isUsingCustomRange, setIsUsingCustomRange] = useState(false);

  // Function to filter transactions based on date range
  const getDateFilteredTransactions = (range) => {
    if (isUsingCustomRange && customDateRange.startDate && customDateRange.endDate) {
      // Use custom date range if set
      const startDate = new Date(customDateRange.startDate);
      const endDate = new Date(customDateRange.endDate);
      endDate.setHours(23, 59, 59, 999); // Include full end date
      
      return recentTransactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate >= startDate && txDate <= endDate;
      });
    }

    // Otherwise use preset ranges
    const now = new Date();
    let startDate;

    switch (range) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return recentTransactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= now;
    });
  };

  // Calculate category data for pie chart based on selected date range
  const categoryData = useMemo(() => {
    return getDateFilteredTransactions(dateRange)
      .filter(tx => tx.type === 'expense')
      .reduce((acc, tx) => {
        const existing = acc.find(item => item.name === tx.category);
        if (existing) {
          existing.value += Math.abs(tx.amount);
        } else {
          acc.push({ name: tx.category, value: Math.abs(tx.amount) });
        }
        return acc;
      }, []);
  }, [recentTransactions, dateRange, customDateRange, isUsingCustomRange]);

  // Calculate monthly spending data from real transactions
  const monthlyData = useMemo(() => {
    const monthlyTotals = {};
    let startDate, endDate;

    if (isUsingCustomRange && customDateRange.startDate && customDateRange.endDate) {
      startDate = new Date(customDateRange.startDate);
      endDate = new Date(customDateRange.endDate);
    } else {
      const currentDate = new Date();
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    }

    const today = new Date();
    if (endDate > today) {
      endDate = today;
    }
    
    if (startDate > endDate) {
      console.warn('Invalid date range: startDate after endDate');
      return [];
    }

    // Initialize months in the range
    let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    while (currentDate <= endDate) {
      const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const monthName = currentDate.toLocaleDateString('en-US', { month: 'short' });
      monthlyTotals[monthKey] = {
        month: monthName,
        amount: 0,
        year: currentDate.getFullYear()
      };
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Add transaction amounts to corresponding months
    recentTransactions
      .filter(tx => tx.type === 'expense')
      .forEach(tx => {
        const transactionDate = new Date(tx.date);
        const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (monthlyTotals[monthKey]) {
          monthlyTotals[monthKey].amount += Math.abs(tx.amount);
        }
      });

    return Object.keys(monthlyTotals)
      .sort()
      .map(key => ({
        month: monthlyTotals[key].month,
        amount: Math.round(monthlyTotals[key].amount)
      }));
  }, [recentTransactions, customDateRange, isUsingCustomRange]);

  // Function to update custom date range and set flag
  const updateCustomDateRange = (newRange) => {
    setCustomDateRange(newRange);
    setIsUsingCustomRange(Boolean(newRange.startDate && newRange.endDate));
  };

  // Function to reset to default state
  const resetToDefault = () => {
    setCustomDateRange({ startDate: '', endDate: '' });
    setIsUsingCustomRange(false);
    setDateRange('month'); // Reset to default month view
  };

  // Function to apply quick date ranges
  const applyQuickRange = (rangeType) => {
    const today = new Date();
    let startDate, endDate;

    switch (rangeType) {
      case 'weekly':
        endDate = today;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'monthly':
        endDate = today;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        break;
      case 'three-months':
        endDate = today;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 90);
        break;
      default:
        resetToDefault();
        return;
    }

    updateCustomDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  };

  return {
    categoryData,
    monthlyData,
    dateRange,
    setDateRange,
    customDateRange,
    setCustomDateRange: updateCustomDateRange,
    isUsingCustomRange,
    resetToDefault,
    applyQuickRange,
    getDateFilteredTransactions
  };
};