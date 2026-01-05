import { useState, useEffect, useMemo } from 'react';
import { X, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCategories } from '../hooks/useCategories';
import { usePreferencesContext } from '../../../context/PreferencesContext';

const EditExpenseModal = ({ isOpen, onClose, onSubmit, transaction, loading, userId }) => {
  const { categories: allCategories, createCategory, refreshCategories } = useCategories();
  
  // Filter to show BOTH default categories (no userId) AND user's own categories
  const categories = useMemo(() => {
    const filtered = allCategories.filter(cat => {
      const isDefaultCategory = !cat.userId || cat.userId === null || cat.userId === '';
      const isUserCategory = userId && cat.userId === userId;
      return isDefaultCategory || isUserCategory;
    });
    
    // Sort alphabetically (mixed default + custom)
    return filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [allCategories, userId]);
  
  const [expenseData, setExpenseData] = useState({
    name: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState(null);

  useEffect(() => {
    if (transaction) {
      setExpenseData({
        name: transaction.name || '',
        category: transaction.category?._id || transaction.category || '',
        amount: Math.abs(transaction.amount).toString() || '',
        date: transaction.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
      });
    }
  }, [transaction]);

  const { getCurrencySymbol } = usePreferencesContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expenseData.name || !expenseData.category || !expenseData.amount || parseFloat(expenseData.amount) <= 0) {
      toast.error('Please fill all required fields with valid values.');
      return;
    }
    
    // Transaction ID can be either _id or id
    const transactionId = transaction?._id || transaction?.id;
    
    if (!transactionId) {
      console.error('Transaction object:', transaction);
      toast.error('Invalid transaction ID.');
      return;
    }
    
    await onSubmit(expenseData, transactionId);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setCategoryError("Category name cannot be empty.");
      return;
    }

    if (
      categories.some(
        (cat) => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
      )
    ) {
      setCategoryError("Category already exists.");
      return;
    }

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    try {
      // createCategory returns the category object directly from useCategories
      const newCategory = await createCategory({
        name: newCategoryName.trim(),
        userId: userId,
      });

      console.log("Created new category:", newCategory);

      // The returned category should have _id and name properties
      const categoryId = newCategory._id || newCategory.id;
      const categoryName = newCategory.name;

      if (!categoryId) {
        throw new Error("Category created but no ID returned");
      }

      // Refresh categories list
      await refreshCategories();

      // Set the newly created category as selected
      setExpenseData({ ...expenseData, category: categoryId });
      setNewCategoryName("");
      setCategoryError(null);
      setIsAddingCategory(false);
      toast.success(`Category "${categoryName}" created!`);
    } catch (error) {
      console.error("Error creating category:", error);
      setCategoryError(error.message || "Failed to create category.");
      toast.error(error.message || "Failed to create category.");
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-900">Edit Expense</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              required
              value={expenseData.name}
              onChange={(e) => setExpenseData({ ...expenseData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Grocery shopping"
              disabled={loading}
            />
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              {!isAddingCategory && (
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  New Category
                </button>
              )}
            </div>

            {isAddingCategory ? (
              // Inline category creation
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    setCategoryError(null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Category name"
                  autoFocus
                />
                {categoryError && (
                  <p className="text-xs text-red-600">{categoryError}</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                    disabled={loading}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryName('');
                      setCategoryError(null);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Standard dropdown
              <select
                required
                value={expenseData.category}
                onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
            
            {/* Helper text */}
            {!isAddingCategory && categories.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {categories.length} categories available
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {getCurrencySymbol()}
              </span>
              <input
                type="number"
                required
                step="0.01"
                min="0.01"
                value={expenseData.amount}
                onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
                disabled={loading}
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              required
              value={expenseData.date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;