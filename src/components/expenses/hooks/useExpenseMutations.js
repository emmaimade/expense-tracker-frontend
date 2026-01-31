// hooks/useExpenseMutations.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { expenseService } from '../../../services/expenseService';

export const useExpenseMutations = (categories = []) => {
  const queryClient = useQueryClient();

  // Add Expense with Optimistic Update
  const addExpenseMutation = useMutation({
    mutationFn: (expenseData) => expenseService.addExpense(expenseData),
    
    onMutate: async (newExpense) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['currentMonthTransactions'] });
      await queryClient.cancelQueries({ queryKey: ['recentTransactions'] });

      // Snapshot the previous value
      const previousTransactions = queryClient.getQueryData(['currentMonthTransactions']);

      // ✅ ROBUST FIX: Get categories from either cache OR passed prop
      let categoriesData = categories;
      if (!categoriesData || categoriesData.length === 0) {
        categoriesData = queryClient.getQueryData(['categories']) || [];
      }
      
      const categoryObj = categoriesData.find(cat => cat._id === newExpense.category);

      console.log('🔍 Optimistic Add - Category lookup:', {
        categoryId: newExpense.category,
        foundCategory: categoryObj,
        availableCategories: categoriesData.length
      });

      // Optimistically update to the new value
      const optimisticExpense = {
        id: `temp-${Date.now()}`,
        _id: `temp-${Date.now()}`,
        name: newExpense.name,
        description: newExpense.name,
        date: newExpense.date,
        // ✅ FIX: Use category object with fallback
        category: categoryObj ? {
          _id: categoryObj._id,
          name: categoryObj.name,
          userId: categoryObj.userId
        } : {
          _id: newExpense.category,
          name: 'Loading...' // Fallback if category not found
        },
        amount: -Math.abs(parseFloat(newExpense.amount)),
        type: 'expense',
        createdAt: new Date().toISOString(),
      };

      console.log('✅ Optimistic expense created:', optimisticExpense);

      queryClient.setQueryData(['currentMonthTransactions'], (old = []) => [
        optimisticExpense,
        ...old
      ]);

      // Show optimistic toast
      toast.info('Adding expense...', { autoClose: 1000 });

      return { previousTransactions };
    },

    onError: (err, newExpense, context) => {
      // Rollback on error
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          ['currentMonthTransactions'],
          context.previousTransactions
        );
      }
      toast.error(`Failed to add expense: ${err.message}`);
    },

    onSuccess: () => {
      toast.success('Expense added successfully!');
    },

    onSettled: () => {
      // Refetch to ensure we have accurate data
      queryClient.invalidateQueries({ queryKey: ['currentMonthTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['recentTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['budgetOverview'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    },
  });

  // Update Expense with Optimistic Update
  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, data }) => expenseService.updateExpense(id, data),
    
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['currentMonthTransactions'] });
      await queryClient.cancelQueries({ queryKey: ['recentTransactions'] });

      const previousTransactions = queryClient.getQueryData(['currentMonthTransactions']);

      // ✅ ROBUST FIX: Get categories from either cache OR passed prop
      let categoriesData = categories;
      if (!categoriesData || categoriesData.length === 0) {
        categoriesData = queryClient.getQueryData(['categories']) || [];
      }
      
      const categoryObj = categoriesData.find(cat => cat._id === data.category);

      console.log('🔍 Optimistic Update - Category lookup:', {
        categoryId: data.category,
        foundCategory: categoryObj,
        availableCategories: categoriesData.length
      });

      queryClient.setQueryData(['currentMonthTransactions'], (old = []) =>
        old.map((expense) =>
          expense.id === id || expense._id === id
            ? { 
                ...expense, 
                name: data.name || expense.name,
                description: data.name || expense.description,
                date: data.date || expense.date,
                // ✅ FIX: Use category object with fallback
                category: categoryObj ? {
                  _id: categoryObj._id,
                  name: categoryObj.name,
                  userId: categoryObj.userId
                } : (expense.category || {
                  _id: data.category,
                  name: 'Loading...'
                }),
                amount: -Math.abs(parseFloat(data.amount || expense.amount)) 
              }
            : expense
        )
      );

      toast.info('Updating expense...', { autoClose: 1000 });

      return { previousTransactions };
    },

    onError: (err, variables, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          ['currentMonthTransactions'],
          context.previousTransactions
        );
      }
      toast.error(`Failed to update expense: ${err.message}`);
    },

    onSuccess: () => {
      toast.success('Expense updated successfully!');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['currentMonthTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['recentTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['budgetOverview'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    },
  });

  // Delete Expense with Optimistic Update
  const deleteExpenseMutation = useMutation({
    mutationFn: (expenseId) => expenseService.deleteExpense(expenseId),
    
    onMutate: async (expenseId) => {
      await queryClient.cancelQueries({ queryKey: ['currentMonthTransactions'] });
      await queryClient.cancelQueries({ queryKey: ['recentTransactions'] });

      const previousTransactions = queryClient.getQueryData(['currentMonthTransactions']);

      queryClient.setQueryData(['currentMonthTransactions'], (old = []) =>
        old.filter((expense) => expense.id !== expenseId && expense._id !== expenseId)
      );

      toast.info('Deleting expense...', { autoClose: 1000 });

      return { previousTransactions };
    },

    onError: (err, expenseId, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          ['currentMonthTransactions'],
          context.previousTransactions
        );
      }
      toast.error(`Failed to delete expense: ${err.message}`);
    },

    onSuccess: () => {
      toast.success('Expense deleted successfully!');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['currentMonthTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['recentTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['budgetOverview'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    },
  });

  return {
    // ✅ Use mutateAsync for promise-based handling in components
    addExpense: addExpenseMutation.mutateAsync,
    updateExpense: updateExpenseMutation.mutateAsync,
    deleteExpense: deleteExpenseMutation.mutateAsync,
    
    // Also expose mutate for fire-and-forget scenarios
    addExpenseSync: addExpenseMutation.mutate,
    updateExpenseSync: updateExpenseMutation.mutate,
    deleteExpenseSync: deleteExpenseMutation.mutate,
    
    // Loading states
    isAdding: addExpenseMutation.isPending,
    isUpdating: updateExpenseMutation.isPending,
    isDeleting: deleteExpenseMutation.isPending,
    
    // Error states (useful for custom error handling)
    addError: addExpenseMutation.error,
    updateError: updateExpenseMutation.error,
    deleteError: deleteExpenseMutation.error,
    
    // Success states
    addSuccess: addExpenseMutation.isSuccess,
    updateSuccess: updateExpenseMutation.isSuccess,
    deleteSuccess: deleteExpenseMutation.isSuccess,
    
    // Reset functions (useful for clearing error states)
    resetAdd: addExpenseMutation.reset,
    resetUpdate: updateExpenseMutation.reset,
    resetDelete: deleteExpenseMutation.reset,
  };
};