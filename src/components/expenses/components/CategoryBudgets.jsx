const CategoryBudgets = ({ categoryData = [], budgets = {} }) => {
  // Default budgets if none provided
  const defaultBudgets = {
    Food: 500,
    Transportation: 300,
    Leisure: 200,
    Electronics: 400,
    Utilities: 250,
    Clothing: 200,
    Health: 300,
    Education: 150,
    Others: 200
  };
  
  const activeBudgets = Object.keys(budgets).length > 0 ? budgets : defaultBudgets;

  // Create combined data from categoryData and budgets
  // Include all categories that have either spending or budgets
  const allCategories = new Set([
    ...Object.keys(activeBudgets),
    ...categoryData.map(cat => cat.name)
  ]);

  const combinedData = Array.from(allCategories).map(categoryName => {
    const categorySpending = Array.isArray(categoryData) 
      ? categoryData.find(cat => cat.name === categoryName) 
      : null;
    const spent = categorySpending ? categorySpending.value : 0;
    const budget = activeBudgets[categoryName] || 0;
    const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
    const remaining = Math.max(budget - spent, 0);
    
    return {
      name: categoryName,
      spent,
      budget,
      percentage,
      remaining,
      isOverBudget: spent > budget && budget > 0
    };
  }).filter(category => category.budget > 0 || category.spent > 0); // Only show categories with budget or spending

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Category Budgets
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {combinedData.length > 0 ? (
          combinedData.map((category) => (
            <div
              key={category.name}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">
                  {category.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    ${category.spent.toFixed(0)} / ${category.budget}
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    category.isOverBudget 
                      ? "bg-red-500" 
                      : category.percentage > 80 
                        ? "bg-yellow-500" 
                        : "bg-indigo-600"
                  }`}
                  style={{ width: `${Math.min(category.percentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className={`font-medium ${
                  category.isOverBudget ? "text-red-600" : "text-gray-500"
                }`}>
                  {category.percentage.toFixed(0)}% used
                </span>
                <span className={`${
                  category.isOverBudget ? "text-red-600" : "text-green-600"
                }`}>
                  {category.isOverBudget 
                    ? `$${(category.spent - category.budget).toFixed(0)} over`
                    : `$${category.remaining.toFixed(0)} left`
                  }
                </span>
              </div>
              
              {category.isOverBudget && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  Over budget! Consider reviewing your spending in this category.
                </div>
              )}
              
              {category.budget === 0 && category.spent > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                  No budget set for this category. Set a budget in Analytics to track progress.
                </div>
              )}
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
      {combinedData.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ${combinedData.reduce((sum, cat) => sum + cat.budget, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Budget</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                ${combinedData.reduce((sum, cat) => sum + cat.spent, 0).toFixed(0)}
              </p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                ${combinedData.reduce((sum, cat) => sum + cat.remaining, 0).toFixed(0)}
              </p>
              <p className="text-sm text-gray-600">Total Remaining</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryBudgets;