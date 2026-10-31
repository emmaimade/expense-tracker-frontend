import { useState } from "react";
import { Download } from "lucide-react";
import TransactionTable from "./components/TransactionTable";
import PeriodFilter from "./components/PeriodFilter";
import EditExpenseModal from "./modals/EditExpenseModal";
import ExportModal from "./modals/ExportModal";

import { useExpenseMutations } from "./hooks/useExpenseMutations";
import { useFilterAndSearch } from "./hooks/useFilterAndSearch";
import { useExpensePeriod } from "./hooks/useExpensePeriod";
import { useCategories } from "./hooks/useCategories";
import { TableSkeleton, TransactionListSkeleton } from "../common/Skeletons";
import { useConfirm } from "../../context/ConfirmContext";

// Adding an expense lives in the top bar (desktop) and the bottom nav (mobile)
const ExpensesContent = ({ onDataChange, userId }) => {
  const confirm = useConfirm();

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // UI states
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 1. Fetch Categories
  const {
    categories,
    isLoading: isCategoriesLoading,
    error: categoryError
  } = useCategories();

  // 2. Mutations (Edit/Delete) - success and failure are shown as toasts by the hook
  const {
    updateExpense,
    deleteExpense,
    isUpdating,
  } = useExpenseMutations(categories);

  // 3. Expenses for the selected period, fetched from the API
  const {
    period,
    setPeriod,
    customRange,
    setCustomRange,
    transactions,
    isSwitching,
    error: transactionsError,
  } = useExpensePeriod();

  // 4. Search and Category Filtering
  const {
    filteredTransactions: finalTransactions,
    searchTerm,
    setSearchTerm,
    filterBy,
    setFilterBy,
  } = useFilterAndSearch(transactions);

  const handleUpdateSubmit = async (data) => {
    try {
      await updateExpense({
        id: selectedTransaction._id || selectedTransaction.id,
        data
      });
      setIsEditModalOpen(false);
      setSelectedTransaction(null);
      if (onDataChange) onDataChange();
    } catch {
      // Failure is already surfaced by the mutation's error toast
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    const confirmed = await confirm({
      title: 'Delete transaction?',
      message: 'This permanently removes the transaction and updates your budgets.',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!confirmed) return;

    try {
      await deleteExpense(transactionId);
      if (onDataChange) onDataChange();
    } catch {
      // Failure is already surfaced by the mutation's error toast
    }
  };

  // Skeleton only until categories and the first page of expenses have loaded
  const categoriesNotReady = isCategoriesLoading && !categories;
  const shouldShowSkeleton = categoriesNotReady || transactions === null;

  const loadError = transactionsError
    ? 'Could not load your expenses. Please try again in a moment.'
    : categoryError;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Toolbar */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {loadError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">{loadError}</p>
        </div>
      )}

      {shouldShowSkeleton && !loadError ? (
        <>
          <div className="sm:hidden">
            <TransactionListSkeleton items={8} />
          </div>
          <div className="hidden sm:block">
            <TableSkeleton rows={10} columns={5} />
          </div>
        </>
      ) : (
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
          loading={isSwitching}
          categories={categories || []}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          periodFilter={
            <PeriodFilter
              period={period}
              onPeriodChange={setPeriod}
              customRange={customRange}
              onCustomRangeChange={setCustomRange}
            />
          }
        />
      )}

      {/* Modals */}
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

      {isExportModalOpen && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ExpensesContent;
