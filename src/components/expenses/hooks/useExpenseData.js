import { useState, useMemo, useCallback } from 'react';

// Helper function to get the start of the day for filtering
const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Helper function to get the end of the day for filtering
const getEndOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// ✅ FIX: Remove default parameter so we can detect when data hasn't loaded
export const useExpenseData = (recentTransactions) => {
  const [dateRangeType, setDateRangeType] = useState("year");
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  console.log('🔧 useExpenseData state:', {
    dateRangeType,
    customDateRange,
    isUsingCustomRange: dateRangeType === "custom",
    transactionsCount: recentTransactions?.length,
    transactionsIsNull: recentTransactions === null,
    transactionsIsUndefined: recentTransactions === undefined,
  });

  // Reset to default function
  const resetToDefault = useCallback(() => {
    console.log('🔄 Resetting to default');
    setDateRangeType("month");
    setCustomDateRange({
      startDate: "",
      endDate: "",
    });
  }, []);

  // Function to determine the effective date range (startDate, endDate)
  const getEffectiveDateRange = useCallback((rangeType) => {
    if (
      rangeType === "custom" &&
      customDateRange.startDate &&
      customDateRange.endDate
    ) {
      console.log('📅 Using custom date range:', customDateRange);
      return {
        startDate: getStartOfDay(customDateRange.startDate),
        endDate: getEndOfDay(customDateRange.endDate),
      };
    }

    // Otherwise use preset ranges
    const now = new Date();
    let startDate;

    switch (rangeType) {
      case "week":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7
        );
        break;
      case "quarter":
        startDate = new Date(
          now.getFullYear(),
          Math.floor(now.getMonth() / 3) * 3,
          1
        );
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case "month": // default
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    console.log('📅 Using preset range:', rangeType);
    return {
      startDate: getStartOfDay(startDate),
      endDate: getEndOfDay(now),
    };
  }, [customDateRange]);

  // Function to filter transactions based on the determined date range
  const getDateFilteredTransactions = useMemo(() => {
    // ✅ FIX: Return null if data hasn't loaded yet
    if (recentTransactions === null || recentTransactions === undefined) {
      console.log('⏳ Transactions not loaded yet, returning null');
      return null;
    }

    const { startDate, endDate } = getEffectiveDateRange(dateRangeType);

    console.log('📅 Effective date range:', {
      type: dateRangeType,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      totalTransactions: recentTransactions.length
    });

    if (startDate > endDate) {
      console.warn("⚠️ Invalid date range: startDate after endDate");
      return [];
    }

    const filtered = recentTransactions.filter((tx) => {
      if (!tx.date) {
        console.warn('⚠️ Transaction missing date:', tx);
        return false;
      }
      
      const txDate = new Date(tx.date);
      const isInRange = txDate >= startDate && txDate <= endDate;
      
      return isInRange;
    });

    console.log('✅ Date filtered transactions:', {
      filtered: filtered.length,
      total: recentTransactions.length,
      dateRangeType
    });
    
    return filtered;
  }, [recentTransactions, dateRangeType, getEffectiveDateRange]);

  // 1. Calculate category data for pie chart
  const categoryData = useMemo(() => {
    // ✅ FIX: Return null if filtered transactions not ready
    if (!getDateFilteredTransactions) return null;
    
    return getDateFilteredTransactions
      .filter((tx) => tx.type === "expense")
      .reduce((acc, tx) => {
        const categoryName = tx.category?.name || 'Uncategorized';
        const existing = acc.find((item) => item.name === categoryName);
        const amount = Math.abs(tx.amount);
        
        if (existing) {
          existing.value += amount;
        } else {
          acc.push({ name: categoryName, value: amount });
        }
        return acc;
      }, []);
  }, [getDateFilteredTransactions]);

  // 2. Calculate monthly spending data
  const monthlyData = useMemo(() => {
    // ✅ FIX: Return null if transactions not ready
    if (!recentTransactions) return null;
    
    const monthlyTotals = {};
    const currentDate = new Date();

    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 5,
      1
    );
    const endDate = getEndOfDay(currentDate);

    // Initialize months in the range
    let datePointer = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      1
    );
    while (datePointer <= endDate) {
      const monthKey = `${datePointer.getFullYear()}-${String(
        datePointer.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = datePointer.toLocaleDateString("en-US", {
        month: "short",
      });
      monthlyTotals[monthKey] = {
        month: monthName,
        amount: 0,
        year: datePointer.getFullYear(),
      };
      datePointer.setMonth(datePointer.getMonth() + 1);
    }

    recentTransactions
      .filter((tx) => tx.type === "expense")
      .filter((tx) => {
        const txDate = new Date(tx.date);
        return txDate >= startDate && txDate <= endDate;
      })
      .forEach((tx) => {
        const transactionDate = new Date(tx.date);
        const monthKey = `${transactionDate.getFullYear()}-${String(
          transactionDate.getMonth() + 1
        ).padStart(2, "0")}`;

        if (monthlyTotals[monthKey]) {
          monthlyTotals[monthKey].amount += Math.abs(tx.amount);
        }
      });

    return Object.keys(monthlyTotals)
      .sort()
      .map((key) => ({
        month: monthlyTotals[key].month,
        amount: Math.round(monthlyTotals[key].amount),
      }));
  }, [recentTransactions]);

  // Function to update custom date range and set type
  const updateCustomDateRange = useCallback((newRange) => {
    console.log('📅 updateCustomDateRange called with:', newRange);
    
    setCustomDateRange(newRange);
    
    if (newRange.startDate && newRange.endDate) {
      console.log('✅ Setting dateRangeType to "custom"');
      setDateRangeType("custom");
    } else if (!newRange.startDate && !newRange.endDate) {
      console.log('🔄 Resetting dateRangeType to "month"');
      setDateRangeType("month");
    }
  }, []);

  // Explicit function to apply custom date range with validation
  const applyCustomDateRange = useCallback((startDate, endDate) => {
    console.log('📅 applyCustomDateRange called:', { startDate, endDate });
    
    if (!startDate || !endDate) {
      console.error('❌ Both startDate and endDate are required');
      return;
    }

    const newRange = {
      startDate: typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0],
      endDate: typeof endDate === 'string' ? endDate : endDate.toISOString().split('T')[0],
    };

    console.log('✅ Setting custom date range:', newRange);
    setCustomDateRange(newRange);
    setDateRangeType("custom");
  }, []);

  // Function to apply quick date ranges
  const applyQuickRange = useCallback((rangeType) => {
    const today = new Date();
    let startDate,
      endDate = today;

    switch (rangeType) {
      case "weekly":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case "monthly":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        break;
      case "three-months":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 90);
        break;
      default:
        resetToDefault();
        return;
    }

    const newRange = {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
    
    console.log('📅 Applying quick range:', rangeType, newRange);
    setCustomDateRange(newRange);
    setDateRangeType("custom");
  }, [resetToDefault]);

  const isUsingCustomRange = dateRangeType === "custom";

  // ✅ FIX: Add isLoading indicator
  const isLoading = recentTransactions === null || recentTransactions === undefined;

  return {
    categoryData,
    monthlyData,
    dateRangeType,
    setDateRangeType,
    customDateRange,
    setCustomDateRange: updateCustomDateRange,
    applyCustomDateRange,
    isUsingCustomRange,
    resetToDefault,
    applyQuickRange,
    filteredTransactions: getDateFilteredTransactions,
    isLoading, // ✅ NEW: Expose loading state
  };
};