import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useConfirm } from '../../../context/ConfirmContext';
import { useCategories } from '../../expenses/hooks/useCategories';
import Card from '../../common/Card';
import { Skeleton } from '../../common/Skeletons';

const inputClass =
  'flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-60';

const iconButtonClass =
  'p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

const CategoriesSection = ({ userId }) => {
  const confirm = useConfirm();
  const { categories, createCategory, updateCategory, deleteCategory, isLoading } = useCategories();

  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [busyId, setBusyId] = useState(null);

  const { defaultCategories, userCategories } = useMemo(() => {
    const list = categories || [];
    const byName = (a, b) => (a.name || '').localeCompare(b.name || '');
    return {
      defaultCategories: list.filter((cat) => !cat.userId).sort(byName),
      userCategories: list.filter((cat) => cat.userId && cat.userId === userId).sort(byName),
    };
  }, [categories, userId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) {
      toast.error('Category name cannot be empty.');
      return;
    }
    setIsAdding(true);
    try {
      await createCategory({ name, userId });
      toast.success(`Category "${name}" created!`);
      setNewName('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const startEditing = (category) => {
    setEditingId(category._id);
    setEditName(category.name);
  };

  const handleSaveEdit = async (category) => {
    const name = editName.trim();
    if (!name) {
      toast.error('Category name cannot be empty.');
      return;
    }
    if (name === category.name) {
      setEditingId(null);
      return;
    }
    setBusyId(category._id);
    try {
      await updateCategory(category._id, { name });
      toast.success(`Category "${category.name}" renamed to "${name}"!`);
      setEditingId(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = await confirm({
      title: `Delete "${category.name}"?`,
      message: 'This will affect existing transactions in this category.',
      confirmLabel: 'Delete category',
      destructive: true,
    });
    if (!confirmed) return;

    setBusyId(category._id);
    try {
      await deleteCategory(category._id);
      toast.success(`Category "${category.name}" deleted!`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusyId(null);
    }
  };

  const isInitialLoad = isLoading && categories === null;

  return (
    <Card>
      {/* Add */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          placeholder="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className={inputClass}
          disabled={isAdding}
          aria-label="New category name"
          maxLength={50}
        />
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50"
          disabled={isAdding}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </form>

      {/* Custom categories */}
      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-6 mb-2">
        Your categories
      </h4>
      {isInitialLoad ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-11 w-full rounded-lg" />
          ))}
        </div>
      ) : userCategories.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-3">
          You haven't added any categories yet. Add one above to organize your spending your way.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-700 border border-gray-100 dark:border-gray-700 rounded-lg">
          {userCategories.map((category) => {
            const isEditing = editingId === category._id;
            const isBusy = busyId === category._id;

            return (
              <li key={category._id} className="flex items-center gap-2 px-3 py-1.5 min-h-[2.75rem]">
                {isEditing ? (
                  <form
                    className="flex flex-1 items-center gap-1 min-w-0"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveEdit(category);
                    }}
                  >
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Escape' && setEditingId(null)}
                      className={`${inputClass} py-1`}
                      disabled={isBusy}
                      aria-label={`Rename ${category.name}`}
                      maxLength={50}
                      autoFocus
                    />
                    <button type="submit" className={iconButtonClass} disabled={isBusy} aria-label="Save">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className={iconButtonClass} disabled={isBusy} aria-label="Cancel">
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="flex-1 min-w-0 truncate text-sm text-gray-900 dark:text-gray-100">
                      {category.name}
                    </span>
                    <button
                      onClick={() => startEditing(category)}
                      className={iconButtonClass}
                      disabled={isBusy}
                      aria-label={`Rename ${category.name}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className={`${iconButtonClass} hover:text-red-600 dark:hover:text-red-400`}
                      disabled={isBusy}
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Built-in categories can't be changed, so they're shown as plain chips */}
      {defaultCategories.length > 0 && (
        <>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-6 mb-1">
            Built-in
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Always available and can't be edited.
          </p>
          <div className="flex flex-wrap gap-2">
            {defaultCategories.map((category) => (
              <span
                key={category._id}
                className="px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full"
              >
                {category.name}
              </span>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default CategoriesSection;
