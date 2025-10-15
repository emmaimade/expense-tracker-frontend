import { apiService } from './apiService';

export const categoryService = {
  async createCategory(categoryData) {
    return apiService.post('/category/', categoryData);
  },

  async getAllCategories() {
    return apiService.get('/category/');
  },

  async updateCategory(id, updateData) {
    return apiService.put(`/category/${id}`, updateData);
  },

  async deleteCategory(id) {
    return apiService.delete(`/category/${id}`);
  },
};