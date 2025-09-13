export const userService = {
  getCurrentUser() {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      throw new Error('Failed to retrieve user data');
    }
  },

  getUserName() {
    const user = this.getCurrentUser();
    return user?.name || '';
  },

  setUser(userData) {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
      throw new Error('Failed to save user data');
    }
  },

  clearUser() {
    localStorage.removeItem("user");
  }
};