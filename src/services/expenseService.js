import { apiService } from './apiService';

export const expenseService = {
  async addExpense(expenseData) {
    return apiService.post('/expense/', {
      description: expenseData.name,
      category: expenseData.category,
      amount: parseFloat(expenseData.amount),
      date: expenseData.date,
      type: 'expense'
    });
  },

  async updateExpense(id, expenseData) {
    return apiService.patch(`/expense/${id}`, {
      description: expenseData.name,
      category: expenseData.category,
      amount: parseFloat(expenseData.amount),
      date: expenseData.date,
      type: 'expense'
    });
  },

  async deleteExpense(id) {
    return apiService.delete(`/expense/${id}`);
  },

  async getTransactionsByDateRange(rangeType, customDateRange) {
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
  },

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