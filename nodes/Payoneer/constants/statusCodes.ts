/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Payoneer Status Codes
 * Various status codes used throughout the API
 */

/**
 * Account Status
 */
export const ACCOUNT_STATUS = {
  ACTIVE: {
    code: 'ACTIVE',
    name: 'Active',
    description: 'Account is active and operational',
  },
  PENDING: {
    code: 'PENDING',
    name: 'Pending',
    description: 'Account is pending activation',
  },
  SUSPENDED: {
    code: 'SUSPENDED',
    name: 'Suspended',
    description: 'Account is temporarily suspended',
  },
  CLOSED: {
    code: 'CLOSED',
    name: 'Closed',
    description: 'Account is permanently closed',
  },
  PENDING_VERIFICATION: {
    code: 'PENDING_VERIFICATION',
    name: 'Pending Verification',
    description: 'Account awaiting KYC verification',
  },
  RESTRICTED: {
    code: 'RESTRICTED',
    name: 'Restricted',
    description: 'Account has limited functionality',
  },
  BLOCKED: {
    code: 'BLOCKED',
    name: 'Blocked',
    description: 'Account is blocked',
  },
} as const;

export type AccountStatus = keyof typeof ACCOUNT_STATUS;

export const ACCOUNT_STATUS_OPTIONS = Object.entries(ACCOUNT_STATUS).map(([code, info]) => ({
  name: info.name,
  value: code,
}));

/**
 * Payee Status
 */
export const PAYEE_STATUS = {
  ACTIVE: { code: 'ACTIVE', name: 'Active', description: 'Payee can receive payments' },
  PENDING: { code: 'PENDING', name: 'Pending', description: 'Payee registration pending' },
  PENDING_APPROVAL: { code: 'PENDING_APPROVAL', name: 'Pending Approval', description: 'Payee awaiting approval' },
  INACTIVE: { code: 'INACTIVE', name: 'Inactive', description: 'Payee is inactive' },
  SUSPENDED: { code: 'SUSPENDED', name: 'Suspended', description: 'Payee is suspended' },
  DECLINED: { code: 'DECLINED', name: 'Declined', description: 'Payee registration was declined' },
  INVITED: { code: 'INVITED', name: 'Invited', description: 'Payee has been invited' },
  REGISTERED: { code: 'REGISTERED', name: 'Registered', description: 'Payee has completed registration' },
} as const;

export type PayeeStatus = keyof typeof PAYEE_STATUS;

export const PAYEE_STATUS_OPTIONS = Object.entries(PAYEE_STATUS).map(([code, info]) => ({
  name: info.name,
  value: code,
}));

/**
 * Payment Status
 */
export const PAYMENT_STATUS = {
  PENDING: { code: 'PENDING', name: 'Pending', description: 'Payment is being processed' },
  APPROVED: { code: 'APPROVED', name: 'Approved', description: 'Payment has been approved' },
  COMPLETED: { code: 'COMPLETED', name: 'Completed', description: 'Payment has been completed' },
  CANCELLED: { code: 'CANCELLED', name: 'Cancelled', description: 'Payment was cancelled' },
  FAILED: { code: 'FAILED', name: 'Failed', description: 'Payment failed' },
  REJECTED: { code: 'REJECTED', name: 'Rejected', description: 'Payment was rejected' },
  PROCESSING: { code: 'PROCESSING', name: 'Processing', description: 'Payment is in processing' },
  HELD: { code: 'HELD', name: 'Held', description: 'Payment is on hold' },
  RETURNED: { code: 'RETURNED', name: 'Returned', description: 'Payment was returned' },
  REFUNDED: { code: 'REFUNDED', name: 'Refunded', description: 'Payment was refunded' },
} as const;

export type PaymentStatus = keyof typeof PAYMENT_STATUS;

export const PAYMENT_STATUS_OPTIONS = Object.entries(PAYMENT_STATUS).map(([code, info]) => ({
  name: info.name,
  value: code,
}));

/**
 * Payout Status
 */
export const PAYOUT_STATUS = {
  PENDING: { code: 'PENDING', name: 'Pending', description: 'Payout is pending' },
  PROCESSING: { code: 'PROCESSING', name: 'Processing', description: 'Payout is being processed' },
  COMPLETED: { code: 'COMPLETED', name: 'Completed', description: 'Payout has been completed' },
  CANCELLED: { code: 'CANCELLED', name: 'Cancelled', description: 'Payout was cancelled' },
  FAILED: { code: 'FAILED', name: 'Failed', description: 'Payout failed' },
  SCHEDULED: { code: 'SCHEDULED', name: 'Scheduled', description: 'Payout is scheduled for future' },
  RETURNED: { code: 'RETURNED', name: 'Returned', description: 'Payout was returned' },
} as const;

export type PayoutStatus = keyof typeof PAYOUT_STATUS;

export const PAYOUT_STATUS_OPTIONS = Object.entries(PAYOUT_STATUS).map(([code, info]) => ({
  name: info.name,
  value: code,
}));

/**
 * Transfer Status
 */
export const TRANSFER_STATUS = {
  PENDING: { code: 'PENDING', name: 'Pending', description: 'Transfer is pending' },
  PROCESSING: { code: 'PROCESSING', name: 'Processing', description: 'Transfer is being processed' },
  COMPLETED: { code: 'COMPLETED', name: 'Completed', description: 'Transfer has been completed' },
  CANCELLED: { code: 'CANCELLED', name: 'Cancelled', description: 'Transfer was cancelled' },
  FAILED: { code: 'FAILED', name: 'Failed', description: 'Transfer failed' },
} as const;

export type TransferStatus = keyof typeof TRANSFER_STATUS;

export const TRANSFER_STATUS_OPTIONS = Object.entries(TRANSFER_STATUS).map(([code, info]) => ({
  name: info.name,
  value: code,
}));

/**
 * Withdrawal Status
 */
export const WITHDRAWAL_STATUS = {
  PENDING: { code: 'PENDING', name: 'Pending', description: 'Withdrawal is pending' },
  PROCESSING: { code: 'PROCESSING', name: 'Processing', description: 'Withdrawal is being processed' },
  COMPLETED: { code: 'COMPLETED', name: 'Completed', description: 'Withdrawal has been completed' },
  CANCELLED: { code: 'CANCELLED', name: 'Cancelled', description: 'Withdrawal was cancelled' },
  FAILED: { code: 'FAILED', name: 'Failed', description: 'Withdrawal failed' },
  RETURNED: { code: 'RETURNED', name: 'Returned', description: 'Withdrawal was returned' },
} as const;

export type WithdrawalStatus = keyof typeof WITHDRAWAL_STATUS;

export const WITHDRAWAL_STATUS_OPTIONS = Object.entries(WITHDRAWAL_STATUS).map(([code, info]) => ({
  name: info.name,
  value: code,
}));

/**
 * KYC Status
 */
export const KYC_STATUS = {
  NOT_STARTED: { code: 'NOT_STARTED', name: 'Not Started', description: 'KYC verification not started' },
  PENDING: { code: 'PENDING', name: 'Pending', description: 'KYC verification in progress' },
  PENDING_DOCUMENTS: { code: 'PENDING_DOCUMENTS', name: 'Pending Documents', description: 'Additional documents required' },
  UNDER_REVIEW: { code: 'UNDER_REVIEW', name: 'Under Review', description: 'KYC is being reviewed' },
  APPROVED: { code: 'APPROVED', name: 'Approved', description: 'KYC verification approved' },
  REJECTED: { code: 'REJECTED', name: 'Rejected', description: 'KYC verification rejected' },
  EXPIRED: { code: 'EXPIRED', name: 'Expired', description: 'KYC verification expired' },
} as const;

export type KycStatus = keyof typeof KYC_STATUS;

export const KYC_STATUS_OPTIONS = Object.entries(KYC_STATUS).map(([code, info]) => ({
  name: info.name,
  value: code,
}));

/**
 * Card Status
 */
export const CARD_STATUS = {
  ACTIVE: { code: 'ACTIVE', name: 'Active', description: 'Card is active and can be used' },
  INACTIVE: { code: 'INACTIVE', name: 'Inactive', description: 'Card is inactive' },
  BLOCKED: { code: 'BLOCKED', name: 'Blocked', description: 'Card is blocked' },
  EXPIRED: { code: 'EXPIRED', name: 'Expired', description: 'Card has expired' },
  PENDING_ACTIVATION: { code: 'PENDING_ACTIVATION', name: 'Pending Activation', description: 'Card is pending activation' },
  CANCELLED: { code: 'CANCELLED', name: 'Cancelled', description: 'Card has been cancelled' },
  LOST: { code: 'LOST', name: 'Lost', description: 'Card reported as lost' },
  STOLEN: { code: 'STOLEN', name: 'Stolen', description: 'Card reported as stolen' },
} as const;

export type CardStatus = keyof typeof CARD_STATUS;

export const CARD_STATUS_OPTIONS = Object.entries(CARD_STATUS).map(([code, info]) => ({
  name: info.name,
  value: code,
}));

/**
 * Bank Account Status
 */
export const BANK_ACCOUNT_STATUS = {
  ACTIVE: { code: 'ACTIVE', name: 'Active', description: 'Bank account is active' },
  PENDING_VERIFICATION: { code: 'PENDING_VERIFICATION', name: 'Pending Verification', description: 'Bank account pending verification' },
  VERIFIED: { code: 'VERIFIED', name: 'Verified', description: 'Bank account is verified' },
  REJECTED: { code: 'REJECTED', name: 'Rejected', description: 'Bank account was rejected' },
  INACTIVE: { code: 'INACTIVE', name: 'Inactive', description: 'Bank account is inactive' },
  REMOVED: { code: 'REMOVED', name: 'Removed', description: 'Bank account was removed' },
} as const;

export type BankAccountStatus = keyof typeof BANK_ACCOUNT_STATUS;

export const BANK_ACCOUNT_STATUS_OPTIONS = Object.entries(BANK_ACCOUNT_STATUS).map(([code, info]) => ({
  name: info.name,
  value: code,
}));

/**
 * Invoice Status
 */
export const INVOICE_STATUS = {
  DRAFT: { code: 'DRAFT', name: 'Draft', description: 'Invoice is in draft' },
  SENT: { code: 'SENT', name: 'Sent', description: 'Invoice has been sent' },
  VIEWED: { code: 'VIEWED', name: 'Viewed', description: 'Invoice has been viewed' },
  PAID: { code: 'PAID', name: 'Paid', description: 'Invoice has been paid' },
  PARTIALLY_PAID: { code: 'PARTIALLY_PAID', name: 'Partially Paid', description: 'Invoice is partially paid' },
  OVERDUE: { code: 'OVERDUE', name: 'Overdue', description: 'Invoice is overdue' },
  CANCELLED: { code: 'CANCELLED', name: 'Cancelled', description: 'Invoice was cancelled' },
  VOID: { code: 'VOID', name: 'Void', description: 'Invoice was voided' },
} as const;

export type InvoiceStatus = keyof typeof INVOICE_STATUS;

export const INVOICE_STATUS_OPTIONS = Object.entries(INVOICE_STATUS).map(([code, info]) => ({
  name: info.name,
  value: code,
}));

/**
 * Escrow Status
 */
export const ESCROW_STATUS = {
  PENDING: { code: 'PENDING', name: 'Pending', description: 'Escrow is pending' },
  FUNDED: { code: 'FUNDED', name: 'Funded', description: 'Escrow is funded' },
  RELEASED: { code: 'RELEASED', name: 'Released', description: 'Escrow has been released' },
  CANCELLED: { code: 'CANCELLED', name: 'Cancelled', description: 'Escrow was cancelled' },
  DISPUTED: { code: 'DISPUTED', name: 'Disputed', description: 'Escrow is under dispute' },
  REFUNDED: { code: 'REFUNDED', name: 'Refunded', description: 'Escrow was refunded' },
} as const;

export type EscrowStatus = keyof typeof ESCROW_STATUS;

export const ESCROW_STATUS_OPTIONS = Object.entries(ESCROW_STATUS).map(([code, info]) => ({
  name: info.name,
  value: code,
}));

/**
 * Webhook Status
 */
export const WEBHOOK_STATUS = {
  ACTIVE: { code: 'ACTIVE', name: 'Active', description: 'Webhook is active' },
  INACTIVE: { code: 'INACTIVE', name: 'Inactive', description: 'Webhook is inactive' },
  PAUSED: { code: 'PAUSED', name: 'Paused', description: 'Webhook is paused' },
  FAILED: { code: 'FAILED', name: 'Failed', description: 'Webhook is failing' },
} as const;

export type WebhookStatus = keyof typeof WEBHOOK_STATUS;

/**
 * Mass Payout Status
 */
export const MASS_PAYOUT_STATUS = {
  PENDING: { code: 'PENDING', name: 'Pending', description: 'Mass payout is pending' },
  PROCESSING: { code: 'PROCESSING', name: 'Processing', description: 'Mass payout is being processed' },
  COMPLETED: { code: 'COMPLETED', name: 'Completed', description: 'Mass payout has been completed' },
  PARTIAL: { code: 'PARTIAL', name: 'Partial', description: 'Mass payout partially completed' },
  FAILED: { code: 'FAILED', name: 'Failed', description: 'Mass payout failed' },
  CANCELLED: { code: 'CANCELLED', name: 'Cancelled', description: 'Mass payout was cancelled' },
} as const;

export type MassPayoutStatus = keyof typeof MASS_PAYOUT_STATUS;

export const MASS_PAYOUT_STATUS_OPTIONS = Object.entries(MASS_PAYOUT_STATUS).map(([code, info]) => ({
  name: info.name,
  value: code,
}));

/**
 * API Error Codes
 */
export const ERROR_CODES = {
  AUTH_INVALID_CREDENTIALS: { code: 'AUTH_INVALID_CREDENTIALS', message: 'Invalid API credentials' },
  AUTH_TOKEN_EXPIRED: { code: 'AUTH_TOKEN_EXPIRED', message: 'Authentication token has expired' },
  AUTH_INSUFFICIENT_PERMISSIONS: { code: 'AUTH_INSUFFICIENT_PERMISSIONS', message: 'Insufficient permissions for this operation' },
  VALIDATION_REQUIRED_FIELD: { code: 'VALIDATION_REQUIRED_FIELD', message: 'Required field is missing' },
  VALIDATION_INVALID_FORMAT: { code: 'VALIDATION_INVALID_FORMAT', message: 'Invalid field format' },
  VALIDATION_INVALID_AMOUNT: { code: 'VALIDATION_INVALID_AMOUNT', message: 'Invalid amount specified' },
  VALIDATION_INVALID_CURRENCY: { code: 'VALIDATION_INVALID_CURRENCY', message: 'Invalid currency code' },
  VALIDATION_INVALID_COUNTRY: { code: 'VALIDATION_INVALID_COUNTRY', message: 'Invalid country code' },
  ACCOUNT_NOT_FOUND: { code: 'ACCOUNT_NOT_FOUND', message: 'Account not found' },
  ACCOUNT_SUSPENDED: { code: 'ACCOUNT_SUSPENDED', message: 'Account is suspended' },
  ACCOUNT_INSUFFICIENT_BALANCE: { code: 'ACCOUNT_INSUFFICIENT_BALANCE', message: 'Insufficient account balance' },
  PAYEE_NOT_FOUND: { code: 'PAYEE_NOT_FOUND', message: 'Payee not found' },
  PAYEE_NOT_ELIGIBLE: { code: 'PAYEE_NOT_ELIGIBLE', message: 'Payee is not eligible for this operation' },
  PAYEE_ALREADY_EXISTS: { code: 'PAYEE_ALREADY_EXISTS', message: 'Payee already exists' },
  PAYMENT_NOT_FOUND: { code: 'PAYMENT_NOT_FOUND', message: 'Payment not found' },
  PAYMENT_ALREADY_PROCESSED: { code: 'PAYMENT_ALREADY_PROCESSED', message: 'Payment has already been processed' },
  PAYMENT_CANNOT_CANCEL: { code: 'PAYMENT_CANNOT_CANCEL', message: 'Payment cannot be cancelled' },
  TRANSFER_NOT_FOUND: { code: 'TRANSFER_NOT_FOUND', message: 'Transfer not found' },
  TRANSFER_LIMIT_EXCEEDED: { code: 'TRANSFER_LIMIT_EXCEEDED', message: 'Transfer limit exceeded' },
  WITHDRAWAL_NOT_FOUND: { code: 'WITHDRAWAL_NOT_FOUND', message: 'Withdrawal not found' },
  WITHDRAWAL_LIMIT_EXCEEDED: { code: 'WITHDRAWAL_LIMIT_EXCEEDED', message: 'Withdrawal limit exceeded' },
  WITHDRAWAL_MINIMUM_NOT_MET: { code: 'WITHDRAWAL_MINIMUM_NOT_MET', message: 'Minimum withdrawal amount not met' },
  BANK_ACCOUNT_NOT_FOUND: { code: 'BANK_ACCOUNT_NOT_FOUND', message: 'Bank account not found' },
  BANK_ACCOUNT_INVALID: { code: 'BANK_ACCOUNT_INVALID', message: 'Invalid bank account details' },
  CARD_NOT_FOUND: { code: 'CARD_NOT_FOUND', message: 'Card not found' },
  CARD_BLOCKED: { code: 'CARD_BLOCKED', message: 'Card is blocked' },
  CARD_EXPIRED: { code: 'CARD_EXPIRED', message: 'Card has expired' },
  KYC_REQUIRED: { code: 'KYC_REQUIRED', message: 'KYC verification is required' },
  KYC_PENDING: { code: 'KYC_PENDING', message: 'KYC verification is pending' },
  COMPLIANCE_RESTRICTION: { code: 'COMPLIANCE_RESTRICTION', message: 'Operation restricted due to compliance' },
  RATE_LIMIT_EXCEEDED: { code: 'RATE_LIMIT_EXCEEDED', message: 'API rate limit exceeded' },
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
  SERVICE_UNAVAILABLE: { code: 'SERVICE_UNAVAILABLE', message: 'Service temporarily unavailable' },
  NOT_IMPLEMENTED: { code: 'NOT_IMPLEMENTED', message: 'Feature not implemented' },
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
