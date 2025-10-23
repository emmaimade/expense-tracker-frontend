import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ExpensesHeader from "./components/ExpensesHeader";
import TransactionTable from "./components/TransactionTable";
import AddExpenseModal from "./modals/AddExpenseModal";
import EditExpenseModal from "./modals/EditExpenseModal";
import DateRangeModal from "./modals/DateRangeModal";
import ExportModal from "./modals/ExportModal";
import LoadingOverlay from "../common/LoadingOverlay";

import { useExpenseActions } from "./hooks/useExpenseActions";
import { useFilterAndSearch } from "./hooks/useFilterAndSearch";
import { useExpenseData } from "./hooks/useExpenseData";
import { useCategories } from "../expenses/hooks/useCategories";

const ExpensesContent = ({ recentTransactions = [], onDataChange, userId }) => {
  console.log('recentTransactions:', recentTransactions);
  console.log('🚀 ExpensesContent rendered with transactions:', recentTransactions.length);
  console.log('📋 Sample transaction:', recentTransactions[0]);
  console.log('User ID:', userId); // Debug userId

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const {
    categories,
    loading: categoryLoading,
    error: categoryError,
  } = useCategories();

  // Custom hooks for data management
  const expenseData = useExpenseData(recentTransactions);
  const {
    categoryData,
    monthlyData,
    customDateRange,
    setCustomDateRange,
    dateRangeType,
    setDateRangeType,
    isUsingCustomRange,
    resetToDefault,
    filteredTransactions: dateFilteredTransactions,
  } = expenseData;

  // Filter transactions based on current view
  const displayTransactions = dateFilteredTransactions;

  const {
    filteredTransactions,
    searchTerm,
    setSearchTerm,
    filterBy,
    setFilterBy,
  } = useFilterAndSearch(displayTransactions);

  // Expense actions with proper date range management
  const expenseActions = useExpenseActions({
    loading,
    setLoading,
    setError,
    onDataChange,
    setIsAddModalOpen,
    setIsEditModalOpen,
    setIsDateRangeModalOpen,
    customDateRange,
    setCustomDateRange,
    resetToDefault,
  });

  const overallLoading = expenseActions.loading || categoryLoading;
  const overallError = expenseActions.error || categoryError;

  // Reset to default state on component mount
  useEffect(() => {
    resetToDefault();
  }, [resetToDefault]);

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleDateRangeClose = () => {
    setIsDateRangeModalOpen(false);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

      {overallLoading && <LoadingOverlay />}

      <ExpensesHeader
        onAddExpense={() => setIsAddModalOpen(true)}
        onExport={() => setIsExportModalOpen(true)}
        loading={loading}
      />

      {/* Current Filter Indicator */}
      {isUsingCustomRange &&
        customDateRange.startDate &&
        customDateRange.endDate && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Filtered by Date Range
                </p>
                <p className="text-sm text-blue-700">
                  {new Date(customDateRange.startDate).toLocaleDateString()} -{" "}
                  {new Date(customDateRange.endDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => {
                  resetToDefault();
                  if (onDataChange) onDataChange();
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Filter
              </button>
            </div>
          </div>
        )}

      <TransactionTable
        transactions={filteredTransactions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        onEdit={handleEditTransaction}
        onDelete={expenseActions.handleDeleteTransaction}
        onDateRangeClick={() => setIsDateRangeModalOpen(true)}
        loading={loading}
        isUsingCustomRange={isUsingCustomRange}
        onClearDateRange={resetToDefault}
        categories={categories}
      />

      {/* Modals */}
      {isAddModalOpen && (
        <AddExpenseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={expenseActions.handleAddExpense}
          loading={overallLoading}
          categories={categories}
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
          onSubmit={expenseActions.handleUpdateExpense}
          transaction={selectedTransaction}
          loading={overallLoading}
          categories={categories}
          userId={userId}
        />
      )}

      {isDateRangeModalOpen && (
        <DateRangeModal
          isOpen={isDateRangeModalOpen}
          onClose={handleDateRangeClose}
          customDateRange={customDateRange}
          onFetch={expenseActions.fetchCustomDateRangeTransactions}
          loading={loading}
          error={error}
          setError={setError}
          setCustomDateRange={setCustomDateRange}
        />
      )}

      {isExportModalOpen && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onExport={expenseActions.handleExportExpenses}
          customDateRange={customDateRange}
          loading={loading}
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};

export default ExpensesContent;