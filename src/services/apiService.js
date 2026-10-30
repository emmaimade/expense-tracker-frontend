// Requests go to /api on the app's own origin; Vercel (vercel.json) and the
// Vite dev server (vite.config.js) forward them to the API. Keeping API calls
// same-origin is what allows secure first-party cookies.
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Sessions live in httpOnly cookies that the browser sends automatically with
// these same-origin requests; no tokens are handled in JavaScript.

const handleApiResponse = async (response) => {
  if (!response.ok) {
    const responseText = await response.text();
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorData = null;
    try {
      errorData = JSON.parse(responseText);
      errorMessage = errorData.message || errorData.detail || errorData.error || errorMessage;
    } catch {
      // Ignore invalid JSON error bodies and fall back to status text.
    }
    const err = new Error(errorMessage);
    err.status = response.status;
    err.data = errorData;
    throw err;
  }
  return response;
};

// One refresh at a time: requests that fail together share the same refresh
let refreshInFlight = null;

/**
 * Exchange the refresh cookie for new session cookies.
 * @returns {Promise<boolean>} true if the session was renewed.
 */
export const refreshSession = () => {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API_BASE_URL}/user/refresh`, { method: 'POST', credentials: 'same-origin' })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
};

// The session can't be renewed: clear the local copy of the user and sign in again
const endExpiredSession = () => {
  localStorage.removeItem('expense-tracker-user');
  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = '/login?expired=1';
  }
};

/**
 * Send a request; on 401, renew the session once and retry.
 * @param {string} endpoint - API path, e.g. "/expense".
 * @param {{ method?: string, data?: object, blob?: boolean }} [options]
 */
const request = async (endpoint, { method = 'GET', data, blob = false } = {}, isRetry = false) => {
  const hasBody = data !== undefined;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    credentials: 'same-origin',
    ...(hasBody && {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  });

  if (response.status === 401 && !isRetry) {
    if (await refreshSession()) {
      return request(endpoint, { method, data, blob }, true);
    }
    endExpiredSession();
  }

  await handleApiResponse(response);
  return blob ? response.blob() : response.json();
};

export const apiService = {
  /**
   * Performs a GET request to the API.
   * @param {string} endpoint - The API path.
   * @returns {Promise<object>} A promise resolving to the JSON response body.
   */
  get(endpoint) {
    return request(endpoint);
  },

  /**
   * Performs a POST request to the API.
   * @param {string} endpoint - The API path.
   * @param {object} data - The data to send in the request body.
   * @returns {Promise<object>} A promise resolving to the JSON response body.
   */
  post(endpoint, data) {
    return request(endpoint, { method: 'POST', data });
  },

  /**
   * Performs a PUT request to the API.
   * @param {string} endpoint - The API path.
   * @param {object} data - The data to send in the request body.
   * @returns {Promise<object>} A promise resolving to the JSON response body.
   */
  put(endpoint, data) {
    return request(endpoint, { method: 'PUT', data });
  },

  /**
   * Performs a PATCH request to the API.
   * @param {string} endpoint - The API path.
   * @param {object} data - The data to send in the request body.
   * @returns {Promise<object>} A promise resolving to the JSON response body.
   */
  patch(endpoint, data) {
    return request(endpoint, { method: 'PATCH', data });
  },

  /**
   * Performs a DELETE request to the API.
   * @param {string} endpoint - The API path.
   * @param {object} [data] - Optional JSON body (e.g. a password confirmation).
   * @returns {Promise<object>} A promise resolving to the JSON response body.
   */
  delete(endpoint, data) {
    return request(endpoint, { method: 'DELETE', data });
  },

  /**
   * Performs a GET request that expects a file (e.g. an export download).
   * @param {string} endpoint - The API path.
   * @returns {Promise<Blob>} A promise resolving to the Blob response body.
   */
  getBlob(endpoint) {
    return request(endpoint, { blob: true });
  },
};
