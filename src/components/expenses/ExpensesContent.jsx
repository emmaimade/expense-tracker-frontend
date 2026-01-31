import { useState, useEffect } from "react";
import ExpensesHeader from "./components/ExpensesHeader";
import TransactionTable from "./components/TransactionTable";
import AddExpenseModal from "./modals/AddExpenseModal";
import EditExpenseModal from "./modals/EditExpenseModal";
import DateRangeModal from "./modals/DateRangeModal";
import ExportModal from "./modals/ExportModal";

import { useExpenseMutations } from "./hooks/useExpenseMutations";
import { useFilterAndSearch } from "./hooks/useFilterAndSearch";
import { useExpenseData } from "./hooks/useExpenseData";
import { useCategories } from "./hooks/useCategories";
import { TableSkeleton } from "../common/Skeletons";

const ExpensesContent = ({ recentTransactions, onDataChange, userId }) => {
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // UI states
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 1. Fetch Categories
  const { 
    categories, 
    isLoading: isCategoriesLoading, 
    error: categoryError 
  } = useCategories();

  // 2. Mutations (Add/Edit/Delete) - Pass categories for optimistic updates
  const {
    addExpense,
    updateExpense,
    deleteExpense,
    isAdding,
    isUpdating,
    isDeleting,
  } = useExpenseMutations(categories);

  // 3. Date Filtering
  const {
    filteredTransactions: dateFilteredTransactions,
    customDateRange,
    setCustomDateRange,
    applyCustomDateRange,
    resetToDefault,
    isUsingCustomRange,
  } = useExpenseData(recentTransactions);

  // 4. Search and Category Filtering
  const {
    filteredTransactions: finalTransactions,
    searchTerm,
    setSearchTerm,
    filterBy,
    setFilterBy,
  } = useFilterAndSearch(dateFilteredTransactions);

  // 🔍 DEBUG (remove after fixing)
  useEffect(() => {
    console.log('🔍 ExpensesContent State:', {
      recentTransactions,
      recentTransactionsIsNull: recentTransactions === null,
      recentTransactionsIsUndefined: recentTransactions === undefined,
      recentTransactionsLength: recentTransactions?.length,
      
      categories,
      categoriesIsNull: categories === null,
      isCategoriesLoading,
      
      dateFilteredTransactions,
      dateFilteredIsNull: dateFilteredTransactions === null,
    });
  }, [recentTransactions, categories, isCategoriesLoading, dateFilteredTransactions]);

  // Handlers
  const handleAddSubmit = async (data) => {
    try {
      await addExpense(data);
      setIsAddModalOpen(false);
      if (onDataChange) onDataChange();
    } catch (err) {
      console.error('Add expense error:', err);
      setError(err.message);
    }
  };

  const handleUpdateSubmit = async (data) => {
    try {
      await updateExpense({ 
        id: selectedTransaction._id || selectedTransaction.id, 
        data 
      });
      setIsEditModalOpen(false);
      setSelectedTransaction(null);
      if (onDataChange) onDataChange();
    } catch (err) {
      console.error('Update expense error:', err);
      setError(err.message);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }
    
    try {
      await deleteExpense(transactionId);
      if (onDataChange) onDataChange();
    } catch (err) {
      console.error('Delete expense error:', err);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterBy("all");
    resetToDefault();
  };

  // ✅ ROBUST LOADING STATE DETECTION
  const isMutating = isAdding || isUpdating || isDeleting;
  
  // Check if we're in initial loading state
  // Categories: loading AND (null or undefined)
  const categoriesNotReady = isCategoriesLoading && (categories === null || categories === undefined);
  
  // Transactions: recentTransactions is null/undefined OR empty during load
  const transactionsNotReady = !recentTransactions || 
                                recentTransactions === null || 
                                recentTransactions === undefined;
  
  // Show skeleton if EITHER categories or transactions aren't ready
  const shouldShowSkeleton = categoriesNotReady || transactionsNotReady;
  
  // Background loading (data exists but refreshing)
  const isRefetching = isCategoriesLoading && categories && categories.length > 0;

  return (
    <div className="space-y-6">
      <ExpensesHeader
        onAddExpense={() => setIsAddModalOpen(true)}
        onExport={() => setIsExportModalOpen(true)}
        onDateRangeClick={() => setIsDateRangeModalOpen(true)}
        isUsingCustomRange={isUsingCustomRange}
        onClearDateRange={resetToDefault}
      />

      {/* Custom Date Range Indicator */}
      {isUsingCustomRange && customDateRange.startDate && customDateRange.endDate && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Filtered by Date Range
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {new Date(customDateRange.startDate).toLocaleDateString()} -{" "}
                {new Date(customDateRange.endDate).toLocaleDateString()}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Showing {dateFilteredTransactions?.length || 0} of{" "}
                {recentTransactions?.length || 0} transactions
              </p>
            </div>
            <button
              onClick={() => {
                resetToDefault();
                if (onDataChange) onDataChange();
              }}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium"
            >
              Clear Filter
            </button>
          </div>
        </div>
      )}

      {/* Loading States */}
      {shouldShowSkeleton ? (
        // Initial Load - Show skeleton
        <TableSkeleton rows={10} columns={5} />
      ) : (
        <>
          {/* Background Refetch Indicator */}
          {isRefetching && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Refreshing categories...
                </p>
              </div>
            </div>
          )}

          {/* Mutation Indicator */}
          {isMutating && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  {isAdding && 'Adding expense...'}
                  {isUpdating && 'Updating expense...'}
                  {isDeleting && 'Deleting expense...'}
                </p>
              </div>
            </div>
          )}

          {/* Table */}
          <TransactionTable
            transactions={finalTransactions || []} 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            onEdit={(tx) => {
              setSelectedTransaction(tx);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDeleteTransaction}
            onDateRangeClick={() => setIsDateRangeModalOpen(true)}
            loading={false}
            onClearDateRange={resetToDefault}
            isUsingCustomRange={isUsingCustomRange}
            categories={categories || []}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            onClearFilters={handleClearFilters}
          />
        </>
      )}

      {/* Modals */}
      {isAddModalOpen && (
        <AddExpenseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
          loading={isAdding}
          userId={userId}
        />
      )}

      {isEditModalOpen && (
        <EditExpenseModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTransaction(null);
          }}
          onSubmit={handleUpdateSubmit}
          transaction={selectedTransaction}
          loading={isUpdating}
          userId={userId}
        />
      )}

      {isDateRangeModalOpen && (
        <DateRangeModal
          isOpen={isDateRangeModalOpen}
          onClose={() => setIsDateRangeModalOpen(false)}
          customDateRange={customDateRange}
          onFetch={(dateRange) => {
            applyCustomDateRange(dateRange);
            setIsDateRangeModalOpen(false);
          }}
          setCustomDateRange={setCustomDateRange}
        />
      )}

      {isExportModalOpen && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          customDateRange={customDateRange}
        />
      )}

      {/* Error Display */}
      {(error || categoryError) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">
            {error || categoryError}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpensesContent;