import { toast } from "react-toastify";
import { expenseService } from "../../../services/expenseService";
import { dateUtils } from "../../../utils/dateUtils";

export const useExpenseActions = ({
  setLoading,
  setError,
  onDataChange,
  setIsAddModalOpen,
  setIsEditModalOpen,
  setIsDateRangeModalOpen,
  customDateRange,
  resetToDefault,
}) => {
  const handleAddExpense = async (expenseData) => {
    if (!dateUtils.isDateValid(expenseData.date)) {
      toast.error("Expense date cannot be in the future.");
      return;
    }

    setLoading(true);
    try {
      await expenseService.addExpense(expenseData);
      toast.success("Expense added successfully!");
      setIsAddModalOpen(false);
      if (onDataChange) onDataChange();
    } catch (error) {
      toast.error(`Failed to add expense: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExpense = async (expenseData, transactionId) => {
    if (!dateUtils.isDateValid(expenseData.date)) {
      toast.error("Expense date cannot be in the future.");
      return;
    }

    setLoading(true);
    try {
      await expenseService.updateExpense(transactionId, expenseData);
      toast.success("Expense updated successfully!");
      setIsEditModalOpen(false);
      if (onDataChange) onDataChange();
    } catch (error) {
      toast.error(`Failed to update expense: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    setLoading(true);
    try {
      await expenseService.deleteExpense(transactionId);
      toast.success("Transaction deleted successfully!");
      if (onDataChange) onDataChange();
    } catch (error) {
      toast.error(`Failed to delete transaction: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomDateRangeTransactions = async (
    rangeType = "custom",
    passedDateRange = null
  ) => {
    setLoading(true);
    setError(null);

    try {
      let effectiveRange = passedDateRange || { ...customDateRange };

      if (rangeType === "reset") {
        // Reset to default state - clear custom range and fetch all transactions
        resetToDefault();

        if (onDataChange) {
          // Trigger refresh with default data
          onDataChange([]);
        }

        setIsDateRangeModalOpen(false);
        toast.info("Date range reset to default view");
        return;
      }

      // Validate date range
      if (!effectiveRange.startDate || !effectiveRange.endDate) {
        toast.error("Please select both start and end dates.");
        setError("Please select both start and end dates.");
        return;
      }

      if (!dateUtils.isDateValid(effectiveRange.startDate)) {
        toast.error("Start date cannot be in the future.");
        setError("Start date cannot be in the future.");
        return;
      }

      if (!dateUtils.isDateValid(effectiveRange.endDate)) {
        toast.error("End date cannot be in the future.");
        setError("End date cannot be in the future.");
        return;
      }

      if (
        new Date(effectiveRange.startDate) > new Date(effectiveRange.endDate)
      ) {
        toast.error("Start date must be before or equal to end date.");
        setError("Start date must be before or equal to end date.");
        return;
      }

      const data = await expenseService.getTransactionsByDateRange(
        rangeType,
        effectiveRange
      );
      // Transform data to ensure category is a string
      const transformedData = Array.isArray(data)
        ? data.map((tx) => ({
            id: tx._id || null,
            name: tx.name || "Unknown",
            category:
              typeof tx.category === "object"
                ? tx.category?.name || "Uncategorized"
                : tx.category || "Uncategorized",
            amount: tx.amount || 0,
            date: tx.date || new Date().toISOString(),
            type: tx.type || "expense",
          }))
        : [];

      if (transformedData.length === 0) {
        const rangeText = `${new Date(
          effectiveRange.startDate
        ).toLocaleDateString()} - ${new Date(
          effectiveRange.endDate
        ).toLocaleDateString()}`;
        toast.info(
          `No transactions found for the selected date range: ${rangeText}`
        );
      } else {
        const rangeText = `${new Date(
          effectiveRange.startDate
        ).toLocaleDateString()} - ${new Date(
          effectiveRange.endDate
        ).toLocaleDateString()}`;
        toast.success(
          `Loaded ${transformedData.length} transactions for ${rangeText}`
        );
      }

      console.log("Transformed transactions:", transformedData);
      console.log("Sample transaction:", transformedData[0]);
      if (onDataChange) onDataChange(transformedData);
      setIsDateRangeModalOpen(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error(`Failed to fetch transactions: ${error.message}`);
      setError(`Failed to fetch transactions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExpenses = async (exportOptions) => {
    setLoading(true);
    try {
      // Use custom date range if available, otherwise use export options dates
      let effectiveOptions = { ...exportOptions };

      if (
        customDateRange.startDate &&
        customDateRange.endDate &&
        !exportOptions.startDate &&
        !exportOptions.endDate
      ) {
        effectiveOptions.startDate = customDateRange.startDate;
        effectiveOptions.endDate = customDateRange.endDate;
      }

      const blob = await expenseService.exportExpenses(effectiveOptions);
      const fileName =
        effectiveOptions.fileFormat === "csv" ? "expenses.csv" : "expenses.pdf";

      const urlObj = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlObj;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(urlObj);

      toast.success(
        `Expenses exported successfully as ${effectiveOptions.fileFormat.toUpperCase()}!`
      );
    } catch (error) {
      toast.error(`Failed to export expenses: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleAddExpense,
    handleUpdateExpense,
    handleDeleteTransaction,
    fetchCustomDateRangeTransactions,
    handleExportExpenses,
  };
};
