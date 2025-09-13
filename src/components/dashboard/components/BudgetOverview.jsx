import { TrendingUp, TrendingDown } from 'lucide-react';

const BudgetOverview = ({ totalSpentThisMonth, budgetLimit = 4000 }) => {
  const budgetPercentage = (parseFloat(totalSpentThisMonth || '0') / budgetLimit) * 100;
  const remainingBudget = budgetLimit - parseFloat(totalSpentThisMonth || '0');
  const isOverBudget = budgetPercentage > 100;

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
          ${totalSpentThisMonth}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Total spent •{" "}
          {isOverBudget
            ? "Over budget"
            : `$${remainingBudget.toFixed(2)} remaining`}
        </p>
      </div>

      {/* Budget Progress */}
      <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            Monthly Budget Progress
          </h3>
          <span className="text-sm text-gray-600">
            ${totalSpentThisMonth} / ${budgetLimit.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${
              isOverBudget
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : budgetPercentage > 80
                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                : "bg-gradient-to-r from-indigo-500 to-indigo-600"
            }`}
            style={{
              width: `${Math.min(budgetPercentage, 100)}%`,
            }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <p
            className={`text-sm font-medium ${
              isOverBudget
                ? "text-red-600"
                : budgetPercentage > 80
                ? "text-orange-600"
                : "text-indigo-600"
            }`}
          >
            {budgetPercentage.toFixed(1)}% of budget used
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