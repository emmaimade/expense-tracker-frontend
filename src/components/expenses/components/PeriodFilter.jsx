import { Calendar } from 'lucide-react';
import { PERIODS } from '../hooks/useExpensePeriod';

const fieldClass =
  'py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white';

// Period dropdown; "Custom range" reveals two inline date fields
const PeriodFilter = ({ period, onPeriodChange, customRange, onCustomRangeChange }) => {
  const invalidRange =
    customRange.startDate && customRange.endDate && customRange.startDate > customRange.endDate;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          aria-label="Time period"
          className={`${fieldClass} w-full sm:w-auto pl-10 pr-8 appearance-none`}
        >
          {PERIODS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {period === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customRange.startDate}
            onChange={(e) => onCustomRangeChange({ ...customRange, startDate: e.target.value })}
            aria-label="From date"
            aria-invalid={invalidRange || undefined}
            className={`${fieldClass} px-3 flex-1 min-w-0`}
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">to</span>
          <input
            type="date"
            value={customRange.endDate}
            min={customRange.startDate || undefined}
            onChange={(e) => onCustomRangeChange({ ...customRange, endDate: e.target.value })}
            aria-label="To date"
            aria-invalid={invalidRange || undefined}
            className={`${fieldClass} px-3 flex-1 min-w-0`}
          />
        </div>
      )}
    </div>
  );
};

export default PeriodFilter;
