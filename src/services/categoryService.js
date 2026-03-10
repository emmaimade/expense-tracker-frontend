import { apiService } from './apiService';

/**
 * Service module for managing expense categories.
 * Provides methods for creating, retrieving, updating, and deleting category records.
 */
export const categoryService = {
  /**
   * Creates a new expense category.
   *
   * @async
   * @param {object} categoryData - The category payload to persist.
   * @param {string} categoryData.name - The display name of the category.
   * @param {string} categoryData.userId - The unique identifier of the owning user.
   * @returns {Promise<object>} Resolved newly created category object.
   */
  async createCategory(categoryData) {
    return apiService.post('/category/', categoryData);
  },

  /**
   * Retrieves all expense categories for the authenticated user.
   *
   * @async
   * @returns {Promise<object>} Resolved object containing an array of category records.
   */
  async getAllCategories() {
    return apiService.get('/category/');
  },

  /**
   * Updates an existing expense category by its unique identifier.
   *
   * @async
   * @param {string} id - The unique identifier of the category to update.
   * @param {object} updateData - The fields to update on the category record.
   * @param {string} [updateData.name] - The updated display name of the category.
   * @returns {Promise<object>} Resolved updated category object.
   */
  async updateCategory(id, updateData) {
    return apiService.put(`/category/${id}`, updateData);
  },

  /**
   * Deletes an expense category by its unique identifier.
   *
   * @async
   * @param {string} id - The unique identifier of the category to delete.
   * @returns {Promise<void>} Resolves on successful deletion with no return value.
   */
  async deleteCategory(id) {
    return apiService.delete(`/category/${id}`);
  },
};