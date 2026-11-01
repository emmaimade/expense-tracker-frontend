import { usePreferencesContext } from '../../../context/PreferencesContext';
import Card from '../../../components/common/Card';

// Budgets belong to categories and the monthly budget is their total, so the card measures
// spending in budgeted categories; spending elsewhere is shown on its own line.
const BudgetOverview = ({ budgetData, onManageBudgets }) => {
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
    budgetedSpent,
    unbudgetedSpent,
    budgetLimit,
    totalRemaining,
    percentageUsed,
    isOverBudget
  } = budgetData;

  const totalSpent = Number(totalSpentThisMonth) || 0;
  const spentAgainstBudget = Number(budgetedSpent ?? totalSpentThisMonth) || 0;
  const outsideBudget = Number(unbudgetedSpent) || 0;
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

  const linkClass =
    "font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300";

  // No budgets yet: show this month's spending and invite them to set one
  if (!hasBudget) {
    return (
      <Card>
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Spent this month</h2>
        <p className="text-3xl sm:text-4xl font-bold mt-1 break-words text-gray-900 dark:text-gray-100">
          {formatCurrency(totalSpent)}
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          No budget set for this month.
          {onManageBudgets && (
            <>
              {' '}
              <button type="button" onClick={onManageBudgets} className={linkClass}>Set a budget</button>
            </>
          )}
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between mb-4 min-w-0">
        <div className="min-w-0">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Spent against your budget
          </h2>
          <p
            className={`text-3xl sm:text-4xl font-bold mt-1 break-words ${
              isOverBudget ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {formatCurrency(spentAgainstBudget)}
          </p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-right">
          of {formatCurrency(limit)} budget
        </p>
      </div>

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
            ? `${formatCurrency(Math.abs(remaining))} over budget`
            : `${formatCurrency(remaining)} left`}
        </p>
      </div>

      {/* Spending the category budgets don't cover */}
      {outsideBudget > 0 && (
        <p className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
          Plus {formatCurrency(outsideBudget)} in categories without a budget.
          {onManageBudgets && (
            <>
              {' '}
              <button type="button" onClick={onManageBudgets} className={linkClass}>Add a budget</button>
            </>
          )}
        </p>
      )}
    </Card>
  );
};

export default BudgetOverview;
