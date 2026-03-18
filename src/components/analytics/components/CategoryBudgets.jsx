import PropTypes from 'prop-types';
import { usePreferencesContext } from '../../../context/PreferencesContext';
import Card from '../../../components/common/Card';

const CategoryBudgets = ({ categoryData = [], categoryBudgets = [], isLoading = false, setActiveTab }) => {
  const { formatCurrency } = usePreferencesContext();

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
        </div>
      </Card>
    );
  }

  if (!categoryBudgets || categoryBudgets.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center">
          <span className="text-3xl">📊</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No Budgets Set Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Set up category budgets to track your spending and get insights on where your money goes.
        </p>
        <button
          onClick={() => setActiveTab('budgets')}
          className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors font-medium"
        >
          Set Up Budgets
        </button>
      </Card>
    );
  }

  const spendingMap = {};
  categoryData.forEach(cat => {
    spendingMap[cat.name] = cat.value;
  });

  const combinedData = categoryBudgets.map(budget => {
    const categoryName = budget?.categoryId?.name || budget?.category?.name || 'Unknown';
    const budgetAmount = Number(budget.amount ?? budget.budget ?? 0);
    const spent = budget?.spent;
    const percentage = budgetAmount > 0 ? Math.min((budget?.percentageUsed), 100) : 0;
    const remaining = Math.max(budget?.remaining, 0);
    const isOverBudget = budget?.isOverBudget;

    return {
      id: budget._id || budget.id,
      name: categoryName,
      spent,
      budget: budgetAmount,
      percentage,
      remaining,
      isOverBudget,
    };
  }).filter(category => category.budget > 0 || category.spent > 0);

  const sortedData = combinedData.sort((a, b) => b.spent - a.spent);

  const totalBudget = sortedData.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = sortedData.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = sortedData.reduce((sum, cat) => sum + cat.remaining, 0);

  const getCurrentMonth = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Category Budget Performance For {getCurrentMonth()}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {sortedData.length} {sortedData.length === 1 ? 'category' : 'categories'} tracked
          </p>
        </div>
        {setActiveTab && (
          <button
            onClick={() => setActiveTab('budgets')}
            className="self-start sm:self-auto text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
          >
            Manage Budgets →
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {sortedData.length > 0 ? (
          sortedData.map((category) => (
            <div
              key={category.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all hover:border-indigo-300 dark:hover:border-indigo-600 dark:bg-gray-800/50"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatCurrency(category.spent)} of {formatCurrency(category.budget)}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  category.isOverBudget
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                    : category.percentage > 80
                      ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'
                      : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                }`}>
                  {category.percentage.toFixed(0)}%
                </span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    category.isOverBudget
                      ? 'bg-red-500'
                      : category.percentage > 80
                        ? 'bg-yellow-500'
                        : 'bg-indigo-600 dark:bg-indigo-500'
                  }`}
                  style={{ width: `${Math.min(category.percentage, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className={`text-xs font-medium ${
                  category.isOverBudget
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {category.isOverBudget
                    ? `${formatCurrency(category.spent - category.budget)} over`
                    : `${formatCurrency(category.remaining)} left`
                  }
                </span>
                {category.isOverBudget && (
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">⚠️ Over</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No category data available. Start adding expenses to see budget tracking.
            </p>
          </div>
        )}
      </div>

      {sortedData.length > 0 && (
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalBudget)}
              </p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalRemaining)}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

CategoryBudgets.propTypes = {
  categoryData: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, value: PropTypes.number })),
  categoryBudgets: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string, id: PropTypes.string,
    categoryId: PropTypes.shape({ name: PropTypes.string }),
    category: PropTypes.shape({ name: PropTypes.string }),
    amount: PropTypes.number, budget: PropTypes.number,
  })),
  isLoading: PropTypes.bool,
  setActiveTab: PropTypes.func,
};

export default CategoryBudgets;
