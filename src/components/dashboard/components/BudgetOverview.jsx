import { usePreferencesContext } from '../../../context/PreferencesContext';
import Card from '../../../components/common/Card';

const BudgetOverview = ({ budgetData }) => {
  const { formatCurrency } = usePreferencesContext();
  if (!budgetData) {
    return (
      <Card className="text-center py-10">
        <p className="text-indigo-600 font-medium">Loading Budget Data...</p>
      </Card>
    );
  }

  const {
    totalSpentThisMonth,
    budgetLimit,
    totalRemaining,
    percentageUsed,
    isOverBudget
  } = budgetData;

  const totalSpent = Number(totalSpentThisMonth) || 0;
  const limit = Number(budgetLimit) || 0;
  const remaining = Number(totalRemaining) || 0;
  const percentage = Number(percentageUsed) || 0;
  const hasBudget = limit > 0;
  const isNearLimit = !isOverBudget && percentage > 80;

  // Handle case where budgetLimit might be 0
  const progressWidth = hasBudget ? Math.min(percentage, 100) : 0;

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
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between mb-4 min-w-0">
        <div className="min-w-0">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Spent this month
          </h2>
          <p
            className={`text-3xl sm:text-4xl font-bold mt-1 break-words ${
              isOverBudget ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {formatCurrency(totalSpent)}
          </p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-right">
          {hasBudget ? `of ${formatCurrency(limit)} budget` : "No monthly budget set"}
        </p>
      </div>

      {hasBudget && (
        <>
          <div
            className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2"
            role="progressbar"
            aria-valuenow={Math.round(percentage)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Budget used"
          >
            <div
              className={`h-3 rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center gap-2 text-sm">
            <p className={`font-medium ${statusColor}`}>
              {percentage.toFixed(1)}% used
            </p>
            <p className={`font-medium ${isOverBudget ? statusColor : "text-gray-700 dark:text-gray-300"}`}>
              {isOverBudget
                ? `${formatCurrency(totalSpent - limit)} over budget`
                : `${formatCurrency(remaining)} left`}
            </p>
          </div>
        </>
      )}
    </Card>
  );
};

export default BudgetOverview;
