/**
 * Utility functions for detecting the user's local currency.
 * Attempts IP-based geolocation first, with a locale-derived fallback.
 *
 * @module currencyDetection
 */

/**
 * A static map of ISO 3166-1 alpha-2 region codes to their corresponding
 * ISO 4217 currency codes. Used as a lookup table for locale-based detection.
 *
 * @type {Record<string, string>}
 */
const REGION_TO_CURRENCY = {
  US: 'USD',
  GB: 'GBP',
  IN: 'INR',
  NG: 'NGN',
  FR: 'EUR',
  DE: 'EUR',
  ES: 'EUR',
  IT: 'EUR',
  CA: 'CAD',
  AU: 'AUD',
  JP: 'JPY',
  CN: 'CNY',
};

/**
 * Attempts to detect the user's currency via an IP geolocation API call.
 * Aborts the request if it does not resolve within the specified timeout.
 * Returns null on network failure, timeout, or an unrecognized API response,
 * allowing the caller to fall back to an alternative detection strategy.
 *
 * @async
 * @param {number} [timeoutMs=3000] - Maximum time in milliseconds to wait for the geolocation response.
 * @returns {Promise<string | null>} Resolved ISO 4217 currency code in uppercase (e.g., "USD"), or null on failure.
 */
export async function detectCurrencyByIP(timeoutMs = 3000) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(id);

    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.currency) return json.currency.toUpperCase();
    return null;
  } catch {
    return null;
  }
}

/**
 * Attempts to detect the user's currency from the browser's locale setting.
 * Extracts the region subtag from `navigator.language` (e.g., "en-US" → "US")
 * and maps it to a currency code via the {@link REGION_TO_CURRENCY} lookup table.
 * Returns null if the region is absent, unrecognized, or if the environment
 * does not expose a navigator locale.
 *
 * @returns {string | null} An ISO 4217 currency code in uppercase (e.g., "GBP"), or null if unresolvable.
 */
export function detectCurrencyByLocale() {
  try {
    const locale = navigator.language || navigator.userLanguage || 'en-US';
    const region = (locale.split('-')[1] || '').toUpperCase();
    if (region && REGION_TO_CURRENCY[region]) return REGION_TO_CURRENCY[region];
    return null;
  } catch {
    return null;
  }
}