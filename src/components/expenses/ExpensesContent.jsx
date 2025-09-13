import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ExpensesHeader from './components/ExpensesHeader';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CategoryBudgets from './components/CategoryBudgets';
import TransactionTable from './components/TransactionTable';
import AddExpenseModal from './modals/AddExpenseModal';
import EditExpenseModal from './modals/EditExpenseModal';
import DateRangeModal from './modals/DateRangeModal';
import ExportModal from './modals/ExportModal';
import LoadingOverlay from '../common/LoadingOverlay';

import { useExpenseActions } from './hooks/useExpenseActions';
import { useFilterAndSearch } from './hooks/useFilterAndSearch';
import { useExpenseData } from './hooks/useExpenseData';

const ExpensesContent = ({ recentTransactions = [], onDataChange }) => {
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Custom hooks for data management
  const expenseData = useExpenseData(recentTransactions);
  const {
    categoryData,
    monthlyData,
    customDateRange,
    setCustomDateRange,
    dateRange,
    setDateRange,
    isUsingCustomRange,
    resetToDefault,
    getDateFilteredTransactions
  } = expenseData;

  // Filter transactions based on current view
  const displayTransactions = isUsingCustomRange 
    ? getDateFilteredTransactions(dateRange)
    : recentTransactions;

  const { filteredTransactions, searchTerm, setSearchTerm, filterBy, setFilterBy } = 
    useFilterAndSearch(displayTransactions);

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
    resetToDefault
  });

  // Reset to default state on component mount
  useEffect(() => {
    resetToDefault();
  }, []);

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

      {loading && <LoadingOverlay />}

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

      <AnalyticsDashboard
        categoryData={categoryData}
        monthlyData={monthlyData}
        dateRange={dateRange}
        setDateRange={setDateRange}
        customDateRange={customDateRange}
      />

      <CategoryBudgets categoryData={expenseData.categoryData} />

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
      />

      {/* Modals */}
      {isAddModalOpen && (
        <AddExpenseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={expenseActions.handleAddExpense}
          loading={loading}
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
          loading={loading}
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