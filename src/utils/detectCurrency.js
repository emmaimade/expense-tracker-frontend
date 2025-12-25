// Utility to detect user's currency via IP lookup with a locale fallback

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
  // add more as needed
};

export async function detectCurrencyByIP(timeoutMs = 3000) {
  try {
    // Simple fetch to ipapi.co - returns JSON with a `currency` property
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(id);

    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.currency) return json.currency.toUpperCase();
    return null;
  } catch (err) {
    // Network errors or aborts are expected in some environments
    console.debug('detectCurrencyByIP failed:', err?.message || err);
    return null;
  }
}

export function detectCurrencyByLocale() {
  try {
    const locale = navigator.language || navigator.userLanguage || 'en-US';
    const region = (locale.split('-')[1] || '').toUpperCase();
    if (region && REGION_TO_CURRENCY[region]) return REGION_TO_CURRENCY[region];
    // try matching country codes like 'en-US' -> 'US', else fallback to USD
    return null;
  } catch (err) {
    console.debug('detectCurrencyByLocale failed:', err?.message || err);
    return null;
  }
}
