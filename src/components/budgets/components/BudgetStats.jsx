import { DollarSign, TrendingUp, Target } from 'lucide-react';
import { usePreferencesContext } from '../../../context/PreferencesContext';

const BudgetStats = ({ 
  dailyAverage, 
  currentDay, 
  projectedSpending, 
  totalBudget, 
  percentageUsed, 
  isOverBudget 
}) => {
  const { formatCurrency } = usePreferencesContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Daily Average */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Daily Average</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(dailyAverage)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Based on day {currentDay}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Projected Total */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Projected Total</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(projectedSpending)}
            </p>
            <p
              className={`text-xs mt-1 ${
                projectedSpending > totalBudget
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {projectedSpending > totalBudget
                ? `${formatCurrency(projectedSpending - totalBudget)} over`
                : `${formatCurrency(totalBudget - projectedSpending)} under`}
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${
              projectedSpending > totalBudget ? "bg-red-100" : "bg-green-100"
            }`}
          >
            <Target
              className={`w-6 h-6 ${
                projectedSpending > totalBudget
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Budget Status */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Budget Status</p>
            <p
              className={`text-2xl font-bold mt-1 ${
                isOverBudget
                  ? "text-red-600"
                  : percentageUsed > 80
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {isOverBudget
                ? "Over Budget"
                : percentageUsed > 80
                ? "Warning"
                : "On Track"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {isOverBudget ? "Reduce spending" : "Keep it up!"}
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${
              isOverBudget
                ? "bg-red-100"
                : percentageUsed > 80
                ? "bg-yellow-100"
                : "bg-green-100"
            }`}
          >
            <DollarSign
              className={`w-6 h-6 ${
                isOverBudget
                  ? "text-red-600"
                  : percentageUsed > 80
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetStats;