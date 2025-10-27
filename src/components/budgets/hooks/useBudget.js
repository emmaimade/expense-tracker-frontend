import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { budgetService } from '../../../services/budgetService';
import { useCategories } from '../../expenses/hooks/useCategories';

export const useBudget = (recentTransactions = []) => {
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState({});
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [budgetAlerts, setBudgetAlerts] = useState([]);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [tempCategoryBudget, setTempCategoryBudget] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ 
    categoryId: "", 
    name: "", 
    amount: "" 
  });

  // Fetch categories using existing hook
  const { categories, loading: categoriesLoading } = useCategories();

  // Fetch all budget data
  const fetchBudgetData = useCallback(async () => {
    setLoading(true);
    try {
      const [budgets, alerts] = await Promise.all([
        budgetService.getBudgetOverview().catch(() => ({ data: {} })),
        budgetService.getBudgetAlerts().catch(() => ({ data: [] })),
      ]);

      console.log("=== FETCH BUDGET DATA ===");
      console.log("Raw Budgets Response:", budgets);
      console.log("Budget Alerts:", alerts);

      setBudget(budgets?.data || {});
      setCategoryBudgets(budgets?.data?.categories || []);
      setBudgetAlerts(alerts?.data || []);
    } catch (error) {
      console.error("Error fetching budget data:", error);
      toast.error("Failed to load budget data");
      setBudgetAlerts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  // Add new category budget
  const handleAddCategory = async () => {
    if (
      !newCategory.categoryId ||
      !newCategory.amount ||
      parseFloat(newCategory.amount) <= 0
    ) {
      toast.error("Please select a category and enter a valid amount");
      return;
    }

    // Check if budget already exists for this category
    const existingBudget = categoryBudgets.find(
      (b) => b.categoryId?._id === newCategory.categoryId || b.category?._id === newCategory.categoryId
    );

    if (existingBudget) {
      toast.error("Budget already exists for this category. Please edit it instead.");
      return;
    }

    try {
      const currentDate = new Date();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear();

      const budgetData = {
        categoryId: newCategory.categoryId,
        amount: parseFloat(newCategory.amount),
        month: month,
        year: year,
      };

      console.log("Adding budget:", budgetData);
      
      await budgetService.setMonthlyBudget(budgetData);

      toast.success(`Budget for ${newCategory.name} added successfully!`);
      setNewCategory({ categoryId: "", name: "", amount: "" });
      setShowAddCategory(false);
      await fetchBudgetData();
    } catch (error) {
      console.error("Error adding category budget:", error);
      toast.error(error?.response?.data?.message || "Failed to add category budget");
    }
  };

  // Save category budget (update existing)
  const handleSaveCategoryBudget = async (budgetId, categoryId) => {
    if (!tempCategoryBudget || parseFloat(tempCategoryBudget) <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }

    try {
      const currentDate = new Date();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear();

      const budgetData = {
        categoryId: categoryId,
        amount: parseFloat(tempCategoryBudget),
        month: month,
        year: year,
      };

      console.log("Updating budget:", budgetData);
      
      await budgetService.setMonthlyBudget(budgetData);

      setIsEditingCategory(false);
      setEditingCategoryId(null);
      setTempCategoryBudget("");
      toast.success("Budget updated successfully!");
      await fetchBudgetData();
    } catch (error) {
      console.error("Error saving category budget:", error);
      toast.error(error?.response?.data?.message || "Failed to save budget");
    }
  };

  // Delete a specific budget
  const handleDeleteBudget = async (id) => {
    try {
      await budgetService.deleteBudget(id);
      toast.success("Budget deleted successfully!");
      await fetchBudgetData(); // Re-fetch data to update the list
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error(error?.response?.data?.message || "Failed to delete budget");
    }
  };

  // Memoized budget calculations
  const calculations = useMemo(() => {
    console.log("\n=== CALCULATIONS START ===");

    // Calculate spending by category from transactions
    const categorySpending = {};
    let totalSpent = 0;

    recentTransactions
      .filter((tx) => {
        const txDate = new Date(tx.date);
        const now = new Date();
        return (
          tx.type === "expense" &&
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      })
      .forEach((tx) => {

        // Try all possible category ID formats
        const categoryId =
          tx.category?._id || 
          tx.category?.id || 
          tx.category || 
          "Uncategorized";

        console.log("Extracted Category ID:", categoryId);

        const amount = Math.abs(tx.amount || 0);
        categorySpending[categoryId] = (categorySpending[categoryId] || 0) + amount;
        totalSpent += amount;

      });

    // Get totals from budget overview
    const totalBudget = budget.totalBudget || 0;
    const spent = budget.totalSpent || 0;
    const remaining = budget.totalRemaining || 0;
    const percentageUsed = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;
    const isOverBudget = percentageUsed > 100;

    // Calculate daily average and projection
    const currentDay = new Date().getDate();
    const daysInMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).getDate();
    const dailyAverage = currentDay > 0 ? spent / currentDay : 0;
    const projectedSpending = dailyAverage * daysInMonth;
    const daysRemaining = daysInMonth - currentDay;

    console.log("=== CALCULATIONS END ===\n");

    return {
      totalBudget,
      spent,
      remaining,
      percentageUsed,
      isOverBudget,
      currentDay,
      daysInMonth,
      dailyAverage,
      projectedSpending,
      daysRemaining,
      categorySpending,
    };
  }, [recentTransactions, budget, categoryBudgets]);

  // Combine loading states
  const totalLoading = loading || categoriesLoading;

  return {
    // State
    loading: totalLoading,
    categoryBudgets,
    budgetAlerts,
    isEditingCategory,
    editingCategoryId,
    tempCategoryBudget,
    showAddCategory,
    newCategory,

    // Setters
    setTempCategoryBudget,
    setIsEditingCategory,
    setEditingCategoryId,
    setShowAddCategory,
    setNewCategory,

    // Handlers and Calculations
    handleSaveCategoryBudget,
    handleAddCategory,
    handleDeleteBudget,
    calculations,

    // Expose categories for dropdown
    categories,
  };
};
