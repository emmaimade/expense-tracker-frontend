import { usePreferencesContext } from '../../../context/PreferencesContext';

const AddCategoryForm = ({
  newCategory,
  setNewCategory,
  categories,
  handleAddCategory,
  setShowAddCategory,
}) => {
  const { formatCurrency, getCurrencySymbol } = usePreferencesContext();
  const currencySymbol = getCurrencySymbol();

  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3">
      <h3 className="text-xs font-medium text-indigo-800 dark:text-indigo-200 mb-2">
        Add New Category Budget
      </h3>
      <div className="flex items-center gap-2">
        <select
          value={newCategory.categoryId}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedCategory = categories.find(
              (cat) => cat._id === selectedId
            );
            setNewCategory({
              ...newCategory,
              categoryId: selectedId,
              name: selectedCategory?.name || "",
            });
          }}
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="relative w-32">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
            {currencySymbol}
          </span>
          <input
            type="number"
            placeholder="Amount"
            value={newCategory.amount}
            onChange={(e) =>
              setNewCategory({ ...newCategory, amount: e.target.value })
            }
            className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <button
          onClick={handleAddCategory}
          className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          Save
        </button>

        <button
          onClick={() => {
            setShowAddCategory(false);
            setNewCategory({ categoryId: "", name: "", amount: "" });
          }}
          className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddCategoryForm;