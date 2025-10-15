import { apiService } from './apiService';

export const budgetService = {
  /**
   * Fetches the budget overview, showing summary, remaining budget, total spent, etc.
   * @returns {Promise<object>} The budget overview data.
   */
  async getBudgetOverview() {
    return apiService.get(`/budget/overview`);
  },

  /**
   * Fetches the total monthly budget amount set by the user.
   * @returns {Promise<object>} The total monthly budget amount.
   */
  async getTotalMonthlyBudget() {
    return apiService.get(`/budget/total`);
  },

  /**
   * Fetches data points to show budget trends over time.
   * @returns {Promise<object>} Budget trends data.
   */
  async getBudgetTrends() {
    return apiService.get(`/budget/trends`);
  },

  /**
   * Fetches any current budget alerts (e.g., close to limit, over budget).
   * @returns {Promise<object[]>} A list of budget alert objects.
   */
  async getBudgetAlerts() {
    return apiService.get(`/budget/alerts`);
  },

  /**
   * Sets or Updates the monthly budget for the user.
   * This function handles both the initial creation and subsequent modification
   * of the current monthly budget via the POST /budget/ route.
   * @param {object} budgetData - The budget details (e.g., { category: 'Groceries', amount: 500, month: '2025-10' }).
   * @returns {Promise<object>} The newly set or updated budget object.
   */
  async setMonthlyBudget(budgetData) {
    return apiService.post(`/budget/`, budgetData);
  },

  /**
   * Deletes a specific budget entry (likely by category or ID).
   * @param {string} id - The unique ID of the budget entry to delete.
   * @returns {Promise<void>} A promise that resolves upon successful deletion.
   */
  async deleteBudget(id) {
    return apiService.delete(`/budget/${id}`);
  },
};