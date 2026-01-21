import { TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';
import { usePreferencesContext } from '../../../context/PreferencesContext';
import Card from '../../../components/common/Card';

const SmartInsights = ({
  projectedSpending,
  totalBudget,
  dailyAverage,
  daysInMonth,
  percentageUsed,
  isOverBudget,
  remaining,
}) => {
  const { formatCurrency } = usePreferencesContext();

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Smart Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projectedSpending > totalBudget && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-medium text-red-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Overspending Alert
            </h3>
            <p className="text-sm text-red-700 mt-2">
              At your current rate, you'll exceed your budget by {formatCurrency(projectedSpending - totalBudget)} this month.
            </p>
          </div>
        )}

        {dailyAverage > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Daily Spending
            </h3>
            <p className="text-sm text-blue-700 mt-2">
              You're spending an average of {formatCurrency(dailyAverage)} per day.
              To stay on budget, limit to {formatCurrency(totalBudget / daysInMonth)}
              /day.
            </p>
          </div>
        )}

        {percentageUsed < 80 && !isOverBudget && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-900 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Great Job!
            </h3>
            <p className="text-sm text-green-700 mt-2">
              You're managing your budget well. Keep tracking your expenses to
              maintain this pace.
            </p>
          </div>
        )}

        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="font-medium text-purple-900 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Savings Opportunity
          </h3>
          <p className="text-sm text-purple-700 mt-2">
            {remaining > 0
              ? `If you maintain this pace, you could save ${formatCurrency(remaining)} this month.`
              : "Review your recent expenses to find areas to cut back."}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SmartInsights;