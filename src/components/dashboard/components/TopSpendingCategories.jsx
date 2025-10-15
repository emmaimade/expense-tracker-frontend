import { TrendingUp, ShoppingBag, Coffee, Home, Car, MoreHorizontal } from 'lucide-react';

const TopSpendingCategories = ({ transactions = [], onViewAnalytics }) => {
  // Calculate category totals from transactions
  const getCategoryBreakdown = () => {
    const categoryMap = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((acc, tx) => {
        const category = tx.category || 'Uncategorized';
        acc[category.name] = (acc[category.name] || 0) + Math.abs(tx.amount || 0);
        return acc;
      }, {});

    const total = Object.values(categoryMap).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(categoryMap)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Top 5 categories
  };

  const categories = getCategoryBreakdown();

  // Icon mapping for common categories
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Food': Coffee,
      'Shopping': ShoppingBag,
      'Transport': Car,
      'Housing': Home,
      'Entertainment': TrendingUp,
    };
    return iconMap[categoryName] || MoreHorizontal;
  };

  // Color mapping
  const getCategoryColor = (index) => {
    const colors = [
      { bg: 'bg-blue-100', text: 'text-blue-600', bar: 'bg-blue-600' },
      { bg: 'bg-purple-100', text: 'text-purple-600', bar: 'bg-purple-600' },
      { bg: 'bg-orange-100', text: 'text-orange-600', bar: 'bg-orange-600' },
      { bg: 'bg-green-100', text: 'text-green-600', bar: 'bg-green-600' },
      { bg: 'bg-pink-100', text: 'text-pink-600', bar: 'bg-pink-600' },
    ];
    return colors[index] || colors[0];
  };

  if (categories.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Top Spending Categories</h3>
        <div className="text-center py-8">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No expenses yet this month</p>
          <p className="text-gray-400 text-xs mt-1">Start tracking to see your breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Top Spending Categories</h3>
        <span className="text-xs text-gray-500">This Month</span>
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
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    ${category.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {category.percentage.toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${colors.bar} transition-all duration-500`}
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={onViewAnalytics} 
        className="w-full mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
      >
        View Full Breakdown →
      </button>
    </div>
  );
};

export default TopSpendingCategories;