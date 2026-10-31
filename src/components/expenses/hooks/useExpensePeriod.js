import { useState, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { expenseService } from '../../../services/expenseService';
import { dateUtils } from '../../../utils/dateUtils';

export const PERIODS = [
  { value: 'month', label: 'This month' },
  { value: 'last-month', label: 'Last month' },
  { value: '3months', label: 'Last 3 months' },
  { value: 'year', label: 'This year' },
  { value: 'all', label: 'All time' },
  { value: 'custom', label: 'Custom range' },
];

// { startDate, endDate } as YYYY-MM-DD for a preset, or null for all time
const getPresetRange = (period) => {
  const now = new Date();
  const toStr = dateUtils.toLocalDateString;
  switch (period) {
    case 'month':
      return { startDate: toStr(new Date(now.getFullYear(), now.getMonth(), 1)), endDate: toStr(now) };
    case 'last-month':
      return {
        startDate: toStr(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
        endDate: toStr(new Date(now.getFullYear(), now.getMonth(), 0)),
      };
    case '3months':
      return { startDate: toStr(new Date(now.getFullYear(), now.getMonth() - 2, 1)), endDate: toStr(now) };
    case 'year':
      return { startDate: toStr(new Date(now.getFullYear(), 0, 1)), endDate: toStr(now) };
    default:
      return null;
  }
};

/**
 * Fetches the expenses for the selected period from the API.
 * The query key starts with 'recentTransactions', which the expense mutations
 * already invalidate, so adds, edits and deletes refresh this list too.
 */
export const useExpensePeriod = (initialPeriod = 'all') => {
  const [period, setPeriod] = useState(initialPeriod);
  const [customRange, setCustomRange] = useState({ startDate: '', endDate: '' });

  const range = useMemo(
    () => (period === 'custom' ? customRange : getPresetRange(period)),
    [period, customRange]
  );

  const isCustomIncomplete =
    period === 'custom' &&
    (!customRange.startDate || !customRange.endDate || customRange.startDate > customRange.endDate);

  const query = useQuery({
    queryKey: ['recentTransactions', period, range?.startDate || null, range?.endDate || null],
    queryFn: () =>
      range
        ? expenseService.getTransactionsByDateRange('custom', range)
        : expenseService.getTransactionsByDateRange('all'),
    enabled: !isCustomIncomplete,
    // Keep showing the previous list while a new period loads
    placeholderData: keepPreviousData,
  });

  return {
    period,
    setPeriod,
    customRange,
    setCustomRange,
    range,
    isCustomIncomplete,
    transactions: query.data ?? null,
    isLoading: query.isLoading,
    // True only while a newly chosen period loads (not on background refreshes)
    isSwitching: query.isFetching && query.isPlaceholderData,
    error: query.error,
  };
};
