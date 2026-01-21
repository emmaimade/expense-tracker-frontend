import { useMemo } from 'react';
import EmptyState from './EmptyState';
import { usePreferencesContext } from '../../../context/PreferencesContext';
import Card from '../../../components/common/Card';

const RecentActivity = ({ weeklyTransactions = [], onViewAllExpenses, onAddExpense, fallbackUsed = false }) => {
  const activityData = useMemo(() => {
    // Ensure weeklyTransactions is always an array
    const safeTransactions = Array.isArray(weeklyTransactions) ? weeklyTransactions : [];

    // Calculate last expense
    const lastExpense = safeTransactions
      .filter(tx => tx && tx.type === 'expense')
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0] || { name: 'N/A', amount: 0 };

    // Calculate largest expense
    const largestExpense = safeTransactions
      .filter(tx => tx && tx.type === 'expense')
      .reduce((max, tx) => {
        const maxAmount = Math.abs(max.amount || 0);
        const txAmount = Math.abs(tx.amount || 0);
        return txAmount > maxAmount ? tx : max;
      }, { name: 'N/A', amount: 0 });

    // Calculate most frequent category
    const mostFrequentCategory = (() => {
      try {
        const categoryCount = safeTransactions
          .filter(tx => tx && tx.type === 'expense' && tx.category)
          .reduce((acc, tx) => {
            acc[tx.category.name] = (acc[tx.category.name] || 0) + 1;
            return acc;
          }, {});

        const sortedCategories = Object.entries(categoryCount)
          .sort(([, a], [, b]) => b - a);

        return sortedCategories.length > 0 ? sortedCategories[0][0] : 'N/A';
      } catch (error) {
        console.error('Error calculating most frequent category:', error);
        return 'N/A';
      }
    })();

    return {
      lastExpense,
      largestExpense,
      mostFrequentCategory,
      hasData: safeTransactions.length > 0
    };
  }, [weeklyTransactions]);

  // Show empty state if no data
  if (!activityData.hasData) {
    return (
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <EmptyState 
          type="recent-activity"
          onAddExpense={onAddExpense}
          onViewAllTime={onViewAllExpenses}
        />
      </Card>
    );
  }

  const { formatCurrency } = usePreferencesContext();

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        {fallbackUsed && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            Recent data
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Last expense</span>
          <span className="font-medium text-gray-900">
            {activityData.lastExpense.name} - {formatCurrency(Math.abs(activityData.lastExpense.amount || 0))}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Largest expense</span>
          <span className="font-medium text-gray-900">
            {activityData.largestExpense.name} - {formatCurrency(Math.abs(activityData.largestExpense.amount || 0))}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Most frequent category</span>
          <span className="font-medium text-gray-900">{activityData.mostFrequentCategory}</span>
        </div>
      </div>
      
      <button 
        onClick={onViewAllExpenses}
        className="w-full mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
      >
        View All Transactions →
      </button>
    </Card>
  );
};

export default RecentActivity;