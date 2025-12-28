/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { getCurrencyInfo, CurrencyInfo } from '../constants/currencies';

/**
 * Currency utilities for Payoneer operations
 */

/**
 * Format amount for display with currency symbol
 */
export function formatAmount(amount: number, currencyCode: string): string {
  const currency = getCurrencyInfo(currencyCode);
  if (!currency) {
    return `${amount.toFixed(2)} ${currencyCode}`;
  }

  const formattedAmount = amount.toFixed(currency.decimals);

  // Format based on currency
  switch (currencyCode) {
    case 'USD':
    case 'CAD':
    case 'AUD':
    case 'NZD':
    case 'HKD':
    case 'SGD':
      return `${currency.symbol}${formattedAmount}`;
    case 'EUR':
      return `€${formattedAmount}`;
    case 'GBP':
      return `£${formattedAmount}`;
    case 'JPY':
      return `¥${formattedAmount}`;
    default:
      return `${formattedAmount} ${currencyCode}`;
  }
}

/**
 * Convert amount to minor units (cents, pence, etc.)
 */
export function toMinorUnits(amount: number, currencyCode: string): number {
  const currency = getCurrencyInfo(currencyCode);
  if (!currency) {
    return Math.round(amount * 100);
  }
  return Math.round(amount * Math.pow(10, currency.decimals));
}

/**
 * Convert amount from minor units to major units
 */
export function fromMinorUnits(minorUnits: number, currencyCode: string): number {
  const currency = getCurrencyInfo(currencyCode);
  if (!currency) {
    return minorUnits / 100;
  }
  return minorUnits / Math.pow(10, currency.decimals);
}

/**
 * Round amount to currency precision
 */
export function roundToCurrency(amount: number, currencyCode: string): number {
  const currency = getCurrencyInfo(currencyCode);
  const decimals = currency?.decimals ?? 2;
  const factor = Math.pow(10, decimals);
  return Math.round(amount * factor) / factor;
}

/**
 * Calculate exchange amount
 */
export function calculateExchange(
  amount: number,
  rate: number,
  fromCurrency: string,
  toCurrency: string,
): number {
  const convertedAmount = amount * rate;
  return roundToCurrency(convertedAmount, toCurrency);
}

/**
 * Calculate fee
 */
export function calculateFee(
  amount: number,
  feePercentage: number,
  minFee: number = 0,
  maxFee: number = Infinity,
  currencyCode: string = 'USD',
): number {
  const calculatedFee = amount * (feePercentage / 100);
  const fee = Math.max(minFee, Math.min(maxFee, calculatedFee));
  return roundToCurrency(fee, currencyCode);
}

/**
 * Calculate net amount after fee
 */
export function calculateNetAmount(
  grossAmount: number,
  feePercentage: number,
  minFee: number = 0,
  currencyCode: string = 'USD',
): { netAmount: number; fee: number } {
  const fee = calculateFee(grossAmount, feePercentage, minFee, Infinity, currencyCode);
  const netAmount = roundToCurrency(grossAmount - fee, currencyCode);
  return { netAmount, fee };
}

/**
 * Validate and normalize amount
 */
export function normalizeAmount(amount: number | string, currencyCode: string): number {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    throw new Error('Invalid amount');
  }

  return roundToCurrency(numericAmount, currencyCode);
}

/**
 * Parse amount string to number
 */
export function parseAmountString(amountStr: string): number {
  // Remove currency symbols and formatting
  const cleaned = amountStr.replace(/[^\d.-]/g, '');
  const amount = parseFloat(cleaned);

  if (isNaN(amount)) {
    throw new Error(`Invalid amount string: ${amountStr}`);
  }

  return amount;
}

/**
 * Get currency info or throw
 */
export function getCurrencyOrThrow(currencyCode: string): CurrencyInfo {
  const currency = getCurrencyInfo(currencyCode);
  if (!currency) {
    throw new Error(`Unsupported currency: ${currencyCode}`);
  }
  return currency;
}

/**
 * Check if currency pair is supported for exchange
 */
export function isCurrencyPairSupported(fromCurrency: string, toCurrency: string): boolean {
  const from = getCurrencyInfo(fromCurrency);
  const to = getCurrencyInfo(toCurrency);
  return !!(from && to && fromCurrency !== toCurrency);
}

/**
 * Format exchange rate for display
 */
export function formatExchangeRate(
  rate: number,
  fromCurrency: string,
  toCurrency: string,
  decimals: number = 4,
): string {
  return `1 ${fromCurrency} = ${rate.toFixed(decimals)} ${toCurrency}`;
}

/**
 * Calculate inverse exchange rate
 */
export function inverseRate(rate: number): number {
  if (rate === 0) {
    throw new Error('Cannot calculate inverse of zero rate');
  }
  return 1 / rate;
}

/**
 * Split amount into multiple currencies
 */
export function splitAmount(
  totalAmount: number,
  splits: Array<{ currency: string; percentage: number }>,
  sourceCurrency: string,
  rates: Record<string, number>,
): Array<{ currency: string; amount: number }> {
  // Validate percentages sum to 100
  const totalPercentage = splits.reduce((sum, split) => sum + split.percentage, 0);
  if (Math.abs(totalPercentage - 100) > 0.001) {
    throw new Error('Split percentages must sum to 100');
  }

  return splits.map((split) => {
    const sourceAmount = totalAmount * (split.percentage / 100);

    if (split.currency === sourceCurrency) {
      return {
        currency: split.currency,
        amount: roundToCurrency(sourceAmount, split.currency),
      };
    }

    const rate = rates[`${sourceCurrency}_${split.currency}`];
    if (!rate) {
      throw new Error(`Exchange rate not found for ${sourceCurrency} to ${split.currency}`);
    }

    return {
      currency: split.currency,
      amount: calculateExchange(sourceAmount, rate, sourceCurrency, split.currency),
    };
  });
}
