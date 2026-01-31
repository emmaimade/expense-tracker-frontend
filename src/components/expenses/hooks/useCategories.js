import { useState, useEffect, useMemo, useCallback } from "react";
import { categoryService } from "../../../services/categoryService";

export const useCategories = () => {
  // ✅ FIX: Initialize as null, not []
  const [categories, setCategories] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await categoryService.getAllCategories();
      // Use optional chaining and default to empty array
      const categoryList = response?.data || response || [];

      if (Array.isArray(categoryList)) {
        setCategories(categoryList);
      } else {
        setCategories([]); // Fallback to empty array (not null) after successful fetch
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Server is waking up or unreachable. Please refresh in a moment.");
      // ✅ FIX: Set to empty array on error (not null), so we know fetch was attempted
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCategory = async (categoryData) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      const newCategory = response.data || response;
      setCategories((prev) => [...(prev || []), newCategory]);
      return newCategory;
    } catch (err) {
      throw new Error(err.message || "Failed to create category.");
    }
  };

  const updateCategory = async (id, updateData) => {
    try {
      const response = await categoryService.updateCategory(id, updateData);
      const updatedCategory = response.data || response;
      setCategories((prev) =>
        (prev || []).map((cat) => (cat._id === id ? updatedCategory : cat))
      );
      return updatedCategory;
    } catch (err) {
      throw new Error(err.message || "Failed to update category.");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      setCategories((prev) => (prev || []).filter((cat) => cat._id !== id));
    } catch (err) {
      throw new Error(err.message || "Failed to delete category.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  // Use useMemo for stable return object
  return useMemo(
    () => ({
      categories,
      isLoading, // ✅ Changed from 'loading' to match ExpensesContent
      error,
      createCategory,
      updateCategory,
      deleteCategory,
      refreshCategories: fetchCategories,
    }),
    [categories, isLoading, error, fetchCategories]
  );
};