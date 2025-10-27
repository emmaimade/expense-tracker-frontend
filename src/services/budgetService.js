import { apiService } from './apiService';

export const budgetService = {
  /**
   * Fetches the budget overview, showing summary, remaining budget, total spent, etc.
   * @returns {Promise<object>} The budget overview data.
   */
  async getBudgetOverview() {
    try {
      const response = await apiService.get(`/budget/overview`);
      console.log("Raw budget overview response:", response.data);
      const { data } = response;
      const normalizedCategories = (data?.categories || []).map((category) => ({
        ...category,
        amount: category.amount ?? category.budget ?? 0, // Prioritize amount, then budget
        id: category.id ?? category._id, // Ensure id is set
        categoryId: category.category, // Map category to categoryId
      }));
      return {
        ...response,
        data: { ...data, categories: normalizedCategories },
      };
    } catch (error) {
      console.error("Error fetching budget overview:", error);
      return { data: { categories: [] } };
    }
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
   * @returns {Promise<object>} An object with a data property containing an array of budget alert objects.
   */
  async getBudgetAlerts() {
    try {
      const response = await apiService.get(`/budget/alerts`);
      const { data } = response;

      // Normalize alerts into a single array
      const normalizedAlerts = [
        ...(data?.nearLimit || []).map((alert) => ({
          severity: alert.severity || "medium",
          message:
            alert.message ||
            `Approaching budget limit for ${
              alert.category.name
            } (${alert.percentageUsed.toFixed(2)}% used)`,
          suggestion:
            alert.suggestion || "Consider reducing spending in this category.",
          ...alert,
        })),
        ...(data?.overBudget || []).map((alert) => ({
          severity: alert.severity || "high",
          message: alert.message || `Over budget for ${alert.category.name}`,
          suggestion:
            alert.suggestion || "Review expenses to stay within budget.",
          ...alert,
        })),
      ];

      console.log("Normalized Budget Alerts:", normalizedAlerts);

      return {
        ...response,
        data: normalizedAlerts,
      };
    } catch (error) {
      console.error("Error fetching budget alerts:", error);
      return {
        success: false,
        message: "Failed to fetch budget alerts",
        data: [],
      };
    }
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