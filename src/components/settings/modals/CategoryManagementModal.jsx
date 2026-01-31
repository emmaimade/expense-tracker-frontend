import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingOverlay from '../../common/LoadingOverlay';
import { useCategories } from '../../expenses/hooks/useCategories'; 

const CategoryManagementModal = ({ isOpen, onClose, userId }) => {
  const { categories: allCategories, createCategory, updateCategory, deleteCategory, isLoading } = useCategories();
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // ✅ FIX: Handle null categories with useMemo
  const { defaultCategories, userCategories } = useMemo(() => {
    // Return empty arrays if categories haven't loaded yet
    if (!allCategories || allCategories === null) {
      return { 
        defaultCategories: [], 
        userCategories: [] 
      };
    }

    const defaultCats = allCategories.filter(
      (cat) => !cat.userId || cat.userId === null || cat.userId === ''
    );

    const userCats = allCategories.filter(
      (cat) => cat.userId && cat.userId === userId
    );

    return { 
      defaultCategories: defaultCats.sort((a, b) => (a.name || '').localeCompare(b.name || '')),
      userCategories: userCats.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    };
  }, [allCategories, userId]);

  const isEditable = (category) => {
    return category.userId && category.userId === userId;
  };
  
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty.');
      return;
    }
    try {
      await createCategory({ name: newCategoryName, userId: userId }); 
      toast.success(`Category "${newCategoryName}" created!`);
      setNewCategoryName('');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditCategory = async (category) => {
    if (!isEditable(category)) {
      toast.error('Error: Only custom categories can be edited.');
      return;
    }

    if (!editCategoryName.trim()) {
      toast.error('Category name cannot be empty.');
      return;
    }
    try {
      await updateCategory(category._id, { name: editCategoryName });
      toast.success(`Category "${category.name}" updated to "${editCategoryName}"!`);
      setEditingCategory(null);
      setEditCategoryName('');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!isEditable(category)) {
      toast.error('Error: Only custom categories can be deleted.');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete the category "${category.name}"? This will affect existing transactions.`)) {
      return;
    }

    try {
      await deleteCategory(category._id);
      toast.success(`Category "${category.name}" deleted!`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mt-10 p-6 transform transition-all">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Manage Categories
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Loading Overlay */}
        {isLoading && <LoadingOverlay />}

        {/* Add New Category Form */}
        <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <h3 className="text-md font-medium text-indigo-800 dark:text-indigo-300 mb-3">
            Add New Category
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={isLoading}
              aria-label="New category name"
              maxLength={50}
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
              aria-label="Add category"
            >
              {isLoading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        {/* Category List Section */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            All Categories
          </h3>

          {/* ✅ FIX: Show skeleton when categories is null (initial load) */}
          {allCategories === null || isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <ul className="space-y-3 divide-y divide-gray-200 dark:divide-gray-700">
                {/* DEFAULT CATEGORIES */}
                <li className="text-sm font-semibold text-gray-500 dark:text-gray-400 pt-1 pb-2">
                  Default System Categories
                </li>
                {(defaultCategories.length > 0
                  ? defaultCategories
                  : [{
                      _id: "no-default",
                      name: "No default categories available",
                      isPlaceholder: true,
                    }]
                ).map((category) => (
                  <li key={category._id} className="flex items-center justify-between py-3 opacity-75">
                    <span className="text-gray-700 dark:text-gray-300">
                      {category.name}
                      {!category.isPlaceholder && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-full">
                          Default
                        </span>
                      )}
                    </span>
                    <div className="flex gap-2">
                      <button className="text-gray-300 dark:text-gray-600 text-sm cursor-not-allowed" disabled>
                        Edit
                      </button>
                      <button className="text-gray-300 dark:text-gray-600 text-sm cursor-not-allowed" disabled>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}

                {/* USER CATEGORIES */}
                <li className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 pt-4 pb-2 border-t border-gray-300 dark:border-gray-600 mt-2">
                  Your Custom Categories
                </li>
                {(userCategories.length > 0
                  ? userCategories
                  : [{
                      _id: "no-custom",
                      name: "You have not created any custom categories.",
                      isPlaceholder: true,
                    }]
                ).map((category) => {
                  const isCurrentlyEditing = editingCategory && editingCategory._id === category._id;

                  if (category.isPlaceholder && userCategories.length > 0) return null;

                  return (
                    <li key={category._id} className={`flex items-center justify-between py-3 ${category.isPlaceholder ? "opacity-75" : ""}`}>
                      {isCurrentlyEditing ? (
                        <div className="flex flex-1 gap-2 items-center">
                          <input
                            type="text"
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                            className="flex-1 px-3 py-1 border border-indigo-300 dark:border-indigo-600 rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            disabled={isLoading}
                          />
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                            disabled={isLoading}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                            disabled={isLoading}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className={`text-gray-700 dark:text-gray-300 ${category.isPlaceholder ? "italic" : ""}`}>
                            {category.name}
                            {!category.isPlaceholder && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                                Custom
                              </span>
                            )}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingCategory(category);
                                setEditCategoryName(category.name);
                              }}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isLoading || category.isPlaceholder}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isLoading || category.isPlaceholder}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagementModal;