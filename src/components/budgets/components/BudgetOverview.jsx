import { usePreferencesContext } from '../../../context/PreferencesContext';

const BudgetOverview = ({ 
  totalBudget, 
  remaining, 
  isOverBudget, 
  daysRemaining, 
  spent, 
  percentageUsed 
}) => {
  const { formatCurrency } = usePreferencesContext();
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-xl text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-indigo-100 text-sm font-medium">
            TOTAL MONTHLY BUDGET
          </p>
          <div className="flex items-center gap-3 mt-2">
            <h2 className="text-4xl font-bold">
              {formatCurrency(totalBudget)}
            </h2>
            <span className="text-sm text-indigo-200">
              (Sum of all categories)
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-indigo-100 text-sm font-medium">REMAINING</p>
          <h3
            className={`text-3xl font-bold mt-2 ${
              isOverBudget ? "text-red-200" : "text-white"
            }`}
          >
            {formatCurrency(Math.abs(remaining))}
          </h3>
          <p className="text-indigo-100 text-sm mt-1">
            {isOverBudget ? "Over budget" : `${daysRemaining} days left`}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-indigo-100">Spent: {formatCurrency(spent)}</span>
          <span className="text-indigo-100">
            {percentageUsed.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isOverBudget
                ? "bg-red-400"
                : percentageUsed > 80
                ? "bg-yellow-400"
                : "bg-green-400"
            }`}
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;