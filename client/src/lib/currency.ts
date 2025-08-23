export const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  INR: '₹',
} as const;

export type Currency = keyof typeof currencySymbols;

export const currencies = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'INR', label: 'INR (₹)' },
] as const;

export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = currencySymbols[currency];
  return `${symbol}${formatNumber(amount)}`;
}

export function formatNumber(num: number): string {
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getCurrencySymbol(currency: Currency): string {
  return currencySymbols[currency];
}
