/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { validateIBAN, validateSWIFT, validateRoutingNumber, validateAccountNumber } from './validationUtils';

/**
 * Bank utilities for Payoneer operations
 */

/**
 * Bank account details interface
 */
export interface BankAccountDetails {
  accountNumber: string;
  routingNumber?: string;
  swiftCode?: string;
  iban?: string;
  bankName?: string;
  bankAddress?: string;
  accountHolderName: string;
  accountType: 'checking' | 'savings' | 'business';
  country: string;
  currency: string;
}

/**
 * Validate bank account details based on country
 */
export function validateBankDetails(details: BankAccountDetails): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate account holder name
  if (!details.accountHolderName || details.accountHolderName.trim().length < 2) {
    errors.push('Account holder name is required');
  }

  // Country-specific validation
  switch (details.country.toUpperCase()) {
    case 'US':
      // US requires routing number and account number
      if (!details.routingNumber) {
        errors.push('Routing number is required for US accounts');
      } else if (!validateRoutingNumber(details.routingNumber)) {
        errors.push('Invalid US routing number');
      }
      if (!validateAccountNumber(details.accountNumber, 'US')) {
        errors.push('Invalid US account number');
      }
      break;

    case 'GB':
      // UK requires sort code (as routing) and account number
      if (!details.routingNumber) {
        errors.push('Sort code is required for UK accounts');
      } else if (!/^\d{6}$/.test(details.routingNumber.replace(/-/g, ''))) {
        errors.push('Invalid UK sort code');
      }
      if (!validateAccountNumber(details.accountNumber, 'GB')) {
        errors.push('Invalid UK account number');
      }
      break;

    case 'DE':
    case 'FR':
    case 'ES':
    case 'IT':
    case 'NL':
    case 'BE':
    case 'AT':
      // Eurozone requires IBAN
      if (!details.iban) {
        errors.push('IBAN is required for European accounts');
      } else if (!validateIBAN(details.iban)) {
        errors.push('Invalid IBAN');
      }
      break;

    default:
      // International requires SWIFT and account number
      if (!details.swiftCode) {
        errors.push('SWIFT/BIC code is required for international accounts');
      } else if (!validateSWIFT(details.swiftCode)) {
        errors.push('Invalid SWIFT/BIC code');
      }
      if (!details.accountNumber || details.accountNumber.length < 5) {
        errors.push('Valid account number is required');
      }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format bank account number for display (masked)
 */
export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) {
    return '*'.repeat(accountNumber.length);
  }
  return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
}

/**
 * Format IBAN for display (with spaces)
 */
export function formatIBAN(iban: string): string {
  const clean = iban.replace(/\s/g, '').toUpperCase();
  return clean.match(/.{1,4}/g)?.join(' ') || clean;
}

/**
 * Extract country code from IBAN
 */
export function getCountryFromIBAN(iban: string): string {
  return iban.replace(/\s/g, '').substring(0, 2).toUpperCase();
}

/**
 * Format UK sort code
 */
export function formatSortCode(sortCode: string): string {
  const clean = sortCode.replace(/\D/g, '');
  if (clean.length !== 6) {
    return sortCode;
  }
  return `${clean.slice(0, 2)}-${clean.slice(2, 4)}-${clean.slice(4, 6)}`;
}

/**
 * Format US routing number
 */
export function formatRoutingNumber(routingNumber: string): string {
  // US routing numbers don't typically have formatting, just ensure clean
  return routingNumber.replace(/\D/g, '');
}

/**
 * Get bank info from SWIFT code
 */
export function parseSWIFTCode(swift: string): {
  bankCode: string;
  countryCode: string;
  locationCode: string;
  branchCode?: string;
} {
  const clean = swift.replace(/\s/g, '').toUpperCase();

  return {
    bankCode: clean.substring(0, 4),
    countryCode: clean.substring(4, 6),
    locationCode: clean.substring(6, 8),
    branchCode: clean.length === 11 ? clean.substring(8, 11) : undefined,
  };
}

/**
 * Build SWIFT code
 */
export function buildSWIFTCode(
  bankCode: string,
  countryCode: string,
  locationCode: string,
  branchCode?: string,
): string {
  const base = `${bankCode}${countryCode}${locationCode}`.toUpperCase();
  return branchCode ? `${base}${branchCode.toUpperCase()}` : base;
}

/**
 * Determine bank transfer type based on details
 */
export function getBankTransferType(
  fromCountry: string,
  toCountry: string,
  currency: string,
): 'domestic' | 'sepa' | 'swift' | 'local' {
  const fromUpper = fromCountry.toUpperCase();
  const toUpper = toCountry.toUpperCase();

  // Same country = domestic
  if (fromUpper === toUpper) {
    return 'domestic';
  }

  // SEPA zone countries
  const sepaCountries = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
    'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
    'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'IS', 'LI',
    'NO', 'CH', 'MC', 'SM', 'VA',
  ];

  // EUR transfers within SEPA zone
  if (
    currency === 'EUR' &&
    sepaCountries.includes(fromUpper) &&
    sepaCountries.includes(toUpper)
  ) {
    return 'sepa';
  }

  // Check for local transfer networks
  const localTransferCountries = ['AU', 'SG', 'HK', 'IN', 'JP'];
  if (localTransferCountries.includes(toUpper)) {
    return 'local';
  }

  // Default to SWIFT
  return 'swift';
}

/**
 * Get required fields for bank account by country
 */
export function getRequiredBankFields(country: string): string[] {
  switch (country.toUpperCase()) {
    case 'US':
      return ['accountNumber', 'routingNumber', 'accountHolderName', 'accountType'];
    case 'GB':
      return ['accountNumber', 'routingNumber', 'accountHolderName']; // routingNumber = sort code
    case 'CA':
      return ['accountNumber', 'routingNumber', 'institutionNumber', 'accountHolderName'];
    case 'AU':
      return ['accountNumber', 'bsb', 'accountHolderName'];
    case 'DE':
    case 'FR':
    case 'ES':
    case 'IT':
    case 'NL':
    case 'BE':
    case 'AT':
    case 'PT':
    case 'IE':
      return ['iban', 'accountHolderName'];
    default:
      return ['accountNumber', 'swiftCode', 'accountHolderName'];
  }
}

/**
 * Estimate transfer time based on transfer type
 */
export function estimateTransferTime(transferType: 'domestic' | 'sepa' | 'swift' | 'local'): string {
  switch (transferType) {
    case 'domestic':
      return '1-2 business days';
    case 'sepa':
      return '1-2 business days';
    case 'local':
      return '0-1 business days';
    case 'swift':
      return '2-5 business days';
    default:
      return '2-5 business days';
  }
}
