import { ShoppingBag } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { usePreferencesContext } from '../../../context/PreferencesContext';
import Card from '../../../components/common/Card';
import SectionLink from './SectionLink';
import { getCategoryIcon } from '../../../utils/categoryIcons';

const TopSpendingCategories = ({ transactions = [], onViewAnalytics }) => {
  // Helper: Check if a date is in the current month
  const isCurrentMonth = (date) => {
    if (!date) return false;
    const transactionDate = new Date(date);
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
  };

  // Filter and calculate category totals for CURRENT MONTH only
  const getCategoryBreakdown = () => {
    const currentMonthExpenses = transactions.filter(tx =>
      tx.type === 'expense' &&
      isCurrentMonth(tx.date) // Only current month
    );

    const categoryMap = currentMonthExpenses.reduce((acc, tx) => {
      const category = tx.category || { name: 'Uncategorized' };
      const amount = Math.abs(tx.amount || 0);
      acc[category.name] = (acc[category.name] || 0) + amount;
      return acc;
    }, {});

    const total = Object.values(categoryMap).reduce((sum, amt) => sum + amt, 0);

    return Object.entries(categoryMap)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  const categories = getCategoryBreakdown();
  const { formatCurrency } = usePreferencesContext();

  // Color helper
  const getCategoryColor = (index) => {
    const colors = [
      { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', bar: 'bg-blue-600 dark:bg-blue-500' },
      { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', bar: 'bg-purple-600 dark:bg-purple-500' },
      { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', bar: 'bg-orange-600 dark:bg-orange-500' },
      { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', bar: 'bg-green-600 dark:bg-green-500' },
      { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400', bar: 'bg-pink-600 dark:bg-pink-500' },
    ];
    return colors[index] || colors[0];
  };

  // Empty state
  if (categories.length === 0) {
    return (
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-100">Top Spending Categories</h3>
        <div className="text-center py-8">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3 dark:text-gray-500" />
          <p className="text-gray-500 text-sm dark:text-gray-400">No expenses yet this month</p>
          <p className="text-gray-400 text-xs mt-1 dark:text-gray-500">Start tracking to see your breakdown</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Top Spending Categories</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
        </div>
        <SectionLink onClick={onViewAnalytics}>Full breakdown</SectionLink>
      </div>
      
      <div className="space-y-3">
        {categories.map((category, index) => {
          const Icon = getCategoryIcon(category.name);
          const colors = getCategoryColor(index);
          
          return (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(category.amount)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {category.percentage.toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${colors.bar} transition-all duration-500`}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default TopSpendingCategories;

