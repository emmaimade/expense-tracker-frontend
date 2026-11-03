// Requests go to /api on the app's own origin; Vercel (vercel.json) and the
// Vite dev server (vite.config.js) forward them to the API. Keeping API calls
// same-origin is what allows secure first-party cookies.
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Sessions live in httpOnly cookies that the browser sends automatically with
// these same-origin requests; no tokens are handled in JavaScript.

// The free Render host can take close to a minute to wake up, so give requests that long
// before giving up (SlowServerNotice tells the user what's happening meanwhile)
const REQUEST_TIMEOUT_MS = 60 * 1000;

/**
 * Build the Error every API failure is turned into, so callers can rely on
 * `error.message` (safe to show) and `error.status` (0 when the request never got an answer).
 */
const apiError = (message, status, data = null, cause) => {
  const err = new Error(message);
  err.status = status;
  err.data = data;
  if (cause) err.cause = cause;
  return err;
};

const handleApiResponse = async (response) => {
  if (!response.ok) {
    const responseText = await response.text();
    let errorData = null;
    try {
      errorData = JSON.parse(responseText);
    } catch {
      // Not JSON (e.g. an HTML error page from the host while it wakes up)
    }
    const serverMessage = errorData?.message || errorData?.detail || errorData?.error;
    const fallback = response.status >= 500
      ? 'SpendWise is having trouble right now. Please try again in a moment.'
      : `Request failed (${response.status})`;
    throw apiError(serverMessage || fallback, response.status, errorData);
  }
  return response;
};

// Successful responses can be empty (204) or, if something upstream misroutes, not JSON at all
const parseBody = async (response, blob) => {
  if (blob) return response.blob();
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    throw apiError('Unexpected response from the server. Please try again.', response.status, null, error);
  }
};

// fetch() rejects only when there's no answer at all: offline, DNS failure or our timeout
const fetchWithTimeout = async (url, options) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw apiError('SpendWise is taking too long to respond. Please try again in a moment.', 0, null, error);
    }
    throw apiError("Can't reach SpendWise. Check your internet connection and try again.", 0, null, error);
  } finally {
    clearTimeout(timer);
  }
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
 * @param {{ method?: string, data?: object, blob?: boolean, skipRefresh?: boolean }} [options]
 *   skipRefresh: for sign-in style endpoints, where a 401 means "wrong details", not "session expired".
 */
const request = async (endpoint, { method = 'GET', data, blob = false, skipRefresh = false } = {}, isRetry = false) => {
  const hasBody = data !== undefined;
  const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
    method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      ...(hasBody && { 'Content-Type': 'application/json' }),
    },
    ...(hasBody && { body: JSON.stringify(data) }),
  });

  if (response.status === 401 && !isRetry && !skipRefresh) {
    if (await refreshSession()) {
      return request(endpoint, { method, data, blob, skipRefresh }, true);
    }
    endExpiredSession();
  }

  await handleApiResponse(response);
  return parseBody(response, blob);
};

export const apiService = {
  /**
   * Performs a GET request to the API.
   * @param {string} endpoint - The API path.
   * @param {{ skipRefresh?: boolean }} [options]
   * @returns {Promise<object|null>} A promise resolving to the JSON response body (null if empty).
   */
  get(endpoint, options) {
    return request(endpoint, options);
  },

  /**
   * Performs a POST request to the API.
   * @param {string} endpoint - The API path.
   * @param {object} data - The data to send in the request body.
   * @param {{ skipRefresh?: boolean }} [options]
   * @returns {Promise<object|null>} A promise resolving to the JSON response body (null if empty).
   */
  post(endpoint, data, options) {
    return request(endpoint, { ...options, method: 'POST', data });
  },

  /**
   * Performs a PUT request to the API.
   * @param {string} endpoint - The API path.
   * @param {object} data - The data to send in the request body.
   * @returns {Promise<object|null>} A promise resolving to the JSON response body (null if empty).
   */
  put(endpoint, data) {
    return request(endpoint, { method: 'PUT', data });
  },

  /**
   * Performs a PATCH request to the API.
   * @param {string} endpoint - The API path.
   * @param {object} data - The data to send in the request body.
   * @returns {Promise<object|null>} A promise resolving to the JSON response body (null if empty).
   */
  patch(endpoint, data) {
    return request(endpoint, { method: 'PATCH', data });
  },

  /**
   * Performs a DELETE request to the API.
   * @param {string} endpoint - The API path.
   * @param {object} [data] - Optional JSON body (e.g. a password confirmation).
   * @returns {Promise<object|null>} A promise resolving to the JSON response body (null if empty).
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
