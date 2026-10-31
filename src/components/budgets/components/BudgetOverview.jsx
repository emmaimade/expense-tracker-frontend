import { usePreferencesContext } from '../../../context/PreferencesContext';
import Card from '../../common/Card';

// Same look as the dashboard's budget card, so both pages read as one product
const BudgetOverview = ({
  totalBudget,
  remaining,
  isOverBudget,
  daysRemaining,
  spent,
  percentageUsed,
  categoryCount = 0,
  dailyAverage = 0,
  projectedSpending = 0,
  }) => {
  const { formatCurrency } = usePreferencesContext();
  const isNearLimit = !isOverBudget && percentageUsed > 80;
  const month = new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  // What's left to spend per day for the rest of the month (budget-specific; the dashboard doesn't show it)
  const daysLeft = Math.max(daysRemaining || 0, 1);
  const safeDaily = remaining > 0 ? remaining / daysLeft : 0;
  const onPaceToOverspend = totalBudget > 0 && !isOverBudget && projectedSpending > totalBudget;

  const statusColor = isOverBudget
    ? "text-red-600 dark:text-red-400"
    : isNearLimit
    ? "text-orange-600 dark:text-orange-400"
    : "text-indigo-600 dark:text-indigo-400";

  const barColor = isOverBudget
    ? "bg-gradient-to-r from-red-500 to-red-600"
    : isNearLimit
    ? "bg-gradient-to-r from-yellow-500 to-orange-500"
    : "bg-gradient-to-r from-indigo-500 to-indigo-600";

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-4 min-w-0">
        <div className="min-w-0">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {month} budget
          </h2>
          <p className="text-3xl sm:text-4xl font-bold mt-1 break-words text-gray-900 dark:text-gray-100">
            {formatCurrency(totalBudget)}
          </p>
          {categoryCount > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Total of your {categoryCount} category {categoryCount === 1 ? 'budget' : 'budgets'}
            </p>
          )}
        </div>
        <div className="sm:text-right">
          <p className={`text-2xl font-bold break-words ${isOverBudget ? statusColor : "text-gray-900 dark:text-gray-100"}`}>
            {formatCurrency(Math.abs(remaining))}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isOverBudget ? "over budget" : `left · ${daysRemaining} days to go`}
          </p>
        </div>
      </div>

      <div
        className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2"
        role="progressbar"
        aria-valuenow={Math.round(percentageUsed)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Budget used"
      >
        <div
          className={`h-3 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(percentageUsed, 100)}%` }}
        />
      </div>
      <div className="flex justify-between items-center gap-2 text-sm">
        <p className={`font-medium ${statusColor}`}>{percentageUsed.toFixed(1)}% used</p>
        <p className="text-gray-700 dark:text-gray-300">{formatCurrency(spent)} spent</p>
      </div>

      {totalBudget > 0 && (
        <p
          className={`mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm ${
            isOverBudget || onPaceToOverspend ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {isOverBudget
            ? "You've used your whole budget for this month."
            : <>
                To stay on budget, keep to{' '}
                <span className="font-semibold">{formatCurrency(safeDaily)}/day</span> for the next{' '}
                {daysLeft} {daysLeft === 1 ? 'day' : 'days'}
                {dailyAverage > 0 && <> (you're averaging {formatCurrency(dailyAverage)}/day{onPaceToOverspend && <>, on pace for {formatCurrency(projectedSpending)}</>})</>}.
              </>}
        </p>
      )}
    </Card>
  );
};

export default BudgetOverview;
