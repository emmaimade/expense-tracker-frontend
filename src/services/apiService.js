const API_BASE_URL = 'https://expense-tracker-api-hvss.onrender.com';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Authentication token not found. Please log in again.');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const handleApiResponse = async (response) => {
  if (!response.ok) {
    const responseText = await response.text();
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = JSON.parse(responseText);
      errorMessage = errorData.message || errorData.detail || errorData.error || errorMessage;
    } catch (parseError) {
      console.log('Could not parse error response as JSON');
    }
    throw new Error(errorMessage);
  }
  return response;
};

export const apiService = {
  /**
   * Performs a GET request to the API.
   * @param {string} endpoint - The API path, including /api/v1 prefix if necessary.
   * @returns {Promise<object>} A promise resolving to the JSON response body.
   */ 
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    await handleApiResponse(response);
    return response.json();
  },

  /**
   * Performs a POST request to the API.
   * @param {string} endpoint - The API path, including /api/v1 prefix if necessary.
   * @param {object} data - The data to send in the request body.
   * @returns {Promise<object>} A promise resolving to the JSON response body.
   */ 
  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleApiResponse(response);
  },

  /**
   * Performs a PUT request to the API.
   * @param {string} endpoint - The API path, including /api/v1 prefix if necessary.
   * @param {object} data - The data to send in the request body.
   * @returns {Promise<object>} A promise resolving to the JSON response body.
   */
  async put(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleApiResponse(response);
  },

  /**
   * Performs a PATCH request to the API.
   * @param {string} endpoint - The API path, including /api/v1 prefix if necessary.
   * @param {object} data - The data to send in the request body.
   * @returns {Promise<object>} A promise resolving to the JSON response body.
   */
  async patch(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleApiResponse(response);
  },

  /**
   * Performs a DELETE request to the API.
   * @param {string} endpoint - The API path, including /api/v1 prefix if necessary.
   * @returns {Promise<void>} A promise that resolves when the deletion is successful.
   */
  async delete(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    return handleApiResponse(response);
  },
  
  /**
   * Performs a GET request to the API that expects a Blob response (e.g., for file downloads).
   * @param {string} endpoint - The API path, including /api/v1 prefix if necessary.
   * @returns {Promise<Blob>} A promise resolving to the Blob response body.
   */
  async getBlob(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    await handleApiResponse(response);
    return response.blob();
  },
};