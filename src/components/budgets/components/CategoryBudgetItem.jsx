import { Edit2, Save, X, MoreVertical, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { usePreferencesContext } from '../../../context/PreferencesContext';

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
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
  const { formatCurrency, getCurrencySymbol } = usePreferencesContext();

  const amount = Number(category.amount ?? category.budget ?? 0);
  const categoryRemaining = amount - categorySpent;
  const categoryPercentage = amount > 0 ? (categorySpent / amount) * 100 : 0;
  
  const categoryName = 
    category?.categoryId?.name || 
    category?.category?.name || 
    category?.categoryName ||
    "Unknown Category";

  // Calculate dropdown position when menu opens
  useEffect(() => {
    if (showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right
      });
    }
  }, [showMenu]);

  if (!category || !(category.id || category._id)) return null;

  const getStatusColor = () => {
    if (categoryPercentage >= 100) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    if (categoryPercentage >= 80) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
  };

  const getProgressColor = () => {
    if (categoryPercentage >= 100) return 'bg-red-500 dark:bg-red-600';
    if (categoryPercentage >= 80) return 'bg-yellow-500 dark:bg-yellow-600';
    return 'bg-green-500 dark:bg-green-600';
  };

  const handleDelete = () => {
    if (window.confirm(`Delete budget for ${categoryName}?`)) {
      onDelete(category.id || category._id);
    }
  };

  return (
    <>
      <div className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all">
        {/* Category Info - Mobile: Full width, Desktop: Fixed */}
        <div className="flex items-center justify-between sm:justify-start sm:min-w-[200px] sm:flex-1">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold ${getStatusColor()}`}>
              {categoryName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{categoryName}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                {formatCurrency(categorySpent)} of {formatCurrency(amount)}
              </p>
            </div>
          </div>
          
          {/* Mobile-only action buttons */}
          <div className="sm:hidden flex items-center gap-2">
            <button
              onClick={() => {
                setTempCategoryBudget(amount.toString());
                setIsEditingCategory(true);
                setEditingCategoryId(category.id || category._id);
              }}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
              title="Edit budget"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                title="Delete budget"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Budget Amount - Desktop only */}
        <div className="hidden sm:flex items-center gap-2 min-w-[140px]">
          {isEditing ? (
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-600 dark:text-gray-400">{getCurrencySymbol()}</span>
              <input
                type="number"
                value={tempCategoryBudget}
                onChange={(e) => setTempCategoryBudget(e.target.value)}
                className="w-24 px-2 py-1.5 text-sm border border-indigo-300 dark:border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group/budget">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(amount)}
              </span>
              <button
                onClick={() => {
                  setTempCategoryBudget(amount.toString());
                  setIsEditingCategory(true);
                  setEditingCategoryId(category.id || category._id);
                }}
                className="opacity-0 group-hover/budget:opacity-100 p-1 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-all"
                title="Edit budget"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Edit Form - Shows when editing on mobile */}
        {isEditing && (
          <div className="sm:hidden flex flex-col gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{getCurrencySymbol()}</span>
              <input
                type="number"
                value={tempCategoryBudget}
                onChange={(e) => setTempCategoryBudget(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-indigo-300 dark:border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter budget"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleSaveCategoryBudget(
                    category.id || category._id, 
                    categoryIdForApi
                  )
                }
                className="flex-1 px-3 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingCategory(false);
                  setEditingCategoryId(null);
                  setTempCategoryBudget("");
                }}
                className="flex-1 px-3 py-2 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <div className="flex-1 min-w-0 sm:min-w-[200px] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400 hidden sm:inline">
              {formatCurrency(categorySpent)} spent
            </span>
            <span className={`font-medium ${
              categoryRemaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {formatCurrency(Math.abs(categoryRemaining))} {categoryRemaining < 0 ? 'over' : 'left'}
            </span>
          </div>
          <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
            categoryPercentage >= 100 ? 'text-red-600 dark:text-red-400' :
            categoryPercentage >= 80 ? 'text-yellow-600 dark:text-yellow-400' :
            'text-green-600 dark:text-green-400'
          }`}>
            {categoryPercentage.toFixed(0)}%
          </span>
        </div>

        {/* Actions Menu - Desktop only */}
        <div className="relative hidden sm:block">
          <button
            ref={buttonRef}
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all"
            title="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dropdown Menu Portal (outside overflow container) */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          <div 
            className="fixed z-50 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1"
            style={{
              top: `${menuPosition.top}px`,
              right: `${menuPosition.right}px`
            }}
          >
            <button
              onClick={() => {
                setTempCategoryBudget(amount.toString());
                setIsEditingCategory(true);
                setEditingCategoryId(category.id || category._id);
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Budget
            </button>
            {onDelete && (
              <button
                onClick={() => {
                  handleDelete();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Budget
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CategoryBudgetItem;

