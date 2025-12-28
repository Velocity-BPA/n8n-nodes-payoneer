/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Payoneer Supported Currencies
 * List of currencies supported by Payoneer for various operations
 */

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  minAmount?: number;
  maxAmount?: number;
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    decimals: 2,
    minAmount: 0.01,
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    decimals: 2,
    minAmount: 0.01,
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    decimals: 2,
    minAmount: 0.01,
  },
  JPY: {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    decimals: 0,
    minAmount: 1,
  },
  CAD: {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    decimals: 2,
    minAmount: 0.01,
  },
  AUD: {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    decimals: 2,
    minAmount: 0.01,
  },
  CHF: {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    decimals: 2,
    minAmount: 0.01,
  },
  CNY: {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    decimals: 2,
    minAmount: 0.01,
  },
  HKD: {
    code: 'HKD',
    name: 'Hong Kong Dollar',
    symbol: 'HK$',
    decimals: 2,
    minAmount: 0.01,
  },
  SGD: {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    decimals: 2,
    minAmount: 0.01,
  },
  INR: {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    decimals: 2,
    minAmount: 0.01,
  },
  MXN: {
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: 'MX$',
    decimals: 2,
    minAmount: 0.01,
  },
  BRL: {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    decimals: 2,
    minAmount: 0.01,
  },
  PHP: {
    code: 'PHP',
    name: 'Philippine Peso',
    symbol: '₱',
    decimals: 2,
    minAmount: 0.01,
  },
  PLN: {
    code: 'PLN',
    name: 'Polish Zloty',
    symbol: 'zł',
    decimals: 2,
    minAmount: 0.01,
  },
  SEK: {
    code: 'SEK',
    name: 'Swedish Krona',
    symbol: 'kr',
    decimals: 2,
    minAmount: 0.01,
  },
  NOK: {
    code: 'NOK',
    name: 'Norwegian Krone',
    symbol: 'kr',
    decimals: 2,
    minAmount: 0.01,
  },
  DKK: {
    code: 'DKK',
    name: 'Danish Krone',
    symbol: 'kr',
    decimals: 2,
    minAmount: 0.01,
  },
  NZD: {
    code: 'NZD',
    name: 'New Zealand Dollar',
    symbol: 'NZ$',
    decimals: 2,
    minAmount: 0.01,
  },
  ZAR: {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    decimals: 2,
    minAmount: 0.01,
  },
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    decimals: 2,
    minAmount: 0.01,
  },
  THB: {
    code: 'THB',
    name: 'Thai Baht',
    symbol: '฿',
    decimals: 2,
    minAmount: 0.01,
  },
  IDR: {
    code: 'IDR',
    name: 'Indonesian Rupiah',
    symbol: 'Rp',
    decimals: 0,
    minAmount: 1,
  },
  MYR: {
    code: 'MYR',
    name: 'Malaysian Ringgit',
    symbol: 'RM',
    decimals: 2,
    minAmount: 0.01,
  },
  VND: {
    code: 'VND',
    name: 'Vietnamese Dong',
    symbol: '₫',
    decimals: 0,
    minAmount: 1,
  },
  KRW: {
    code: 'KRW',
    name: 'South Korean Won',
    symbol: '₩',
    decimals: 0,
    minAmount: 1,
  },
  ILS: {
    code: 'ILS',
    name: 'Israeli Shekel',
    symbol: '₪',
    decimals: 2,
    minAmount: 0.01,
  },
  TRY: {
    code: 'TRY',
    name: 'Turkish Lira',
    symbol: '₺',
    decimals: 2,
    minAmount: 0.01,
  },
  CZK: {
    code: 'CZK',
    name: 'Czech Koruna',
    symbol: 'Kč',
    decimals: 2,
    minAmount: 0.01,
  },
  HUF: {
    code: 'HUF',
    name: 'Hungarian Forint',
    symbol: 'Ft',
    decimals: 0,
    minAmount: 1,
  },
  RON: {
    code: 'RON',
    name: 'Romanian Leu',
    symbol: 'lei',
    decimals: 2,
    minAmount: 0.01,
  },
  BGN: {
    code: 'BGN',
    name: 'Bulgarian Lev',
    symbol: 'лв',
    decimals: 2,
    minAmount: 0.01,
  },
  HRK: {
    code: 'HRK',
    name: 'Croatian Kuna',
    symbol: 'kn',
    decimals: 2,
    minAmount: 0.01,
  },
  RUB: {
    code: 'RUB',
    name: 'Russian Ruble',
    symbol: '₽',
    decimals: 2,
    minAmount: 0.01,
  },
  UAH: {
    code: 'UAH',
    name: 'Ukrainian Hryvnia',
    symbol: '₴',
    decimals: 2,
    minAmount: 0.01,
  },
  PKR: {
    code: 'PKR',
    name: 'Pakistani Rupee',
    symbol: '₨',
    decimals: 2,
    minAmount: 0.01,
  },
  BDT: {
    code: 'BDT',
    name: 'Bangladeshi Taka',
    symbol: '৳',
    decimals: 2,
    minAmount: 0.01,
  },
  NGN: {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    decimals: 2,
    minAmount: 0.01,
  },
  EGP: {
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: 'E£',
    decimals: 2,
    minAmount: 0.01,
  },
  KES: {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    decimals: 2,
    minAmount: 0.01,
  },
  GHS: {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: 'GH₵',
    decimals: 2,
    minAmount: 0.01,
  },
  COP: {
    code: 'COP',
    name: 'Colombian Peso',
    symbol: 'COL$',
    decimals: 0,
    minAmount: 1,
  },
  ARS: {
    code: 'ARS',
    name: 'Argentine Peso',
    symbol: 'AR$',
    decimals: 2,
    minAmount: 0.01,
  },
  CLP: {
    code: 'CLP',
    name: 'Chilean Peso',
    symbol: 'CLP$',
    decimals: 0,
    minAmount: 1,
  },
  PEN: {
    code: 'PEN',
    name: 'Peruvian Sol',
    symbol: 'S/',
    decimals: 2,
    minAmount: 0.01,
  },
};

/**
 * Currency options for n8n dropdown
 */
export const CURRENCY_OPTIONS = Object.entries(CURRENCIES).map(([code, info]) => ({
  name: `${info.name} (${code})`,
  value: code,
}));

/**
 * Primary receiving currencies (for Global Payment Service)
 */
export const RECEIVING_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CNY'];

/**
 * Get currency info by code
 */
export function getCurrencyInfo(code: string): CurrencyInfo | undefined {
  return CURRENCIES[code.toUpperCase()];
}

/**
 * Validate currency code
 */
export function isValidCurrency(code: string): boolean {
  return code.toUpperCase() in CURRENCIES;
}

/**
 * Format amount for currency
 */
export function formatCurrencyAmount(amount: number, currencyCode: string): string {
  const currency = getCurrencyInfo(currencyCode);
  if (!currency) {
    return amount.toFixed(2);
  }
  return amount.toFixed(currency.decimals);
}
