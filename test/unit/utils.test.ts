/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  validateEmail,
  validateIBAN,
  validateSWIFT,
  validateRoutingNumber,
  validateAmount,
  validatePhoneNumber,
} from '../nodes/Payoneer/utils/validationUtils';

import {
  formatAmount,
  toMinorUnits,
  fromMinorUnits,
  roundToCurrency,
  calculateFee,
} from '../nodes/Payoneer/utils/currencyUtils';

import {
  generateHmacSignature,
  verifyWebhookSignature,
  generateIdempotencyKey,
} from '../nodes/Payoneer/utils/signatureUtils';

import { getCurrencyInfo, isValidCurrency } from '../nodes/Payoneer/constants/currencies';
import { getCountryInfo, isValidCountry } from '../nodes/Payoneer/constants/countries';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test @example.com')).toBe(false);
    });
  });

  describe('validateIBAN', () => {
    it('should validate correct IBAN numbers', () => {
      expect(validateIBAN('DE89370400440532013000')).toBe(true);
      expect(validateIBAN('GB82 WEST 1234 5698 7654 32')).toBe(true);
    });

    it('should reject invalid IBAN numbers', () => {
      expect(validateIBAN('DE00000000000000000000')).toBe(false);
      expect(validateIBAN('INVALID')).toBe(false);
      expect(validateIBAN('123456')).toBe(false);
    });
  });

  describe('validateSWIFT', () => {
    it('should validate correct SWIFT codes', () => {
      expect(validateSWIFT('DEUTDEFF')).toBe(true);
      expect(validateSWIFT('DEUTDEFF500')).toBe(true);
      expect(validateSWIFT('CHASUS33')).toBe(true);
    });

    it('should reject invalid SWIFT codes', () => {
      expect(validateSWIFT('DEUT')).toBe(false);
      expect(validateSWIFT('123456789')).toBe(false);
      expect(validateSWIFT('INVALID-CODE')).toBe(false);
    });
  });

  describe('validateRoutingNumber', () => {
    it('should validate correct US routing numbers', () => {
      expect(validateRoutingNumber('021000021')).toBe(true);
      expect(validateRoutingNumber('121042882')).toBe(true);
    });

    it('should reject invalid routing numbers', () => {
      expect(validateRoutingNumber('12345678')).toBe(false);
      expect(validateRoutingNumber('1234567890')).toBe(false);
      expect(validateRoutingNumber('000000000')).toBe(false);
    });
  });

  describe('validateAmount', () => {
    it('should validate correct amounts', () => {
      expect(validateAmount(100, 'USD').valid).toBe(true);
      expect(validateAmount(0.01, 'USD').valid).toBe(true);
      expect(validateAmount(1000000, 'EUR').valid).toBe(true);
    });

    it('should reject invalid amounts', () => {
      expect(validateAmount(0, 'USD').valid).toBe(false);
      expect(validateAmount(-100, 'USD').valid).toBe(false);
      expect(validateAmount(NaN, 'USD').valid).toBe(false);
    });

    it('should validate decimal places for currency', () => {
      expect(validateAmount(100.123, 'USD').valid).toBe(false);
      expect(validateAmount(100.12, 'USD').valid).toBe(true);
      expect(validateAmount(100, 'JPY').valid).toBe(true);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhoneNumber('+1234567890')).toBe(true);
      expect(validatePhoneNumber('123-456-7890')).toBe(true);
      expect(validatePhoneNumber('(123) 456-7890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('123')).toBe(false);
      expect(validatePhoneNumber('abcdefghij')).toBe(false);
    });
  });
});

describe('Currency Utils', () => {
  describe('formatAmount', () => {
    it('should format amounts correctly', () => {
      expect(formatAmount(100, 'USD')).toBe('$100.00');
      expect(formatAmount(1000.5, 'EUR')).toBe('€1000.50');
      expect(formatAmount(10000, 'JPY')).toBe('¥10000');
    });
  });

  describe('toMinorUnits', () => {
    it('should convert to minor units correctly', () => {
      expect(toMinorUnits(100, 'USD')).toBe(10000);
      expect(toMinorUnits(10.50, 'EUR')).toBe(1050);
      expect(toMinorUnits(1000, 'JPY')).toBe(1000);
    });
  });

  describe('fromMinorUnits', () => {
    it('should convert from minor units correctly', () => {
      expect(fromMinorUnits(10000, 'USD')).toBe(100);
      expect(fromMinorUnits(1050, 'EUR')).toBe(10.50);
      expect(fromMinorUnits(1000, 'JPY')).toBe(1000);
    });
  });

  describe('roundToCurrency', () => {
    it('should round to correct decimal places', () => {
      expect(roundToCurrency(100.126, 'USD')).toBe(100.13);
      expect(roundToCurrency(100.124, 'USD')).toBe(100.12);
      expect(roundToCurrency(100.5, 'JPY')).toBe(101);
    });
  });

  describe('calculateFee', () => {
    it('should calculate fees correctly', () => {
      expect(calculateFee(1000, 1, 0, Infinity, 'USD')).toBe(10);
      expect(calculateFee(100, 2.5, 0, Infinity, 'USD')).toBe(2.5);
    });

    it('should respect minimum fees', () => {
      expect(calculateFee(10, 1, 1, Infinity, 'USD')).toBe(1);
    });

    it('should respect maximum fees', () => {
      expect(calculateFee(10000, 5, 0, 100, 'USD')).toBe(100);
    });
  });
});

describe('Signature Utils', () => {
  describe('generateHmacSignature', () => {
    it('should generate consistent signatures', () => {
      const payload = 'test payload';
      const secret = 'test_secret';
      const sig1 = generateHmacSignature(payload, secret);
      const sig2 = generateHmacSignature(payload, secret);
      expect(sig1).toBe(sig2);
    });

    it('should generate different signatures for different payloads', () => {
      const secret = 'test_secret';
      const sig1 = generateHmacSignature('payload1', secret);
      const sig2 = generateHmacSignature('payload2', secret);
      expect(sig1).not.toBe(sig2);
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should verify correct signatures', () => {
      const payload = 'test payload';
      const secret = 'test_secret';
      const signature = generateHmacSignature(payload, secret);
      expect(verifyWebhookSignature(payload, signature, secret)).toBe(true);
    });

    it('should reject incorrect signatures', () => {
      const payload = 'test payload';
      const secret = 'test_secret';
      expect(verifyWebhookSignature(payload, 'invalid_signature', secret)).toBe(false);
    });
  });

  describe('generateIdempotencyKey', () => {
    it('should generate unique keys', () => {
      const key1 = generateIdempotencyKey();
      const key2 = generateIdempotencyKey();
      expect(key1).not.toBe(key2);
    });

    it('should generate keys with expected format', () => {
      const key = generateIdempotencyKey();
      expect(key).toMatch(/^\d+-[a-f0-9]+$/);
    });
  });
});

describe('Constants', () => {
  describe('Currencies', () => {
    it('should have valid currency info', () => {
      const usd = getCurrencyInfo('USD');
      expect(usd).toBeDefined();
      expect(usd?.code).toBe('USD');
      expect(usd?.decimals).toBe(2);
    });

    it('should validate currency codes', () => {
      expect(isValidCurrency('USD')).toBe(true);
      expect(isValidCurrency('EUR')).toBe(true);
      expect(isValidCurrency('INVALID')).toBe(false);
    });
  });

  describe('Countries', () => {
    it('should have valid country info', () => {
      const us = getCountryInfo('US');
      expect(us).toBeDefined();
      expect(us?.code).toBe('US');
      expect(us?.currency).toBe('USD');
    });

    it('should validate country codes', () => {
      expect(isValidCountry('US')).toBe(true);
      expect(isValidCountry('GB')).toBe(true);
      expect(isValidCountry('XX')).toBe(false);
    });
  });
});
