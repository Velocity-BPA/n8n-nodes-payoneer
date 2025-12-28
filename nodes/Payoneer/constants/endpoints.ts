/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Payoneer API Endpoints
 * Contains all endpoint URLs for different environments
 */

export const PAYONEER_ENVIRONMENTS = {
  production: {
    baseUrl: 'https://api.payoneer.com',
    oauthUrl: 'https://login.payoneer.com',
    name: 'Production',
  },
  sandbox: {
    baseUrl: 'https://api.sandbox.payoneer.com',
    oauthUrl: 'https://login.sandbox.payoneer.com',
    name: 'Sandbox',
  },
} as const;

export type PayoneerEnvironment = keyof typeof PAYONEER_ENVIRONMENTS;

/**
 * API Version
 */
export const API_VERSION = 'v4';

/**
 * REST API Endpoints
 */
export const ENDPOINTS = {
  // Account endpoints
  account: {
    details: '/accounts/{accountId}',
    balance: '/accounts/{accountId}/balance',
    balances: '/accounts/{accountId}/balances',
    status: '/accounts/{accountId}/status',
    limits: '/accounts/{accountId}/limits',
    fees: '/accounts/{accountId}/fees',
    activity: '/accounts/{accountId}/activity',
    update: '/accounts/{accountId}',
    holder: '/accounts/{accountId}/holder',
    kyc: '/accounts/{accountId}/kyc',
  },

  // Payee endpoints
  payee: {
    create: '/programs/{programId}/payees',
    get: '/programs/{programId}/payees/{payeeId}',
    update: '/programs/{programId}/payees/{payeeId}',
    delete: '/programs/{programId}/payees/{payeeId}',
    list: '/programs/{programId}/payees',
    status: '/programs/{programId}/payees/{payeeId}/status',
    byEmail: '/programs/{programId}/payees/email/{email}',
    balance: '/programs/{programId}/payees/{payeeId}/balance',
    paymentMethods: '/programs/{programId}/payees/{payeeId}/payment-methods',
    invite: '/programs/{programId}/payees/{payeeId}/invite',
    registrationLink: '/programs/{programId}/payees/registration-link',
    eligibility: '/programs/{programId}/payees/{payeeId}/eligibility',
  },

  // Payment endpoints
  payment: {
    create: '/programs/{programId}/payments',
    get: '/programs/{programId}/payments/{paymentId}',
    status: '/programs/{programId}/payments/{paymentId}/status',
    cancel: '/programs/{programId}/payments/{paymentId}/cancel',
    list: '/programs/{programId}/payments',
    byPayee: '/programs/{programId}/payees/{payeeId}/payments',
    byDate: '/programs/{programId}/payments/by-date',
    byStatus: '/programs/{programId}/payments/by-status',
    batch: '/programs/{programId}/payments/batch',
    details: '/programs/{programId}/payments/{paymentId}/details',
    fees: '/programs/{programId}/payments/{paymentId}/fees',
    approve: '/programs/{programId}/payments/{paymentId}/approve',
    reject: '/programs/{programId}/payments/{paymentId}/reject',
  },

  // Payout endpoints
  payout: {
    create: '/accounts/{accountId}/payouts',
    get: '/accounts/{accountId}/payouts/{payoutId}',
    status: '/accounts/{accountId}/payouts/{payoutId}/status',
    cancel: '/accounts/{accountId}/payouts/{payoutId}/cancel',
    list: '/accounts/{accountId}/payouts',
    byReference: '/accounts/{accountId}/payouts/reference/{reference}',
    batch: '/accounts/{accountId}/payouts/batch',
    fees: '/accounts/{accountId}/payouts/fees',
    options: '/accounts/{accountId}/payouts/options',
    schedule: '/accounts/{accountId}/payouts/schedule',
    scheduled: '/accounts/{accountId}/payouts/scheduled',
  },

  // Transfer endpoints
  transfer: {
    create: '/accounts/{accountId}/transfers',
    get: '/accounts/{accountId}/transfers/{transferId}',
    status: '/accounts/{accountId}/transfers/{transferId}/status',
    list: '/accounts/{accountId}/transfers',
    byReference: '/accounts/{accountId}/transfers/reference/{reference}',
    fees: '/accounts/{accountId}/transfers/fees',
    internal: '/accounts/{accountId}/transfers/internal',
    convert: '/accounts/{accountId}/transfers/convert',
    rate: '/accounts/{accountId}/transfers/rate',
    cancel: '/accounts/{accountId}/transfers/{transferId}/cancel',
  },

  // Withdrawal endpoints
  withdrawal: {
    create: '/accounts/{accountId}/withdrawals',
    get: '/accounts/{accountId}/withdrawals/{withdrawalId}',
    status: '/accounts/{accountId}/withdrawals/{withdrawalId}/status',
    cancel: '/accounts/{accountId}/withdrawals/{withdrawalId}/cancel',
    list: '/accounts/{accountId}/withdrawals',
    methods: '/accounts/{accountId}/withdrawals/methods',
    fees: '/accounts/{accountId}/withdrawals/fees',
    limits: '/accounts/{accountId}/withdrawals/limits',
    bankAccounts: '/accounts/{accountId}/bank-accounts',
    addBankAccount: '/accounts/{accountId}/bank-accounts',
    removeBankAccount: '/accounts/{accountId}/bank-accounts/{bankAccountId}',
  },

  // Load (Add Funds) endpoints
  load: {
    create: '/accounts/{accountId}/load',
    status: '/accounts/{accountId}/load/{loadId}/status',
    list: '/accounts/{accountId}/load',
    methods: '/accounts/{accountId}/load/methods',
    wireInstructions: '/accounts/{accountId}/load/wire-instructions',
    localBankDetails: '/accounts/{accountId}/load/local-bank-details',
    receivingAccount: '/accounts/{accountId}/receiving-account',
  },

  // Currency endpoints
  currency: {
    supported: '/currencies',
    balance: '/accounts/{accountId}/balances/{currency}',
    exchangeRate: '/exchange-rates/{from}/{to}',
    convert: '/accounts/{accountId}/currency/convert',
    fxQuote: '/accounts/{accountId}/fx/quote',
    lockRate: '/accounts/{accountId}/fx/lock',
    limits: '/accounts/{accountId}/currency/limits',
    fees: '/accounts/{accountId}/currency/fees',
  },

  // Card endpoints
  card: {
    details: '/accounts/{accountId}/card',
    balance: '/accounts/{accountId}/card/balance',
    activate: '/accounts/{accountId}/card/activate',
    block: '/accounts/{accountId}/card/block',
    unblock: '/accounts/{accountId}/card/unblock',
    status: '/accounts/{accountId}/card/status',
    transactions: '/accounts/{accountId}/card/transactions',
    setPin: '/accounts/{accountId}/card/pin',
    limits: '/accounts/{accountId}/card/limits',
    updateLimits: '/accounts/{accountId}/card/limits',
    virtual: '/accounts/{accountId}/card/virtual',
    orderPhysical: '/accounts/{accountId}/card/order',
  },

  // Bank Account endpoints
  bankAccount: {
    add: '/accounts/{accountId}/bank-accounts',
    get: '/accounts/{accountId}/bank-accounts/{bankAccountId}',
    update: '/accounts/{accountId}/bank-accounts/{bankAccountId}',
    delete: '/accounts/{accountId}/bank-accounts/{bankAccountId}',
    list: '/accounts/{accountId}/bank-accounts',
    validate: '/accounts/{accountId}/bank-accounts/validate',
    status: '/accounts/{accountId}/bank-accounts/{bankAccountId}/status',
    setPrimary: '/accounts/{accountId}/bank-accounts/{bankAccountId}/primary',
    ibanDetails: '/accounts/{accountId}/bank-accounts/{bankAccountId}/iban',
    localDetails: '/accounts/{accountId}/bank-accounts/{bankAccountId}/local',
  },

  // Transaction endpoints
  transaction: {
    get: '/accounts/{accountId}/transactions/{transactionId}',
    list: '/accounts/{accountId}/transactions',
    byDate: '/accounts/{accountId}/transactions/by-date',
    byType: '/accounts/{accountId}/transactions/by-type',
    details: '/accounts/{accountId}/transactions/{transactionId}/details',
    fees: '/accounts/{accountId}/transactions/{transactionId}/fees',
    statement: '/accounts/{accountId}/transactions/statement',
    export: '/accounts/{accountId}/transactions/export',
    search: '/accounts/{accountId}/transactions/search',
    categories: '/accounts/{accountId}/transactions/categories',
  },

  // Fee endpoints
  fee: {
    schedule: '/accounts/{accountId}/fees/schedule',
    payment: '/accounts/{accountId}/fees/payment',
    withdrawal: '/accounts/{accountId}/fees/withdrawal',
    transfer: '/accounts/{accountId}/fees/transfer',
    conversion: '/accounts/{accountId}/fees/conversion',
    card: '/accounts/{accountId}/fees/card',
    calculate: '/accounts/{accountId}/fees/calculate',
    annual: '/accounts/{accountId}/fees/annual',
    minimum: '/accounts/{accountId}/fees/minimum',
  },

  // Compliance endpoints
  compliance: {
    kycStatus: '/accounts/{accountId}/kyc/status',
    submitDocuments: '/accounts/{accountId}/kyc/documents',
    requiredDocuments: '/accounts/{accountId}/kyc/required',
    status: '/accounts/{accountId}/compliance/status',
    restrictions: '/accounts/{accountId}/compliance/restrictions',
    countryRequirements: '/compliance/countries/{countryCode}',
    riskAssessment: '/accounts/{accountId}/compliance/risk',
    updateInfo: '/accounts/{accountId}/compliance/info',
  },

  // Tax endpoints
  tax: {
    info: '/accounts/{accountId}/tax',
    submitForm: '/accounts/{accountId}/tax/form',
    documents: '/accounts/{accountId}/tax/documents',
    w9Status: '/accounts/{accountId}/tax/w9',
    w8Status: '/accounts/{accountId}/tax/w8',
    withholding: '/accounts/{accountId}/tax/withholding',
    updateInfo: '/accounts/{accountId}/tax/info',
    form1099: '/accounts/{accountId}/tax/1099',
  },

  // Report endpoints
  report: {
    available: '/accounts/{accountId}/reports',
    generate: '/accounts/{accountId}/reports/generate',
    status: '/accounts/{accountId}/reports/{reportId}/status',
    download: '/accounts/{accountId}/reports/{reportId}/download',
    statement: '/accounts/{accountId}/reports/statement',
    transactions: '/accounts/{accountId}/reports/transactions',
    payments: '/accounts/{accountId}/reports/payments',
    payouts: '/accounts/{accountId}/reports/payouts',
    schedule: '/accounts/{accountId}/reports/schedule',
    custom: '/accounts/{accountId}/reports/custom',
  },

  // Webhook endpoints
  webhook: {
    create: '/webhooks',
    get: '/webhooks/{webhookId}',
    update: '/webhooks/{webhookId}',
    delete: '/webhooks/{webhookId}',
    list: '/webhooks',
    test: '/webhooks/{webhookId}/test',
    events: '/webhooks/events',
    deliveries: '/webhooks/{webhookId}/deliveries',
    retry: '/webhooks/{webhookId}/deliveries/{deliveryId}/retry',
  },

  // Program (Partner) endpoints
  program: {
    details: '/programs/{programId}',
    payees: '/programs/{programId}/payees',
    payments: '/programs/{programId}/payments',
    balance: '/programs/{programId}/balance',
    stats: '/programs/{programId}/stats',
    createPayee: '/programs/{programId}/payees',
    settings: '/programs/{programId}/settings',
  },

  // Marketplace endpoints
  marketplace: {
    info: '/marketplace',
    sellerDetails: '/marketplace/sellers/{sellerId}',
    sellerBalance: '/marketplace/sellers/{sellerId}/balance',
    payments: '/marketplace/payments',
    sellerPayouts: '/marketplace/sellers/{sellerId}/payouts',
    linkAccount: '/marketplace/link',
    supported: '/marketplace/supported',
  },

  // Invoice endpoints
  invoice: {
    create: '/accounts/{accountId}/invoices',
    get: '/accounts/{accountId}/invoices/{invoiceId}',
    update: '/accounts/{accountId}/invoices/{invoiceId}',
    cancel: '/accounts/{accountId}/invoices/{invoiceId}/cancel',
    send: '/accounts/{accountId}/invoices/{invoiceId}/send',
    status: '/accounts/{accountId}/invoices/{invoiceId}/status',
    list: '/accounts/{accountId}/invoices',
    pdf: '/accounts/{accountId}/invoices/{invoiceId}/pdf',
    markPaid: '/accounts/{accountId}/invoices/{invoiceId}/paid',
  },

  // Escrow endpoints
  escrow: {
    create: '/accounts/{accountId}/escrow',
    get: '/accounts/{accountId}/escrow/{escrowId}',
    release: '/accounts/{accountId}/escrow/{escrowId}/release',
    cancel: '/accounts/{accountId}/escrow/{escrowId}/cancel',
    status: '/accounts/{accountId}/escrow/{escrowId}/status',
    list: '/accounts/{accountId}/escrow',
    byReference: '/accounts/{accountId}/escrow/reference/{reference}',
    update: '/accounts/{accountId}/escrow/{escrowId}',
  },

  // Mass Payout endpoints
  massPayout: {
    create: '/programs/{programId}/mass-payouts',
    get: '/programs/{programId}/mass-payouts/{massPayoutId}',
    status: '/programs/{programId}/mass-payouts/{massPayoutId}/status',
    cancel: '/programs/{programId}/mass-payouts/{massPayoutId}/cancel',
    details: '/programs/{programId}/mass-payouts/{massPayoutId}/details',
    errors: '/programs/{programId}/mass-payouts/{massPayoutId}/errors',
    retry: '/programs/{programId}/mass-payouts/{massPayoutId}/retry',
    report: '/programs/{programId}/mass-payouts/{massPayoutId}/report',
  },

  // Notification endpoints
  notification: {
    list: '/accounts/{accountId}/notifications',
    settings: '/accounts/{accountId}/notifications/settings',
    updateSettings: '/accounts/{accountId}/notifications/settings',
    markRead: '/accounts/{accountId}/notifications/{notificationId}/read',
    unreadCount: '/accounts/{accountId}/notifications/unread',
    subscribe: '/accounts/{accountId}/notifications/subscribe',
  },

  // Utility endpoints
  utility: {
    validateBank: '/utility/validate-bank',
    countries: '/utility/countries',
    banks: '/utility/banks',
    countryRequirements: '/utility/countries/{countryCode}/requirements',
    bankBySwift: '/utility/banks/swift/{swift}',
    bankByRouting: '/utility/banks/routing/{routing}',
    testConnection: '/utility/ping',
    apiStatus: '/utility/status',
    rateLimits: '/utility/rate-limits',
  },
} as const;

/**
 * OAuth Endpoints
 */
export const OAUTH_ENDPOINTS = {
  authorize: '/oauth2/authorize',
  token: '/oauth2/token',
  refresh: '/oauth2/token',
  revoke: '/oauth2/revoke',
} as const;

/**
 * Default OAuth Scopes
 */
export const DEFAULT_SCOPES = [
  'read',
  'write',
  'payments',
  'payees',
  'transfers',
  'withdrawals',
  'reports',
] as const;
