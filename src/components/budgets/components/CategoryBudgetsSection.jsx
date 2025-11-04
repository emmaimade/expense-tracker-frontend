import { Plus } from 'lucide-react';
import AddCategoryForm from './AddCategoryForm';
import CategoryBudgetItem from './CategoryBudgetItem';

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Category Budgets
        </h2>
        <button
          onClick={() => setShowAddCategory(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Budget
        </button>
      </div>

      {/* Add Category Form */}
      {showAddCategory && (
        <div className="p-4 border-b border-gray-100">
          <AddCategoryForm
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            categories={categories}
            handleAddCategory={handleAddCategory}
            setShowAddCategory={setShowAddCategory}
          />
        </div>
      )}

      {/* Table Header */}
      {categoryBudgets.length > 0 && (
        <div className="hidden sm:flex items-center gap-4 px-3 py-2 bg-gray-50 border-b border-gray-100">
          {/* 1. Category Info: Matches sm:min-w-[200px] sm:flex-1 */}
          <div className="min-w-[200px] flex-1">
            <span className="text-xs font-medium text-gray-600 uppercase">
              Category
            </span>
          </div>

          {/* 2. Budget Amount: Matches min-w-[140px] */}
          <div className="min-w-[140px]">
            <span className="text-xs font-medium text-gray-600 uppercase">
              Budget
            </span>
          </div>

          {/* 3. Progress Section: Matches flex-1 sm:min-w-[200px] */}
          <div className="flex-1 min-w-[200px]">
            <span className="text-xs font-medium text-gray-600 uppercase">
              Spent / Remaining
            </span>
          </div>

          {/* 4. Percentage: Matches min-w-[60px] */}
          <div className="min-w-[60px] flex justify-center">
            <span className="text-xs font-medium text-gray-600 uppercase">
              % Used
            </span>
          </div>

          {/* 5. Actions Menu: Small, non-flex column for the MoreVertical button */}
          <div className="min-w-[20px]">
            {/* Empty space to reserve width for the actions button */}
          </div>
        </div>
      )}

      {/* Category List */}
      <div className="max-h-[500px] overflow-y-auto">
        {!categoryBudgets || categoryBudgets.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">No category budgets set yet.</p>
            <p className="text-xs mt-1 text-gray-400">
              Click "Add Budget" to create your first budget.
            </p>
          </div>
        ) : (
          categoryBudgets.map((category) => {
            if (!category || !(category.id || category._id)) {
              return null;
            }

            const categoryName =
              category.categoryId?.name ||
              category.category?.name ||
              category.categoryName ||
              "Unknown";

            const categoryIdForApi =
              category.categoryId?._id ||
              category.categoryId?.id ||
              category.category?._id ||
              category.category?.id ||
              category.categoryId ||
              category.category;

            const categorySpent = categorySpending[categoryIdForApi] || 0;

            const isEditing =
              isEditingCategory &&
              editingCategoryId === (category.id || category._id);

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