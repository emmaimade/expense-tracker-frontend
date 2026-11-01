import { Plus } from 'lucide-react';
import AddCategoryForm from './AddCategoryForm';
import CategoryBudgetItem from './CategoryBudgetItem';
import { COLUMN } from './budgetColumns';

const CategoryBudgetsSection = ({
  categoryBudgets,
  categorySpending,
  showAddCategory,
  setShowAddCategory,
  newCategory,
  setNewCategory,
  categories,
  handleAddCategory,
  isEditingCategory,
  editingCategoryId,
  tempCategoryBudget,
  setTempCategoryBudget,
  setIsEditingCategory,
  setEditingCategoryId,
  handleSaveCategoryBudget,
  handleDeleteBudget,
}) => {
  return (
    <div id="category-budgets" className="scroll-mt-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-6 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Category Budgets
        </h2>
        <button
          onClick={() => setShowAddCategory(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add budget
        </button>
      </div>

      {/* Add Category Form */}
      {showAddCategory && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <AddCategoryForm
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            categories={categories}
            handleAddCategory={handleAddCategory}
            setShowAddCategory={setShowAddCategory}
          />
        </div>
      )}

      {/* Table header: same column widths as the rows (budgetColumns.js) */}
      {categoryBudgets && categoryBudgets.length > 0 && (
        <div className="hidden sm:flex items-center gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
          <div className="flex-1">Category</div>
          <div className={COLUMN.budget}>Budget</div>
          <div className={COLUMN.progress}>Spent / remaining</div>
          <div className={`${COLUMN.percent} text-right`}>% used</div>
          <div className={`${COLUMN.actions} text-right`}>
            <span className="sr-only">Actions</span>
          </div>
        </div>
      )}

      {/* Category List */}
      <div className="max-h-[500px] overflow-y-auto">
        {!categoryBudgets || categoryBudgets.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No category budgets set yet.</p>
            <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">
              Use &ldquo;Add budget&rdquo; to set your first one.
            </p>
          </div>
        ) : (
          categoryBudgets.map((category) => {
            if (!category || !(category.id || category._id)) {
              return null;
            }

            const categoryIdForApi =
              category.categoryId?._id ||
              category.categoryId?.id ||
              category.category?._id ||
              category.category?.id ||
              category.categoryId ||
              category.category;

            const categorySpent = categorySpending[categoryIdForApi] || 0;
            const isEditing = isEditingCategory && editingCategoryId === (category.id || category._id);

            return (
              <CategoryBudgetItem
                key={category.id || category._id}
                category={category}
                categorySpent={categorySpent}
                isEditing={isEditing}
                tempCategoryBudget={tempCategoryBudget}
                setTempCategoryBudget={setTempCategoryBudget}
                handleSaveCategoryBudget={handleSaveCategoryBudget}
                setIsEditingCategory={setIsEditingCategory}
                setEditingCategoryId={setEditingCategoryId}
                categoryIdForApi={categoryIdForApi}
                onDelete={handleDeleteBudget}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default CategoryBudgetsSection;
