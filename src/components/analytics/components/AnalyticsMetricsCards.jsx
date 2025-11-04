import { TrendingUp, PieChart as PieChartIcon, DollarSign } from 'lucide-react';

const AnalyticsMetricsCards = ({ analytics, isLoading, timeRange }) => {
  const { avgMonthlySpending, budgetAdherence, largestExpense } = analytics;
  console.log('Time Range in Metrics Cards:', timeRange);
  // Format time range for display
  const getTimeRangeLabel = () => {
    const labels = {
      '3months': '3 months',
      '6months': '6 months',
      '1year': '1 year',
    };
    return labels[timeRange] || '6 months';
  };

  const getBudgetStatus = () => {
    if (budgetAdherence > 100) return { text: 'Over budget', color: 'text-red-600' };
    if (budgetAdherence > 80) return { text: 'Near limit', color: 'text-yellow-600' };
    return { text: 'On track', color: 'text-green-600' };
  };

  const getBudgetIconColor = () => {
    if (budgetAdherence > 100) return 'text-red-600';
    if (budgetAdherence > 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  const status = getBudgetStatus();
  const timeRangeLabel = getTimeRangeLabel();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Avg Monthly Spending */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600">Avg Monthly Spending</p>
            {isLoading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse mt-2 w-32" />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${avgMonthlySpending.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1"> {timeRange === '1year' ? 'Last Year' : `Last ${timeRangeLabel}`}</p>
              </>
            )}
          </div>
          <div className="flex-shrink-0">
            <TrendingUp className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Budget Usage */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600">Budget Usage</p>
            {isLoading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse mt-2 w-24" />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 mt-1">
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
      </div>

      {/* Largest Expense */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600">Largest Expense</p>
            {isLoading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse mt-2 w-28" />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${largestExpense.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {largestExpense.date} • {timeRange === '1year' ? 'Last Year' : `Last ${timeRangeLabel}`}
                </p>
              </>
            )}
          </div>
          <div className="flex-shrink-0">
            <DollarSign className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsMetricsCards;