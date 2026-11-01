import { Pencil, Check, X, Trash2 } from 'lucide-react';
import { usePreferencesContext } from '../../../context/PreferencesContext';
import { useConfirm } from '../../../context/ConfirmContext';
import { getCategoryIcon } from '../../../utils/categoryIcons';
import { COLUMN } from './budgetColumns';

const iconButton =
  'p-2 rounded-lg text-gray-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-gray-500';

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
  const { formatCurrency, getCurrencySymbol } = usePreferencesContext();
  const confirm = useConfirm();

  if (!category || !(category.id || category._id)) return null;

  const budgetId = category.id || category._id;
  const amount = Number(category.amount ?? category.budget ?? 0);
  const categoryRemaining = amount - categorySpent;
  const categoryPercentage = amount > 0 ? (categorySpent / amount) * 100 : 0;
  const categoryName =
    category?.categoryId?.name ||
    category?.category?.name ||
    category?.categoryName ||
    "Unknown Category";
  const Icon = getCategoryIcon(categoryName);

  const tone =
    categoryPercentage >= 100
      ? { icon: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400', bar: 'bg-red-500 dark:bg-red-600', text: 'text-red-600 dark:text-red-400' }
      : categoryPercentage >= 80
      ? { icon: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400', bar: 'bg-amber-500 dark:bg-amber-600', text: 'text-amber-600 dark:text-amber-400' }
      : { icon: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400', bar: 'bg-green-500 dark:bg-green-600', text: 'text-green-600 dark:text-green-400' };

  const startEditing = () => {
    setTempCategoryBudget(amount.toString());
    setIsEditingCategory(true);
    setEditingCategoryId(budgetId);
  };

  const stopEditing = () => {
    setIsEditingCategory(false);
    setEditingCategoryId(null);
    setTempCategoryBudget("");
  };

  const save = () => handleSaveCategoryBudget(budgetId, categoryIdForApi);

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: `Delete budget for ${categoryName}?`,
      message: 'Your expenses in this category are kept — only the budget limit is removed.',
      confirmLabel: 'Delete budget',
      destructive: true,
    });
    if (confirmed) onDelete(budgetId);
  };

  return (
    <div className="relative flex flex-col gap-3 border-b border-gray-100 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:gap-4 dark:border-gray-700">
      {/* Category */}
      <div className="flex min-w-0 flex-1 items-center gap-3 pr-20 sm:pr-0">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone.icon}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{categoryName}</h3>
          <p className="text-xs text-gray-500 sm:hidden dark:text-gray-400">
            {formatCurrency(categorySpent)} of {formatCurrency(amount)} · {categoryPercentage.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Budget amount (inline edit) */}
      <div className={`${COLUMN.budget} ${isEditing ? 'flex' : 'hidden sm:flex'} items-center`}>
        {isEditing ? (
          <form
            className="flex w-full items-center gap-1.5"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <span className="text-sm text-gray-600 dark:text-gray-400">{getCurrencySymbol()}</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={tempCategoryBudget}
              onChange={(e) => setTempCategoryBudget(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && stopEditing()}
              aria-label={`Budget for ${categoryName}`}
              className="w-full min-w-0 rounded-lg border border-indigo-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:w-24 dark:border-indigo-600 dark:bg-gray-700 dark:text-gray-100"
              autoFocus
            />
            <button type="submit" className="rounded-lg bg-indigo-600 p-1.5 text-white hover:bg-indigo-700" aria-label="Save budget">
              <Check className="h-4 w-4" />
            </button>
            <button type="button" onClick={stopEditing} className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600" aria-label="Cancel">
              <X className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(amount)}</span>
        )}
      </div>

      {/* Progress */}
      <div className={`${COLUMN.progress} space-y-1.5`}>
        <div className="flex items-center justify-between text-xs">
          <span className="hidden text-gray-600 sm:inline dark:text-gray-400">{formatCurrency(categorySpent)} spent</span>
          <span className={`font-medium ${categoryRemaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {formatCurrency(Math.abs(categoryRemaining))} {categoryRemaining < 0 ? 'over' : 'left'}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div className={`h-2 rounded-full transition-all duration-500 ${tone.bar}`} style={{ width: `${Math.min(categoryPercentage, 100)}%` }} />
        </div>
      </div>

      {/* % used (desktop; mobile shows it under the name) */}
      <div className={`${COLUMN.percent} hidden sm:block sm:text-right`}>
        <span className={`text-sm font-semibold ${tone.text}`}>{categoryPercentage.toFixed(0)}%</span>
      </div>

      {/* Actions: always visible, not hover-only */}
      {!isEditing && (
        <div className={`${COLUMN.actions} absolute right-3 top-3 flex justify-end gap-0.5 sm:static`}>
          <button onClick={startEditing} className={`${iconButton} hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400`} aria-label={`Edit budget for ${categoryName}`} title="Edit budget">
            <Pencil className="h-4 w-4" />
          </button>
          {onDelete && (
            <button onClick={handleDelete} className={`${iconButton} hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400`} aria-label={`Delete budget for ${categoryName}`} title="Delete budget">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryBudgetItem;
