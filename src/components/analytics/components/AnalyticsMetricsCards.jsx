import { TrendingUp, PieChart as PieChartIcon, DollarSign } from 'lucide-react';
import { usePreferencesContext } from '../../../context/PreferencesContext';
import Card from '../../../components/common/Card';

const AnalyticsMetricsCards = ({ analytics, isLoading, timeRange }) => {
  const { avgMonthlySpending, budgetAdherence, largestExpense } = analytics;
  const { formatCurrency } = usePreferencesContext();

  const getTimeRangeLabel = () => {
    const labels = {
      '3months': '3 months',
      '6months': '6 months',
      '1year': '1 year',
    };
    return labels[timeRange] || '6 months';
  };

  const getBudgetStatus = () => {
    if (budgetAdherence > 100) return { text: 'Over budget', color: 'text-red-500 dark:text-red-400' };
    if (budgetAdherence > 80) return { text: 'Near limit', color: 'text-yellow-600 dark:text-yellow-400' };
    return { text: 'On track', color: 'text-green-600 dark:text-green-400' };
  };

  const getBudgetIconColor = () => {
    if (budgetAdherence > 100) return 'text-red-500 dark:text-red-400';
    if (budgetAdherence > 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const status = getBudgetStatus();
  const timeRangeLabel = getTimeRangeLabel();
  const timeLabel = timeRange === '1year' ? 'Last Year' : `Last ${timeRangeLabel}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Avg Monthly Spending */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Monthly Spending</p>
            {isLoading ? (
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2 w-32" />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {formatCurrency(avgMonthlySpending)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{timeLabel}</p>
              </>
            )}
          </div>
          <div className="flex-shrink-0">
            <TrendingUp className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </Card>

      {/* Budget Usage */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">Budget Usage</p>
            {isLoading ? (
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2 w-24" />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {budgetAdherence}%
                </p>
                <p className={`text-sm mt-1 font-medium ${status.color}`}>
                  {status.text}
                </p>
              </>
            )}
          </div>
          <div className="flex-shrink-0">
            <PieChartIcon className={`w-8 h-8 ${getBudgetIconColor()}`} />
          </div>
        </div>
      </Card>

      {/* Largest Expense */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">Largest Expense</p>
            {isLoading ? (
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2 w-28" />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {formatCurrency(largestExpense.amount)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {largestExpense.date} • {timeLabel}
                </p>
              </>
            )}
          </div>
          <div className="flex-shrink-0">
            <DollarSign className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsMetricsCards;