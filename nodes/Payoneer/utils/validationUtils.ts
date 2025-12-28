/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { isValidCurrency, getCurrencyInfo } from '../constants/currencies';
import { isValidCountry } from '../constants/countries';

/**
 * Validation utilities for Payoneer API operations
 */

/**
 * Validate email address format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate IBAN format
 */
export function validateIBAN(iban: string): boolean {
  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();

  // Basic format check: 2 letters followed by 2 digits and up to 30 alphanumeric chars
  const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
  if (!ibanRegex.test(cleanIban)) {
    return false;
  }

  // Move first 4 characters to end
  const rearranged = cleanIban.slice(4) + cleanIban.slice(0, 4);

  // Convert letters to numbers (A=10, B=11, etc.)
  const numericString = rearranged
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      return code >= 65 && code <= 90 ? (code - 55).toString() : char;
    })
    .join('');

  // Perform mod 97 check
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i], 10)) % 97;
  }

  return remainder === 1;
}

/**
 * Validate SWIFT/BIC code format
 */
export function validateSWIFT(swift: string): boolean {
  // SWIFT codes are 8 or 11 characters
  const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  return swiftRegex.test(swift.toUpperCase());
}

/**
 * Validate US routing number
 */
export function validateRoutingNumber(routingNumber: string): boolean {
  // US routing numbers are 9 digits
  if (!/^\d{9}$/.test(routingNumber)) {
    return false;
  }

  // Checksum validation
  const digits = routingNumber.split('').map(Number);
  const checksum =
    3 * (digits[0] + digits[3] + digits[6]) +
    7 * (digits[1] + digits[4] + digits[7]) +
    (digits[2] + digits[5] + digits[8]);

  return checksum % 10 === 0;
}

/**
 * Validate account number format
 */
export function validateAccountNumber(accountNumber: string, country: string): boolean {
  // Remove spaces and dashes
  const cleanNumber = accountNumber.replace(/[\s-]/g, '');

  switch (country.toUpperCase()) {
    case 'US':
      // US account numbers are typically 10-12 digits
      return /^\d{10,12}$/.test(cleanNumber);
    case 'GB':
      // UK account numbers are 8 digits
      return /^\d{8}$/.test(cleanNumber);
    case 'CA':
      // Canadian account numbers are typically 7-12 digits
      return /^\d{7,12}$/.test(cleanNumber);
    default:
      // Generic validation: 5-34 alphanumeric characters
      return /^[A-Z0-9]{5,34}$/i.test(cleanNumber);
  }
}

/**
 * Validate amount
 */
export function validateAmount(amount: number, currencyCode: string): { valid: boolean; message?: string } {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return { valid: false, message: 'Amount must be a valid number' };
  }

  if (amount <= 0) {
    return { valid: false, message: 'Amount must be greater than zero' };
  }

  const currency = getCurrencyInfo(currencyCode);
  if (!currency) {
    return { valid: false, message: `Invalid currency code: ${currencyCode}` };
  }

  if (currency.minAmount && amount < currency.minAmount) {
    return { valid: false, message: `Amount must be at least ${currency.minAmount} ${currencyCode}` };
  }

  if (currency.maxAmount && amount > currency.maxAmount) {
    return { valid: false, message: `Amount cannot exceed ${currency.maxAmount} ${currencyCode}` };
  }

  // Check decimal places
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  if (decimalPlaces > currency.decimals) {
    return { valid: false, message: `${currencyCode} supports maximum ${currency.decimals} decimal places` };
  }

  return { valid: true };
}

/**
 * Validate currency code
 */
export function validateCurrencyCode(code: string): boolean {
  return isValidCurrency(code);
}

/**
 * Validate country code
 */
export function validateCountryCode(code: string): boolean {
  return isValidCountry(code);
}

/**
 * Validate phone number
 */
export function validatePhoneNumber(phone: string): boolean {
  // Remove common formatting characters
  const cleanPhone = phone.replace(/[\s\-().+]/g, '');
  // Basic validation: 7-15 digits
  return /^\d{7,15}$/.test(cleanPhone);
}

/**
 * Validate date format (ISO 8601)
 */
export function validateISODate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString === date.toISOString().split('T')[0];
}

/**
 * Validate date-time format (ISO 8601)
 */
export function validateISODateTime(dateTimeString: string): boolean {
  const date = new Date(dateTimeString);
  return !isNaN(date.getTime());
}

/**
 * Validate payee ID format
 */
export function validatePayeeId(payeeId: string): boolean {
  // Payee IDs are typically alphanumeric, 8-36 characters
  return /^[a-zA-Z0-9_-]{8,36}$/.test(payeeId);
}

/**
 * Validate payment ID format
 */
export function validatePaymentId(paymentId: string): boolean {
  // Payment IDs are typically alphanumeric, 8-36 characters
  return /^[a-zA-Z0-9_-]{8,36}$/.test(paymentId);
}

/**
 * Validate reference/external ID format
 */
export function validateReference(reference: string): boolean {
  // References should be 1-64 characters, alphanumeric with some special chars
  return /^[a-zA-Z0-9_\-.:]{1,64}$/.test(reference);
}

/**
 * Validate URL format
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate webhook URL (must be HTTPS)
 */
export function validateWebhookURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>'"]/g, '');
}

/**
 * Validate pagination parameters
 */
export function validatePagination(page: number, pageSize: number): { valid: boolean; message?: string } {
  if (!Number.isInteger(page) || page < 1) {
    return { valid: false, message: 'Page must be a positive integer' };
  }
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    return { valid: false, message: 'Page size must be between 1 and 100' };
  }
  return { valid: true };
}
