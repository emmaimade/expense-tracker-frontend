import { TrendingUp, TrendingDown } from 'lucide-react';
import { usePreferencesContext } from '../../../context/PreferencesContext';

const BudgetOverview = ({ budgetData }) => {
  const { formatCurrency } = usePreferencesContext();
  // ✅ Check if budgetData exists (loading state handled by parent)
  if (!budgetData) {
    return (
      <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
        <p className="text-indigo-600 font-medium">Loading Budget Data...</p>
      </div>
    );
  }

  // ✅ Destructure budget data from props
  const {
    totalSpentThisMonth,
    budgetLimit,
    totalRemaining,
    percentageUsed,
    isOverBudget
  } = budgetData;

  // ✅ Convert to numbers and provide defaults
  const totalSpent = Number(totalSpentThisMonth) || 0;
  const limit = Number(budgetLimit) || 0;
  const remaining = Number(totalRemaining) || 0;
  const percentage = Number(percentageUsed) || 0;
  
  // ✅ Handle case where budgetLimit might be 0
  const progressWidth = limit === 0 ? 0 : Math.min(percentage, 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Monthly Spending Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">This Month</h2>
          <div
            className={`p-2 rounded-lg ${
              isOverBudget ? "bg-red-100" : "bg-green-100"
            }`}
          >
            {isOverBudget ? (
              <TrendingUp className="w-5 h-5 text-red-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-green-600" />
            )}
          </div>
        </div>
        <p
          className={`text-2xl font-bold ${
            isOverBudget ? "text-red-600" : "text-gray-900"
          }`}
        >
          {formatCurrency(totalSpent)}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Total spent •{" "}
          {isOverBudget
            ? "Over budget"
            : `${formatCurrency(remaining)} remaining`}
        </p>
      </div>

      {/* Budget Progress */}
      <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            Monthly Budget Progress
          </h3>
          <span className="text-sm text-gray-600">
            {formatCurrency(totalSpent)} / {formatCurrency(limit)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${
              isOverBudget
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : percentage > 80
                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                : "bg-gradient-to-r from-indigo-500 to-indigo-600"
            }`}
            style={{
              width: `${progressWidth}%`,
            }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <p
            className={`text-sm font-medium ${
              isOverBudget
                ? "text-red-600"
                : percentage > 80
                ? "text-orange-600"
                : "text-indigo-600"
            }`}
          >
            {percentage.toFixed(1)}% of budget used
          </p>
          {isOverBudget && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
              Over Budget!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;