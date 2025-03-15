/**
 * Currency utility functions
 */

// Get available currencies from environment variables
export const getAvailableCurrencies = (): string[] => {
  const currenciesString = import.meta.env.VITE_AVAILABLE_CURRENCIES || 'USD,EUR,NOK';
  return currenciesString.split(',').map((currency: string) => currency.trim());
};

// Get default currency from environment variables
export const getDefaultCurrency = (): string => {
  return import.meta.env.VITE_DEFAULT_CURRENCY || 'USD';
};

// Currency symbols for common currencies
export const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  NOK: 'kr',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
};

// Get currency symbol for a given currency code
export const getCurrencySymbol = (currencyCode: string): string => {
  return currencySymbols[currencyCode] || currencyCode;
};

// Format price with currency symbol
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  const symbol = getCurrencySymbol(currency);
  
  // Different formatting based on currency
  if (currency === 'JPY') {
    // JPY doesn't use decimal places
    return `${symbol}${Math.round(price)}`;
  } else if (currency === 'NOK') {
    // NOK typically shows the symbol after the amount
    return `${price.toFixed(2)} ${symbol}`;
  } else {
    // Default format with symbol before the amount
    return `${symbol}${price.toFixed(2)}`;
  }
}; 