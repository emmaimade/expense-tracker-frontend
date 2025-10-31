import PropTypes from 'prop-types';

const CategoryBudgets = ({ categoryData = [], categoryBudgets = [], isLoading = false, setActiveTab }) => {
  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  // If no budgets are set, prompt user to set them
  if (!categoryBudgets || categoryBudgets.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
          <span className="text-3xl">📊</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Budgets Set Yet
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Set up category budgets to track your spending and get insights on where your money goes.
        </p>
        <button
          onClick={() => setActiveTab?.('budgets')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Set Up Budgets
        </button>
      </div>
    );
  }

  // Create spending map from categoryData
  const spendingMap = {};
  categoryData.forEach(cat => {
    spendingMap[cat.name] = cat.value;
  });

  // Combine budget data with spending
  const combinedData = categoryBudgets.map(budget => {
    const categoryName = budget?.categoryId?.name || budget?.category?.name || 'Unknown';
    const budgetAmount = Number(budget.amount ?? budget.budget ?? 0);
    const spent = budget?.spent
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

  // Sort by spending descending
  const sortedData = combinedData.sort((a, b) => b.spent - a.spent);

  // Calculate totals
  const totalBudget = sortedData.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = sortedData.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = sortedData.reduce((sum, cat) => sum + cat.remaining, 0);

  const getCurrentMonth = () => {
    const currentDate = new Date();

    // Get the full month name (e.g., "October")
    const currentMonthInWords = currentDate.toLocaleString("default", {
      month: "long",
    });
    return currentMonthInWords;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Category Budget Performance For {getCurrentMonth()}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {sortedData.length} {sortedData.length === 1 ? 'category' : 'categories'} tracked
          </p>
        </div>
        {setActiveTab && (
          <button
            onClick={() => setActiveTab('budgets')}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
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
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all hover:border-indigo-300"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ${category.spent.toFixed(0)} of ${category.budget.toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  category.isOverBudget 
                    ? "bg-red-100 text-red-700" 
                    : category.percentage > 80 
                      ? "bg-yellow-100 text-yellow-700" 
                      : "bg-green-100 text-green-700"
                }`}>
                  {category.percentage.toFixed(0)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    category.isOverBudget 
                      ? "bg-red-500" 
                      : category.percentage > 80 
                        ? "bg-yellow-500" 
                        : "bg-indigo-600"
                  }`}
                  style={{ width: `${Math.min(category.percentage, 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-xs font-medium ${
                  category.isOverBudget ? "text-red-600" : "text-green-600"
                }`}>
                  {category.isOverBudget 
                    ? `$${(category.spent - category.budget).toFixed(0)} over`
                    : `$${category.remaining.toFixed(0)} left`
                  }
                </span>
                {category.isOverBudget && (
                  <span className="text-xs text-red-600 font-medium">⚠️ Over</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">
              No category data available. Start adding expenses to see budget tracking.
            </p>
          </div>
        )}
      </div>

      {/* Budget Summary */}
      {sortedData.length > 0 && (
        <div className="pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalBudget.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-red-600">
                ${totalSpent.toFixed(0)}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Remaining</p>
              <p className="text-2xl font-bold text-green-600">
                ${totalRemaining.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CategoryBudgets.propTypes = {
  categoryData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    })
  ),
  categoryBudgets: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.string,
      categoryId: PropTypes.shape({
        name: PropTypes.string,
      }),
      category: PropTypes.shape({
        name: PropTypes.string,
      }),
      amount: PropTypes.number,
      budget: PropTypes.number,
    })
  ),
  isLoading: PropTypes.bool,
  setActiveTab: PropTypes.func,
};

export default CategoryBudgets;