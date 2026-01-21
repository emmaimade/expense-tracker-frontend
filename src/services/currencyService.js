import { API_BASE_URL } from './apiService';

/**
 * Public currency detection using backend endpoint (no auth required)
 * Returns { success, currency, symbol, detectedFrom, message } or null on failure
 */
export const detectCurrency = async (timeoutMs = 3000) => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(`${API_BASE_URL}/user/detect-currency`, { signal: controller.signal });
    clearTimeout(id);

    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch (err) {
    console.debug('currencyService.detectCurrency failed:', err?.message || err);
    return null;
  }
};
