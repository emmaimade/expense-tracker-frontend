import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingOverlay from '../../common/LoadingOverlay';
import { useCategories } from '../../expenses/hooks/useCategories'; 

// Component now accepts userId
const CategoryManagementModal = ({ isOpen, onClose, userId }) => {
  // Renamed categories to allCategories for clarity inside the component
  const { categories: allCategories, createCategory, updateCategory, deleteCategory, loading } = useCategories();
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // 1. Use useMemo to split categories into Default and User-Created lists
  const { defaultCategories, userCategories } = useMemo(() => {
    const defaultCats = allCategories.filter(
      // A category is default if it does NOT have a userId property or it's empty
      (cat) => !cat.userId || cat.userId === null || cat.userId === ''
    );

    const userCats = allCategories.filter(
      // A category is user-created (non-default) if its userId matches the current user's ID
      (cat) => cat.userId && cat.userId === userId
    );

    // Sort both lists alphabetically for better UX
    return { 
        defaultCategories: defaultCats.sort((a, b) => (a.name || '').localeCompare(b.name || '')),
        userCategories: userCats.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    };
  }, [allCategories, userId]);

  // 2. Simplified isEditable check (used mainly for handlers as the lists are already separated in the UI)
  const isEditable = (category) => {
      return category.userId && category.userId === userId;
  };
  
  // --- HANDLERS ---
  
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty.');
      return;
    }
    // New categories MUST be created with the userId
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
    // Outer scrollable container
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mt-10 p-6 transform transition-all">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <h2
            className="text-xl font-semibold text-gray-900"
            id="category-modal-title"
          >
            Manage Categories
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Loading Overlay */}
        {loading && <LoadingOverlay />}

        {/* Add New Category Form */}
        <div className="mt-4 p-4 rounded-lg">
          <h3 className="text-md font-medium text-indigo-800 mb-3">
            Add New Category
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
              aria-label="New category name"
              maxLength={50}
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              disabled={loading}
              aria-label="Add category"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        {/* 3. Category List Section (Scrollable Container) */}
        <div className="mt-6">
          <h3
            className="text-lg font-medium text-gray-900 mb-4"
            role="heading"
            aria-level="3"
          >
            All Categories
          </h3>

          {loading ? (
            <p className="text-gray-500">Loading categories...</p>
          ) : (
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-3">
              <ul className="space-y-3 divide-y divide-gray-200">
                {/* --- DEFAULT CATEGORIES (Not Editable/Deletable) --- */}
                <li className="text-sm font-semibold text-gray-500 pt-1 pb-2">
                  Default System Categories
                </li>
                {(defaultCategories.length > 0
                  ? defaultCategories
                  : [
                      {
                        _id: "no-default",
                        name: "No default categories available",
                        isPlaceholder: true,
                      },
                    ]
                ).map((category) => (
                  <li
                    key={category._id}
                    className="flex items-center justify-between py-3 opacity-75"
                  >
                    <span className="text-gray-700">
                      {category.name}
                      {/* Only show label if it's a real category */}
                      {!category.isPlaceholder && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-200 rounded-full">
                          Default
                        </span>
                      )}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="text-indigo-300 text-sm disabled:cursor-not-allowed"
                        disabled={true}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-300 text-sm disabled:cursor-not-allowed"
                        disabled={true}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}

                {/* --- USER-CREATED CATEGORIES (Editable/Deletable) --- */}
                <li className="text-sm font-semibold text-indigo-700 pt-4 pb-2 border-t border-gray-300 mt-2">
                  Your Custom Categories
                </li>
                {(userCategories.length > 0
                  ? userCategories
                  : [
                      {
                        _id: "no-custom",
                        name: "You have not created any custom categories.",
                        isPlaceholder: true,
                      },
                    ]
                ).map((category) => {
                  const isCurrentlyEditing =
                    editingCategory && editingCategory._id === category._id;

                  // Skip rendering the placeholder if there are actual custom categories
                  if (category.isPlaceholder && userCategories.length > 0)
                    return null;

                  return (
                    <li
                      key={category._id}
                      className={`flex items-center justify-between py-3 ${
                        category.isPlaceholder ? "opacity-75" : ""
                      }`}
                    >
                      {isCurrentlyEditing ? (
                        // 4. Editing UI (Only for user-created categories)
                        <div className="flex flex-1 gap-2 items-center">
                          <input
                            type="text"
                            value={editCategoryName}
                            onChange={(e) =>
                              setEditCategoryName(e.target.value)
                            }
                            className="flex-1 px-3 py-1 border border-indigo-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                            disabled={loading}
                          />
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                            disabled={loading}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        // 5. Display UI with Editable/Deletable buttons
                        <>
                          <span
                            className={`text-gray-700 ${
                              category.isPlaceholder ? "italic" : ""
                            }`}
                          >
                            {category.name}
                            {/* Show the Custom label only for real categories */}
                            {!category.isPlaceholder && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">
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
                              className="text-indigo-600 hover:text-indigo-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={loading || category.isPlaceholder}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category)}
                              className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={loading || category.isPlaceholder}
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