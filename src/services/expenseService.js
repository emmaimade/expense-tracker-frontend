import { apiService } from './apiService';

/**
 * Service module for managing expense transactions.
 * Provides methods for creating, updating, deleting, querying, and exporting expense records.
 */
export const expenseService = {
  /**
   * Creates a new expense record.
   *
   * @async
   * @param {object} expenseData - The expense payload to persist.
   * @param {string} expenseData.name - A short description of the expense.
   * @param {string} expenseData.category - The category the expense belongs to.
   * @param {number|string} expenseData.amount - The monetary value of the expense; coerced to a float before submission.
   * @param {string} expenseData.date - The date of the expense in ISO 8601 format.
   * @returns {Promise<object>} Resolved newly created expense object.
   */
  async addExpense(expenseData) {
    return apiService.post('/expense/', {
      description: expenseData.name,
      category: expenseData.category,
      amount: parseFloat(expenseData.amount),
      date: expenseData.date,
      type: 'expense'
    });
  },

  /**
   * Updates an existing expense record by its unique identifier.
   *
   * @async
   * @param {string} id - The unique identifier of the expense to update.
   * @param {object} expenseData - The updated expense payload.
   * @param {string} expenseData.name - The updated description of the expense.
   * @param {string} expenseData.category - The updated category of the expense.
   * @param {number|string} expenseData.amount - The updated monetary value; coerced to a float before submission.
   * @param {string} expenseData.date - The updated date in ISO 8601 format.
   * @returns {Promise<object>} Resolved updated expense object.
   */
  async updateExpense(id, expenseData) {
    return apiService.patch(`/expense/${id}`, {
      description: expenseData.name,
      category: expenseData.category,
      amount: parseFloat(expenseData.amount),
      date: expenseData.date,
      type: 'expense'
    });
  },

  /**
   * Deletes an expense record by its unique identifier.
   *
   * @async
   * @param {string} id - The unique identifier of the expense to delete.
   * @returns {Promise<void>} Resolves on successful deletion with no return value.
   */
  async deleteExpense(id) {
    return apiService.delete(`/expense/${id}`);
  },

  /**
   * Retrieves and normalizes expense transactions within a specified date range.
   * Supports predefined range types (e.g., "weekly", "monthly") and custom date ranges.
   * Returns an empty array for 404 "no expenses found" responses, treating them as
   * a valid empty state rather than an error condition.
   *
   * @async
   * @param {string} rangeType - The range preset identifier (e.g., "weekly", "monthly", "yearly"), or "custom" to use explicit dates.
   * @param {{ startDate: string, endDate: string } | null} customDateRange - Required when `rangeType` is "custom". Start and end dates in ISO 8601 format.
   * @returns {Promise<Array<object>>} Resolved array of normalized transaction objects, or an empty array on error or no results.
   */
  async getTransactionsByDateRange(rangeType, customDateRange) {
    try {
      let endpoint;

      if (rangeType === 'custom') {
        endpoint = `/expense/custom?startDate=${customDateRange.startDate}&endDate=${customDateRange.endDate}`;
      } else {
        endpoint = `/expense/${rangeType}`;
      }

      const response = await apiService.get(endpoint);
      const transactionsArray = response?.data?.expenses || response?.expenses || response?.data?.transactions || [];

      return transactionsArray?.filter(tx => tx !== null && tx !== undefined).map(tx => ({
        id: tx._id,
        name: tx.description || 'Unknown',
        category: tx.category || 'Uncategorized',
        amount: tx.amount || 0,
        date: tx.date || new Date().toISOString(),
        type: tx.type || 'expense',
      })) || [];

    } catch (error) {
      if (error.status === 404 && (error.message === 'No expenses found' || error.message?.includes('No expenses'))) {
        return [];
      }

      console.error('Error fetching transactions:', error);
      return [];
    }
  },

  /**
   * Exports expense records within a specified date range to a downloadable file.
   * Optionally filters by category. Delegates to the blob-returning API handler
   * for binary file download support.
   *
   * @async
   * @param {object} exportOptions - Configuration for the export request.
   * @param {string} exportOptions.startDate - The start of the export range in ISO 8601 format.
   * @param {string} exportOptions.endDate - The end of the export range in ISO 8601 format.
   * @param {string} exportOptions.fileFormat - The desired output format (e.g., "csv", "xlsx").
   * @param {string} exportOptions.category - The category filter; pass "all" to include all categories.
   * @returns {Promise<Blob>} Resolved binary Blob of the exported file.
   */
  async exportExpenses(exportOptions) {
    const params = new URLSearchParams({
      startDate: exportOptions.startDate,
      endDate: exportOptions.endDate,
      fileFormat: exportOptions.fileFormat,
      ...(exportOptions.category !== 'all' && { category: exportOptions.category })
    });

    return apiService.getBlob(`/expense/export?${params}`);
  }
};