import { apiService } from './apiService';

/**
 * Service module for managing user budget data.
 * Provides methods for retrieving, creating, updating, and deleting budget entries.
 */
export const budgetService = {
  /**
   * Retrieves the budget overview including summary, remaining budget, and total spent.
   * Normalizes category fields for consistent downstream consumption.
   *
   * @async
   * @returns {Promise<{ data: { categories: Array<object> } }>} Resolved budget overview with normalized categories.
   * @returns {Promise<{ data: { categories: [] } }>} Empty categories array on failure.
   */
  async getBudgetOverview() {
    try {
      const response = await apiService.get(`/budget/overview`);
      const { data } = response;
      const normalizedCategories = (data?.categories || []).map((category) => ({
        ...category,
        amount: category.amount ?? category.budget ?? 0,
        id: category.id ?? category._id,
        categoryId: category.category,
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
   * Retrieves the total monthly budget amount configured by the user.
   *
   * @async
   * @returns {Promise<object>} Resolved total monthly budget data.
   */
  async getTotalMonthlyBudget() {
    return apiService.get(`/budget/total`);
  },

  /**
   * Retrieves historical budget data points for trend analysis over time.
   *
   * @async
   * @returns {Promise<object>} Resolved budget trends data.
   */
  async getBudgetTrends() {
    return apiService.get(`/budget/trends`);
  },

  /**
   * Retrieves active budget alerts, normalizing near-limit and over-budget
   * entries into a single unified alert array.
   *
   * @async
   * @returns {Promise<{ data: Array<object> }>} Resolved object containing a flat array of normalized alert objects.
   * @returns {Promise<{ success: false, message: string, data: [] }>} Failure response with empty alerts on error.
   */
  async getBudgetAlerts() {
    try {
      const response = await apiService.get(`/budget/alerts`);
      const { data } = response;

      const normalizedAlerts = [
        ...(data?.nearLimit || []).map((alert) => ({
          severity: alert.severity || "medium",
          message:
            alert.message ||
            `Approaching budget limit for ${alert.category.name} (${alert.percentageUsed.toFixed(2)}% used)`,
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
   * Creates or updates the monthly budget for the authenticated user.
   * Targets the POST /budget/ endpoint, which handles both initial creation
   * and modification of an existing monthly budget.
   *
   * @async
   * @param {object} budgetData - Budget payload to persist.
   * @param {string} budgetData.category - The budget category label (e.g., "Groceries").
   * @param {number} budgetData.amount - The allocated budget amount in the user's currency.
   * @param {string} budgetData.month - The target month in ISO 8601 year-month format (e.g., "2025-10").
   * @returns {Promise<object>} Resolved newly created or updated budget object.
   */
  async setMonthlyBudget(budgetData) {
    return apiService.post(`/budget/`, budgetData);
  },

  /**
   * Deletes a budget entry by its unique identifier.
   *
   * @async
   * @param {string} id - The unique identifier of the budget entry to delete.
   * @returns {Promise<void>} Resolves on successful deletion with no return value.
   */
  async deleteBudget(id) {
    return apiService.delete(`/budget/${id}`);
  },
};