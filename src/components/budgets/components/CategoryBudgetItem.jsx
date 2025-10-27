import { Edit2, Save, X, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';

const CategoryBudgetItem = ({
  category,
  categorySpent,
  isEditing,
  tempCategoryBudget,
  setTempCategoryBudget,
  handleSaveCategoryBudget,
  setIsEditingCategory,
  setEditingCategoryId,
  categoryIdForApi,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  if (!category || !(category.id || category._id)) return null;

  const amount = Number(category.amount ?? category.budget ?? 0);
  const categoryRemaining = amount - categorySpent;
  const categoryPercentage = amount > 0 ? (categorySpent / amount) * 100 : 0;
  
  const categoryName = 
    category?.categoryId?.name || 
    category?.category?.name || 
    category?.categoryName ||
    "Unknown Category";

  const getStatusColor = () => {
    if (categoryPercentage >= 100) return 'text-red-600 bg-red-50 border-red-200';
    if (categoryPercentage >= 80) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getProgressColor = () => {
    if (categoryPercentage >= 100) return 'bg-red-500';
    if (categoryPercentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-all">
      {/* Category Info - Mobile: Full width, Desktop: Fixed */}
      <div className="flex items-center justify-between sm:justify-start sm:min-w-[200px] sm:flex-1">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold ${getStatusColor()}`}>
            {categoryName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{categoryName}</h3>
            <p className="text-xs text-gray-500 sm:hidden">
              ${categorySpent.toFixed(0)} of ${amount.toLocaleString()}
            </p>
          </div>
        </div>
        
        {/* Mobile-only status badge */}
        <span className={`sm:hidden px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {categoryPercentage.toFixed(0)}%
        </span>
      </div>

      {/* Budget Amount - Desktop only */}
      <div className="hidden sm:flex items-center gap-2 min-w-[140px]">
        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-gray-600">$</span>
            <input
              type="number"
              value={tempCategoryBudget}
              onChange={(e) => setTempCategoryBudget(e.target.value)}
              className="w-24 px-2 py-1.5 text-sm border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <button
              onClick={() =>
                handleSaveCategoryBudget(
                  category.id || category._id, 
                  categoryIdForApi
                )
              }
              className="p-1.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              title="Save"
            >
              <Save className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setIsEditingCategory(false);
                setEditingCategoryId(null);
                setTempCategoryBudget("");
              }}
              className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group/budget">
            <span className="text-sm font-semibold text-gray-900">
              ${amount.toLocaleString()}
            </span>
            <button
              onClick={() => {
                setTempCategoryBudget(amount.toString());
                setIsEditingCategory(true);
                setEditingCategoryId(category.id || category._id);
              }}
              className="opacity-0 group-hover/budget:opacity-100 p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all"
              title="Edit budget"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Progress Section */}
      <div className="flex-1 min-w-0 sm:min-w-[200px] space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 hidden sm:inline">
            ${categorySpent.toFixed(0)} spent
          </span>
          <span className={`font-medium ${
            categoryRemaining < 0 ? 'text-red-600' : 'text-gray-700'
          }`}>
            ${Math.abs(categoryRemaining).toFixed(0)} {categoryRemaining < 0 ? 'over' : 'left'}
          </span>
        </div>
        <div className="relative w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{
              width: `${Math.min(categoryPercentage, 100)}%`,
            }}
          />
          {categoryPercentage > 100 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white drop-shadow">
                OVER
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Percentage - Desktop only */}
      <div className="hidden sm:flex items-center justify-center min-w-[60px]">
        <span className={`text-sm font-semibold ${
          categoryPercentage >= 100 ? 'text-red-600' :
          categoryPercentage >= 80 ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {categoryPercentage.toFixed(0)}%
        </span>
      </div>

      {/* Actions Menu */}
      <div className="relative hidden sm:block">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          title="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        
        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-8 z-20 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
              <button
                onClick={() => {
                  setTempCategoryBudget(amount.toString());
                  setIsEditingCategory(true);
                  setEditingCategoryId(category.id || category._id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Budget
              </button>
              {onDelete && (
                <button
                  onClick={() => {
                    if (window.confirm(`Delete budget for ${categoryName}?`)) {
                      onDelete(category.id || category._id);
                    }
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Budget
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryBudgetItem;