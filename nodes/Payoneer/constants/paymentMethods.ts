/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Payoneer Payment Methods and Types
 */

/**
 * Payment Methods - Ways to receive funds
 */
export const PAYMENT_METHODS = {
  BANK_TRANSFER: {
    code: 'BANK_TRANSFER',
    name: 'Bank Transfer',
    description: 'Direct transfer to bank account',
  },
  PAYONEER_ACCOUNT: {
    code: 'PAYONEER_ACCOUNT',
    name: 'Payoneer Account',
    description: 'Credit to Payoneer balance',
  },
  LOCAL_BANK: {
    code: 'LOCAL_BANK',
    name: 'Local Bank Transfer',
    description: 'Country-specific local transfer',
  },
  IACH: {
    code: 'IACH',
    name: 'International ACH',
    description: 'International ACH transfer',
  },
  WIRE: {
    code: 'WIRE',
    name: 'Wire Transfer',
    description: 'SWIFT wire transfer',
  },
  SEPA: {
    code: 'SEPA',
    name: 'SEPA Transfer',
    description: 'Single Euro Payments Area transfer',
  },
  CARD: {
    code: 'CARD',
    name: 'Payoneer Card',
    description: 'Available on Payoneer card',
  },
  FASTER_PAYMENTS: {
    code: 'FASTER_PAYMENTS',
    name: 'Faster Payments',
    description: 'UK Faster Payments',
  },
  BACS: {
    code: 'BACS',
    name: 'BACS',
    description: 'UK BACS payment',
  },
  EFT: {
    code: 'EFT',
    name: 'EFT',
    description: 'Electronic Funds Transfer',
  },
  INTERAC: {
    code: 'INTERAC',
    name: 'Interac',
    description: 'Canadian Interac e-Transfer',
  },
  PAY_ID: {
    code: 'PAY_ID',
    name: 'PayID',
    description: 'Australian PayID',
  },
  NPP: {
    code: 'NPP',
    name: 'NPP',
    description: 'Australian New Payments Platform',
  },
  POLI: {
    code: 'POLI',
    name: 'POLi',
    description: 'Australian/NZ online payment',
  },
  UPI: {
    code: 'UPI',
    name: 'UPI',
    description: 'India Unified Payments Interface',
  },
  IMPS: {
    code: 'IMPS',
    name: 'IMPS',
    description: 'India Immediate Payment Service',
  },
  NEFT: {
    code: 'NEFT',
    name: 'NEFT',
    description: 'India National Electronic Funds Transfer',
  },
  RTGS: {
    code: 'RTGS',
    name: 'RTGS',
    description: 'Real Time Gross Settlement',
  },
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHODS;

/**
 * Payment Method options for n8n dropdown
 */
export const PAYMENT_METHOD_OPTIONS = Object.entries(PAYMENT_METHODS).map(([code, info]) => ({
  name: `${info.name} - ${info.description}`,
  value: code,
}));

/**
 * Withdrawal Methods
 */
export const WITHDRAWAL_METHODS = {
  BANK_TRANSFER: {
    code: 'BANK_TRANSFER',
    name: 'Bank Transfer',
    description: 'Transfer to linked bank account',
    processingTime: '1-3 business days',
  },
  LOCAL_BANK: {
    code: 'LOCAL_BANK',
    name: 'Local Bank Transfer',
    description: 'Local currency transfer',
    processingTime: '0-2 business days',
  },
  WIRE: {
    code: 'WIRE',
    name: 'Wire Transfer',
    description: 'International wire transfer',
    processingTime: '2-5 business days',
  },
  ATM: {
    code: 'ATM',
    name: 'ATM Withdrawal',
    description: 'Withdraw using Payoneer card at ATM',
    processingTime: 'Instant',
  },
  CARD: {
    code: 'CARD',
    name: 'Card Withdrawal',
    description: 'Withdraw to Payoneer card',
    processingTime: 'Instant',
  },
  PAYPAL: {
    code: 'PAYPAL',
    name: 'PayPal',
    description: 'Transfer to PayPal account',
    processingTime: '0-1 business days',
  },
} as const;

export type WithdrawalMethod = keyof typeof WITHDRAWAL_METHODS;

/**
 * Withdrawal Method options for n8n dropdown
 */
export const WITHDRAWAL_METHOD_OPTIONS = Object.entries(WITHDRAWAL_METHODS).map(([code, info]) => ({
  name: `${info.name} - ${info.processingTime}`,
  value: code,
}));

/**
 * Transaction Types
 */
export const TRANSACTION_TYPES = {
  PAYMENT: {
    code: 'PAYMENT',
    name: 'Payment',
    description: 'Payment received from payer',
  },
  PAYOUT: {
    code: 'PAYOUT',
    name: 'Payout',
    description: 'Payout to payee',
  },
  TRANSFER: {
    code: 'TRANSFER',
    name: 'Transfer',
    description: 'Internal transfer between accounts',
  },
  WITHDRAWAL: {
    code: 'WITHDRAWAL',
    name: 'Withdrawal',
    description: 'Withdrawal to bank account',
  },
  LOAD: {
    code: 'LOAD',
    name: 'Load',
    description: 'Funds added to account',
  },
  FX_CONVERSION: {
    code: 'FX_CONVERSION',
    name: 'Currency Conversion',
    description: 'Foreign exchange conversion',
  },
  FEE: {
    code: 'FEE',
    name: 'Fee',
    description: 'Service fee',
  },
  REFUND: {
    code: 'REFUND',
    name: 'Refund',
    description: 'Payment refund',
  },
  CHARGEBACK: {
    code: 'CHARGEBACK',
    name: 'Chargeback',
    description: 'Payment chargeback',
  },
  CARD_PURCHASE: {
    code: 'CARD_PURCHASE',
    name: 'Card Purchase',
    description: 'Purchase made with Payoneer card',
  },
  ATM_WITHDRAWAL: {
    code: 'ATM_WITHDRAWAL',
    name: 'ATM Withdrawal',
    description: 'Cash withdrawal from ATM',
  },
  INTEREST: {
    code: 'INTEREST',
    name: 'Interest',
    description: 'Interest earned',
  },
  ADJUSTMENT: {
    code: 'ADJUSTMENT',
    name: 'Adjustment',
    description: 'Account adjustment',
  },
  ESCROW: {
    code: 'ESCROW',
    name: 'Escrow',
    description: 'Escrow transaction',
  },
  INVOICE: {
    code: 'INVOICE',
    name: 'Invoice',
    description: 'Invoice payment',
  },
} as const;

export type TransactionType = keyof typeof TRANSACTION_TYPES;

/**
 * Transaction Type options for n8n dropdown
 */
export const TRANSACTION_TYPE_OPTIONS = Object.entries(TRANSACTION_TYPES).map(([code, info]) => ({
  name: info.name,
  value: code,
}));

/**
 * Fee Types
 */
export const FEE_TYPES = {
  PAYMENT_FEE: {
    code: 'PAYMENT_FEE',
    name: 'Payment Fee',
    description: 'Fee for receiving payment',
  },
  WITHDRAWAL_FEE: {
    code: 'WITHDRAWAL_FEE',
    name: 'Withdrawal Fee',
    description: 'Fee for withdrawing funds',
  },
  TRANSFER_FEE: {
    code: 'TRANSFER_FEE',
    name: 'Transfer Fee',
    description: 'Fee for internal transfer',
  },
  FX_FEE: {
    code: 'FX_FEE',
    name: 'Currency Conversion Fee',
    description: 'Fee for currency exchange',
  },
  CARD_FEE: {
    code: 'CARD_FEE',
    name: 'Card Fee',
    description: 'Fee for card operations',
  },
  ATM_FEE: {
    code: 'ATM_FEE',
    name: 'ATM Fee',
    description: 'Fee for ATM withdrawal',
  },
  ANNUAL_FEE: {
    code: 'ANNUAL_FEE',
    name: 'Annual Fee',
    description: 'Annual account maintenance fee',
  },
  INACTIVITY_FEE: {
    code: 'INACTIVITY_FEE',
    name: 'Inactivity Fee',
    description: 'Fee for inactive account',
  },
  WIRE_FEE: {
    code: 'WIRE_FEE',
    name: 'Wire Fee',
    description: 'Fee for wire transfer',
  },
  MINIMUM_FEE: {
    code: 'MINIMUM_FEE',
    name: 'Minimum Fee',
    description: 'Minimum transaction fee',
  },
} as const;

export type FeeType = keyof typeof FEE_TYPES;

/**
 * Fee Type options for n8n dropdown
 */
export const FEE_TYPE_OPTIONS = Object.entries(FEE_TYPES).map(([code, info]) => ({
  name: info.name,
  value: code,
}));

/**
 * Card Types
 */
export const CARD_TYPES = {
  VIRTUAL: {
    code: 'VIRTUAL',
    name: 'Virtual Card',
    description: 'Digital card for online purchases',
  },
  PHYSICAL: {
    code: 'PHYSICAL',
    name: 'Physical Card',
    description: 'Plastic card for in-store and ATM use',
  },
} as const;

export type CardType = keyof typeof CARD_TYPES;

/**
 * Card Networks
 */
export const CARD_NETWORKS = {
  MASTERCARD: {
    code: 'MASTERCARD',
    name: 'Mastercard',
  },
} as const;

export type CardNetwork = keyof typeof CARD_NETWORKS;

/**
 * Bank Account Types
 */
export const BANK_ACCOUNT_TYPES = {
  CHECKING: {
    code: 'CHECKING',
    name: 'Checking Account',
  },
  SAVINGS: {
    code: 'SAVINGS',
    name: 'Savings Account',
  },
  BUSINESS: {
    code: 'BUSINESS',
    name: 'Business Account',
  },
} as const;

export type BankAccountType = keyof typeof BANK_ACCOUNT_TYPES;

/**
 * Bank Account Type options for n8n dropdown
 */
export const BANK_ACCOUNT_TYPE_OPTIONS = Object.entries(BANK_ACCOUNT_TYPES).map(([code, info]) => ({
  name: info.name,
  value: code,
}));
