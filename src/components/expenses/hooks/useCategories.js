import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../../../services/categoryService";
import { normalizeCategories, normalizeCategory } from "../../../utils/categoryUtils";

export const CATEGORIES_QUERY_KEY = ['categories'];

const fetchCategories = async () => {
  const response = await categoryService.getAllCategories();
  const categoryList = response?.data || response || [];
  return Array.isArray(categoryList) ? normalizeCategories(categoryList) : [];
};

// Categories rarely change, and every change made in the app updates the cache directly,
// so a long stale time is safe and keeps dropdowns instant
const CATEGORIES_STALE_TIME = 10 * 60 * 1000;

export const categoriesQueryOptions = {
  queryKey: CATEGORIES_QUERY_KEY,
  queryFn: fetchCategories,
  staleTime: CATEGORIES_STALE_TIME,
};

/**
 * Shared, cached category list (TanStack Query). Every component reads the same cache, so the
 * Add/Edit expense dialogs open with categories already loaded instead of fetching each time.
 */
export const useCategories = () => {
  const queryClient = useQueryClient();
  const query = useQuery(categoriesQueryOptions);

  const updateCache = useCallback(
    (updater) => queryClient.setQueryData(CATEGORIES_QUERY_KEY, (prev) => updater(prev || [])),
    [queryClient]
  );

  const createCategory = useCallback(async (categoryData) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      const newCategory = normalizeCategory(response.data || response, categoryData?.userId);
      updateCache((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      throw new Error(err.message || "Failed to create category.");
    }
  }, [updateCache]);

  const updateCategory = useCallback(async (id, updateData) => {
    try {
      const response = await categoryService.updateCategory(id, updateData);
      const changes = response.data || response;
      // The API returns only { id, name }, so merge onto the existing category to keep userId
      updateCache((prev) =>
        prev.map((cat) => (cat._id === id ? normalizeCategory({ ...cat, ...changes }, cat.userId) : cat))
      );
      return changes;
    } catch (err) {
      throw new Error(err.message || "Failed to update category.");
    }
  }, [updateCache]);

  const deleteCategory = useCallback(async (id) => {
    try {
      await categoryService.deleteCategory(id);
      updateCache((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      throw new Error(err.message || "Failed to delete category.");
    }
  }, [updateCache]);

  const refreshCategories = useCallback(
    () => queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY }),
    [queryClient]
  );

  // Same shape as before: categories is null until the first load finishes
  return useMemo(
    () => ({
      categories: query.data ?? null,
      isLoading: query.isLoading,
      error: query.error ? "Server is waking up or unreachable. Please refresh in a moment." : null,
      createCategory,
      updateCategory,
      deleteCategory,
      refreshCategories,
    }),
    [query.data, query.isLoading, query.error, createCategory, updateCategory, deleteCategory, refreshCategories]
  );
};
