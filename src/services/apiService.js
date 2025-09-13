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
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    await handleApiResponse(response);
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleApiResponse(response);
  },

  async patch(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleApiResponse(response);
  },

  async delete(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    });
    return handleApiResponse(response);
  },

  async getBlob(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    });
    await handleApiResponse(response);
    return response.blob();
  }
};