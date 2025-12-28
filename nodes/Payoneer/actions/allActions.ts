/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { payoneerApiRequest, replacePathParams, getAccountId, getProgramId } from '../transport/payoneerClient';
import { ENDPOINTS } from '../constants/endpoints';
import { CURRENCY_OPTIONS } from '../constants/currencies';
import { COUNTRY_OPTIONS } from '../constants/countries';
import { INVOICE_STATUS_OPTIONS, ESCROW_STATUS_OPTIONS, MASS_PAYOUT_STATUS_OPTIONS } from '../constants/statusCodes';

// ============= WEBHOOK =============
export const webhookOperations: INodeProperties[] = [
  {
    displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
    displayOptions: { show: { resource: ['webhook'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create webhook' },
      { name: 'Get', value: 'get', action: 'Get webhook' },
      { name: 'Update', value: 'update', action: 'Update webhook' },
      { name: 'Delete', value: 'delete', action: 'Delete webhook' },
      { name: 'List', value: 'list', action: 'List webhooks' },
      { name: 'Test', value: 'test', action: 'Test webhook' },
      { name: 'Get Events', value: 'getEvents', action: 'Get webhook events' },
      { name: 'Get Deliveries', value: 'getDeliveries', action: 'Get webhook deliveries' },
      { name: 'Retry', value: 'retry', action: 'Retry webhook delivery' },
    ],
    default: 'list',
  },
];

export const webhookFields: INodeProperties[] = [
  { displayName: 'Webhook ID', name: 'webhookId', type: 'string', required: true, displayOptions: { show: { resource: ['webhook'], operation: ['get', 'update', 'delete', 'test', 'getDeliveries'] } }, default: '' },
  { displayName: 'URL', name: 'url', type: 'string', required: true, displayOptions: { show: { resource: ['webhook'], operation: ['create', 'update'] } }, default: '', placeholder: 'https://your-server.com/webhook' },
  { displayName: 'Events', name: 'events', type: 'multiOptions', options: [
    { name: 'Payment Created', value: 'payment.created' }, { name: 'Payment Completed', value: 'payment.completed' },
    { name: 'Payment Failed', value: 'payment.failed' }, { name: 'Payout Created', value: 'payout.created' },
    { name: 'Payout Completed', value: 'payout.completed' }, { name: 'Transfer Completed', value: 'transfer.completed' },
    { name: 'Account Updated', value: 'account.updated' }, { name: 'KYC Status Changed', value: 'account.kyc.status_changed' },
  ], displayOptions: { show: { resource: ['webhook'], operation: ['create', 'update'] } }, default: [] },
  { displayName: 'Delivery ID', name: 'deliveryId', type: 'string', required: true, displayOptions: { show: { resource: ['webhook'], operation: ['retry'] } }, default: '' },
  { displayName: 'Active', name: 'active', type: 'boolean', displayOptions: { show: { resource: ['webhook'], operation: ['create', 'update'] } }, default: true },
];

// ============= PROGRAM =============
export const programOperations: INodeProperties[] = [
  {
    displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
    displayOptions: { show: { resource: ['program'] } },
    options: [
      { name: 'Get Details', value: 'getDetails', action: 'Get program details' },
      { name: 'Get Payees', value: 'getPayees', action: 'Get program payees' },
      { name: 'Get Payments', value: 'getPayments', action: 'Get program payments' },
      { name: 'Get Balance', value: 'getBalance', action: 'Get program balance' },
      { name: 'Get Stats', value: 'getStats', action: 'Get program stats' },
      { name: 'Create Payee', value: 'createPayee', action: 'Create program payee' },
      { name: 'Update Settings', value: 'updateSettings', action: 'Update program settings' },
    ],
    default: 'getDetails',
  },
];

export const programFields: INodeProperties[] = [
  { displayName: 'Program ID', name: 'programIdOverride', type: 'string', displayOptions: { show: { resource: ['program'], operation: ['getDetails', 'getPayees', 'getPayments', 'getBalance', 'getStats'] } }, default: '', description: 'Override credentials program ID' },
];

// ============= MARKETPLACE =============
export const marketplaceOperations: INodeProperties[] = [
  {
    displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
    displayOptions: { show: { resource: ['marketplace'] } },
    options: [
      { name: 'Get Info', value: 'getInfo', action: 'Get marketplace info' },
      { name: 'Get Seller Details', value: 'getSellerDetails', action: 'Get seller details' },
      { name: 'Get Seller Balance', value: 'getSellerBalance', action: 'Get seller balance' },
      { name: 'Get Payments', value: 'getPayments', action: 'Get marketplace payments' },
      { name: 'Get Seller Payouts', value: 'getSellerPayouts', action: 'Get seller payouts' },
      { name: 'Link Account', value: 'linkAccount', action: 'Link marketplace account' },
      { name: 'Get Supported', value: 'getSupported', action: 'Get supported marketplaces' },
    ],
    default: 'getInfo',
  },
];

export const marketplaceFields: INodeProperties[] = [
  { displayName: 'Seller ID', name: 'sellerId', type: 'string', required: true, displayOptions: { show: { resource: ['marketplace'], operation: ['getSellerDetails', 'getSellerBalance', 'getSellerPayouts'] } }, default: '' },
  { displayName: 'Marketplace', name: 'marketplace', type: 'options', options: [
    { name: 'Amazon', value: 'AMAZON' }, { name: 'eBay', value: 'EBAY' }, { name: 'Etsy', value: 'ETSY' },
    { name: 'Walmart', value: 'WALMART' }, { name: 'Shopify', value: 'SHOPIFY' }, { name: 'Wish', value: 'WISH' },
  ], displayOptions: { show: { resource: ['marketplace'], operation: ['linkAccount'] } }, default: 'AMAZON' },
  { displayName: 'Marketplace Seller ID', name: 'marketplaceSellerId', type: 'string', displayOptions: { show: { resource: ['marketplace'], operation: ['linkAccount'] } }, default: '' },
];

// ============= INVOICE =============
export const invoiceOperations: INodeProperties[] = [
  {
    displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
    displayOptions: { show: { resource: ['invoice'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create invoice' },
      { name: 'Get', value: 'get', action: 'Get invoice' },
      { name: 'Update', value: 'update', action: 'Update invoice' },
      { name: 'Cancel', value: 'cancel', action: 'Cancel invoice' },
      { name: 'Send', value: 'send', action: 'Send invoice' },
      { name: 'Get Status', value: 'getStatus', action: 'Get invoice status' },
      { name: 'List', value: 'list', action: 'List invoices' },
      { name: 'Get PDF', value: 'getPdf', action: 'Get invoice PDF' },
      { name: 'Mark as Paid', value: 'markPaid', action: 'Mark invoice as paid' },
    ],
    default: 'list',
  },
];

export const invoiceFields: INodeProperties[] = [
  { displayName: 'Invoice ID', name: 'invoiceId', type: 'string', required: true, displayOptions: { show: { resource: ['invoice'], operation: ['get', 'update', 'cancel', 'send', 'getStatus', 'getPdf', 'markPaid'] } }, default: '' },
  { displayName: 'Client Email', name: 'clientEmail', type: 'string', required: true, displayOptions: { show: { resource: ['invoice'], operation: ['create'] } }, default: '', placeholder: 'client@example.com' },
  { displayName: 'Client Name', name: 'clientName', type: 'string', required: true, displayOptions: { show: { resource: ['invoice'], operation: ['create'] } }, default: '' },
  { displayName: 'Amount', name: 'amount', type: 'number', required: true, displayOptions: { show: { resource: ['invoice'], operation: ['create'] } }, default: 0 },
  { displayName: 'Currency', name: 'currency', type: 'options', options: CURRENCY_OPTIONS, required: true, displayOptions: { show: { resource: ['invoice'], operation: ['create'] } }, default: 'USD' },
  { displayName: 'Description', name: 'description', type: 'string', displayOptions: { show: { resource: ['invoice'], operation: ['create', 'update'] } }, default: '' },
  { displayName: 'Due Date', name: 'dueDate', type: 'dateTime', displayOptions: { show: { resource: ['invoice'], operation: ['create', 'update'] } }, default: '' },
  { displayName: 'Status Filter', name: 'statusFilter', type: 'options', options: INVOICE_STATUS_OPTIONS, displayOptions: { show: { resource: ['invoice'], operation: ['list'] } }, default: '' },
];

// ============= ESCROW =============
export const escrowOperations: INodeProperties[] = [
  {
    displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
    displayOptions: { show: { resource: ['escrow'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create escrow' },
      { name: 'Get', value: 'get', action: 'Get escrow' },
      { name: 'Release', value: 'release', action: 'Release escrow' },
      { name: 'Cancel', value: 'cancel', action: 'Cancel escrow' },
      { name: 'Get Status', value: 'getStatus', action: 'Get escrow status' },
      { name: 'List', value: 'list', action: 'List escrows' },
      { name: 'Get by Reference', value: 'getByReference', action: 'Get escrow by reference' },
      { name: 'Update', value: 'update', action: 'Update escrow' },
    ],
    default: 'list',
  },
];

export const escrowFields: INodeProperties[] = [
  { displayName: 'Escrow ID', name: 'escrowId', type: 'string', required: true, displayOptions: { show: { resource: ['escrow'], operation: ['get', 'release', 'cancel', 'getStatus', 'update'] } }, default: '' },
  { displayName: 'Reference', name: 'reference', type: 'string', required: true, displayOptions: { show: { resource: ['escrow'], operation: ['getByReference'] } }, default: '' },
  { displayName: 'Amount', name: 'amount', type: 'number', required: true, displayOptions: { show: { resource: ['escrow'], operation: ['create'] } }, default: 0 },
  { displayName: 'Currency', name: 'currency', type: 'options', options: CURRENCY_OPTIONS, required: true, displayOptions: { show: { resource: ['escrow'], operation: ['create'] } }, default: 'USD' },
  { displayName: 'Payee ID', name: 'payeeId', type: 'string', required: true, displayOptions: { show: { resource: ['escrow'], operation: ['create'] } }, default: '' },
  { displayName: 'Description', name: 'description', type: 'string', displayOptions: { show: { resource: ['escrow'], operation: ['create', 'update'] } }, default: '' },
];

// ============= MASS PAYOUT =============
export const massPayoutOperations: INodeProperties[] = [
  {
    displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
    displayOptions: { show: { resource: ['massPayout'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create mass payout' },
      { name: 'Get', value: 'get', action: 'Get mass payout' },
      { name: 'Get Status', value: 'getStatus', action: 'Get mass payout status' },
      { name: 'Cancel', value: 'cancel', action: 'Cancel mass payout' },
      { name: 'Get Details', value: 'getDetails', action: 'Get mass payout details' },
      { name: 'Get Errors', value: 'getErrors', action: 'Get mass payout errors' },
      { name: 'Retry Failed', value: 'retryFailed', action: 'Retry failed payouts' },
      { name: 'Download Report', value: 'downloadReport', action: 'Download mass payout report' },
    ],
    default: 'create',
  },
];

export const massPayoutFields: INodeProperties[] = [
  { displayName: 'Mass Payout ID', name: 'massPayoutId', type: 'string', required: true, displayOptions: { show: { resource: ['massPayout'], operation: ['get', 'getStatus', 'cancel', 'getDetails', 'getErrors', 'retryFailed', 'downloadReport'] } }, default: '' },
  { displayName: 'Payments', name: 'payments', type: 'json', required: true, displayOptions: { show: { resource: ['massPayout'], operation: ['create'] } }, default: '[\n  {\n    "payeeId": "",\n    "amount": 0,\n    "currency": "USD",\n    "description": ""\n  }\n]', description: 'Array of payment objects' },
  { displayName: 'Reference', name: 'reference', type: 'string', displayOptions: { show: { resource: ['massPayout'], operation: ['create'] } }, default: '' },
  { displayName: 'Description', name: 'description', type: 'string', displayOptions: { show: { resource: ['massPayout'], operation: ['create'] } }, default: '' },
];

// ============= NOTIFICATION =============
export const notificationOperations: INodeProperties[] = [
  {
    displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
    displayOptions: { show: { resource: ['notification'] } },
    options: [
      { name: 'List', value: 'list', action: 'List notifications' },
      { name: 'Get Settings', value: 'getSettings', action: 'Get notification settings' },
      { name: 'Update Settings', value: 'updateSettings', action: 'Update notification settings' },
      { name: 'Mark as Read', value: 'markRead', action: 'Mark notification as read' },
      { name: 'Get Unread Count', value: 'getUnreadCount', action: 'Get unread count' },
      { name: 'Subscribe', value: 'subscribe', action: 'Subscribe to events' },
    ],
    default: 'list',
  },
];

export const notificationFields: INodeProperties[] = [
  { displayName: 'Notification ID', name: 'notificationId', type: 'string', required: true, displayOptions: { show: { resource: ['notification'], operation: ['markRead'] } }, default: '' },
  { displayName: 'Email Notifications', name: 'emailNotifications', type: 'boolean', displayOptions: { show: { resource: ['notification'], operation: ['updateSettings'] } }, default: true },
  { displayName: 'Push Notifications', name: 'pushNotifications', type: 'boolean', displayOptions: { show: { resource: ['notification'], operation: ['updateSettings'] } }, default: true },
  { displayName: 'Event Types', name: 'eventTypes', type: 'multiOptions', options: [
    { name: 'Payments', value: 'payments' }, { name: 'Payouts', value: 'payouts' },
    { name: 'Transfers', value: 'transfers' }, { name: 'Account', value: 'account' },
  ], displayOptions: { show: { resource: ['notification'], operation: ['subscribe'] } }, default: [] },
];

// ============= UTILITY =============
export const utilityOperations: INodeProperties[] = [
  {
    displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
    displayOptions: { show: { resource: ['utility'] } },
    options: [
      { name: 'Validate Bank Details', value: 'validateBank', action: 'Validate bank details' },
      { name: 'Get Supported Countries', value: 'getCountries', action: 'Get supported countries' },
      { name: 'Get Supported Banks', value: 'getBanks', action: 'Get supported banks' },
      { name: 'Get Country Requirements', value: 'getCountryRequirements', action: 'Get country requirements' },
      { name: 'Get Bank by SWIFT', value: 'getBankBySwift', action: 'Get bank by SWIFT code' },
      { name: 'Get Bank by Routing', value: 'getBankByRouting', action: 'Get bank by routing number' },
      { name: 'Test Connection', value: 'testConnection', action: 'Test API connection' },
      { name: 'Get API Status', value: 'getApiStatus', action: 'Get API status' },
      { name: 'Get Rate Limits', value: 'getRateLimits', action: 'Get rate limits' },
    ],
    default: 'testConnection',
  },
];

export const utilityFields: INodeProperties[] = [
  { displayName: 'Country Code', name: 'countryCode', type: 'options', options: COUNTRY_OPTIONS, required: true, displayOptions: { show: { resource: ['utility'], operation: ['getBanks', 'getCountryRequirements'] } }, default: 'US' },
  { displayName: 'SWIFT Code', name: 'swiftCode', type: 'string', required: true, displayOptions: { show: { resource: ['utility'], operation: ['getBankBySwift'] } }, default: '' },
  { displayName: 'Routing Number', name: 'routingNumber', type: 'string', required: true, displayOptions: { show: { resource: ['utility'], operation: ['getBankByRouting'] } }, default: '' },
  { displayName: 'Account Number', name: 'accountNumber', type: 'string', displayOptions: { show: { resource: ['utility'], operation: ['validateBank'] } }, default: '' },
  { displayName: 'Bank Country', name: 'bankCountry', type: 'options', options: COUNTRY_OPTIONS, displayOptions: { show: { resource: ['utility'], operation: ['validateBank'] } }, default: 'US' },
];

// ============= EXECUTE FUNCTIONS =============

export async function executeWebhookOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  let response: IDataObject = {};
  switch (operation) {
    case 'create': {
      const url = this.getNodeParameter('url', i) as string;
      const events = this.getNodeParameter('events', i) as string[];
      const active = this.getNodeParameter('active', i, true) as boolean;
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: ENDPOINTS.webhook.create, body: { url, events, active } });
      break;
    }
    case 'get': {
      const webhookId = this.getNodeParameter('webhookId', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.webhook.get, { webhookId }) });
      break;
    }
    case 'update': {
      const webhookId = this.getNodeParameter('webhookId', i) as string;
      const url = this.getNodeParameter('url', i, '') as string;
      const events = this.getNodeParameter('events', i, []) as string[];
      const active = this.getNodeParameter('active', i, true) as boolean;
      const body: IDataObject = {};
      if (url) body.url = url;
      if (events.length) body.events = events;
      body.active = active;
      response = await payoneerApiRequest(this, { method: 'PUT', endpoint: replacePathParams(ENDPOINTS.webhook.update, { webhookId }), body });
      break;
    }
    case 'delete': {
      const webhookId = this.getNodeParameter('webhookId', i) as string;
      response = await payoneerApiRequest(this, { method: 'DELETE', endpoint: replacePathParams(ENDPOINTS.webhook.delete, { webhookId }) });
      break;
    }
    case 'list': {
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: ENDPOINTS.webhook.list });
      break;
    }
    case 'test': {
      const webhookId = this.getNodeParameter('webhookId', i) as string;
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: replacePathParams(ENDPOINTS.webhook.test, { webhookId }) });
      break;
    }
    case 'getEvents': {
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: ENDPOINTS.webhook.events });
      break;
    }
    case 'getDeliveries': {
      const webhookId = this.getNodeParameter('webhookId', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.webhook.deliveries, { webhookId }) });
      break;
    }
    case 'retry': {
      const webhookId = this.getNodeParameter('webhookId', i) as string;
      const deliveryId = this.getNodeParameter('deliveryId', i) as string;
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: replacePathParams(ENDPOINTS.webhook.retry, { webhookId, deliveryId }) });
      break;
    }
  }
  return response;
}

export async function executeProgramOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  const programId = this.getNodeParameter('programIdOverride', i, '') as string || await getProgramId(this);
  let response: IDataObject = {};
  switch (operation) {
    case 'getDetails':
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.program.details, { programId }) });
      break;
    case 'getPayees':
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.program.payees, { programId }) });
      break;
    case 'getPayments':
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.program.payments, { programId }) });
      break;
    case 'getBalance':
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.program.balance, { programId }) });
      break;
    case 'getStats':
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.program.stats, { programId }) });
      break;
  }
  return response;
}

export async function executeMarketplaceOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  let response: IDataObject = {};
  switch (operation) {
    case 'getInfo':
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: ENDPOINTS.marketplace.info });
      break;
    case 'getSellerDetails': {
      const sellerId = this.getNodeParameter('sellerId', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.marketplace.sellerDetails, { sellerId }) });
      break;
    }
    case 'getSellerBalance': {
      const sellerId = this.getNodeParameter('sellerId', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.marketplace.sellerBalance, { sellerId }) });
      break;
    }
    case 'getPayments':
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: ENDPOINTS.marketplace.payments });
      break;
    case 'getSellerPayouts': {
      const sellerId = this.getNodeParameter('sellerId', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.marketplace.sellerPayouts, { sellerId }) });
      break;
    }
    case 'linkAccount': {
      const marketplace = this.getNodeParameter('marketplace', i) as string;
      const marketplaceSellerId = this.getNodeParameter('marketplaceSellerId', i, '') as string;
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: ENDPOINTS.marketplace.linkAccount, body: { marketplace, marketplaceSellerId } });
      break;
    }
    case 'getSupported':
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: ENDPOINTS.marketplace.supported });
      break;
  }
  return response;
}

export async function executeInvoiceOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  const accountId = await getAccountId(this);
  let response: IDataObject = {};
  switch (operation) {
    case 'create': {
      const clientEmail = this.getNodeParameter('clientEmail', i) as string;
      const clientName = this.getNodeParameter('clientName', i) as string;
      const amount = this.getNodeParameter('amount', i) as number;
      const currency = this.getNodeParameter('currency', i) as string;
      const description = this.getNodeParameter('description', i, '') as string;
      const dueDate = this.getNodeParameter('dueDate', i, '') as string;
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: replacePathParams(ENDPOINTS.invoice.create, { accountId }), body: { clientEmail, clientName, amount, currency, description, dueDate } });
      break;
    }
    case 'get': {
      const invoiceId = this.getNodeParameter('invoiceId', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.invoice.get, { accountId, invoiceId }) });
      break;
    }
    case 'list': {
      const statusFilter = this.getNodeParameter('statusFilter', i, '') as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.invoice.list, { accountId }), query: statusFilter ? { status: statusFilter } : undefined });
      break;
    }
    case 'send': {
      const invoiceId = this.getNodeParameter('invoiceId', i) as string;
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: replacePathParams(ENDPOINTS.invoice.send, { accountId, invoiceId }) });
      break;
    }
    case 'cancel': {
      const invoiceId = this.getNodeParameter('invoiceId', i) as string;
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: replacePathParams(ENDPOINTS.invoice.cancel, { accountId, invoiceId }) });
      break;
    }
    case 'getPdf': {
      const invoiceId = this.getNodeParameter('invoiceId', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.invoice.pdf, { accountId, invoiceId }) });
      break;
    }
    case 'markPaid': {
      const invoiceId = this.getNodeParameter('invoiceId', i) as string;
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: replacePathParams(ENDPOINTS.invoice.markPaid, { accountId, invoiceId }) });
      break;
    }
  }
  return response;
}

export async function executeEscrowOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  const accountId = await getAccountId(this);
  let response: IDataObject = {};
  switch (operation) {
    case 'create': {
      const amount = this.getNodeParameter('amount', i) as number;
      const currency = this.getNodeParameter('currency', i) as string;
      const payeeId = this.getNodeParameter('payeeId', i) as string;
      const description = this.getNodeParameter('description', i, '') as string;
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: replacePathParams(ENDPOINTS.escrow.create, { accountId }), body: { amount, currency, payeeId, description } });
      break;
    }
    case 'get': {
      const escrowId = this.getNodeParameter('escrowId', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.escrow.get, { accountId, escrowId }) });
      break;
    }
    case 'release': {
      const escrowId = this.getNodeParameter('escrowId', i) as string;
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: replacePathParams(ENDPOINTS.escrow.release, { accountId, escrowId }) });
      break;
    }
    case 'cancel': {
      const escrowId = this.getNodeParameter('escrowId', i) as string;
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: replacePathParams(ENDPOINTS.escrow.cancel, { accountId, escrowId }) });
      break;
    }
    case 'list':
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.escrow.list, { accountId }) });
      break;
    case 'getByReference': {
      const reference = this.getNodeParameter('reference', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.escrow.byReference, { accountId, reference }) });
      break;
    }
  }
  return response;
}

export async function executeMassPayoutOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  const programId = await getProgramId(this);
  let response: IDataObject = {};
  switch (operation) {
    case 'create': {
      const paymentsJson = this.getNodeParameter('payments', i) as string;
      const payments = JSON.parse(paymentsJson);
      const reference = this.getNodeParameter('reference', i, '') as string;
      const description = this.getNodeParameter('description', i, '') as string;
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: replacePathParams(ENDPOINTS.massPayout.create, { programId }), body: { payments, reference, description } });
      break;
    }
    case 'get': {
      const massPayoutId = this.getNodeParameter('massPayoutId', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.massPayout.get, { programId, massPayoutId }) });
      break;
    }
    case 'getStatus': {
      const massPayoutId = this.getNodeParameter('massPayoutId', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.massPayout.status, { programId, massPayoutId }) });
      break;
    }
    case 'cancel': {
      const massPayoutId = this.getNodeParameter('massPayoutId', i) as string;
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: replacePathParams(ENDPOINTS.massPayout.cancel, { programId, massPayoutId }) });
      break;
    }
    case 'getDetails': {
      const massPayoutId = this.getNodeParameter('massPayoutId', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.massPayout.details, { programId, massPayoutId }) });
      break;
    }
    case 'getErrors': {
      const massPayoutId = this.getNodeParameter('massPayoutId', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.massPayout.errors, { programId, massPayoutId }) });
      break;
    }
    case 'retryFailed': {
      const massPayoutId = this.getNodeParameter('massPayoutId', i) as string;
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: replacePathParams(ENDPOINTS.massPayout.retry, { programId, massPayoutId }) });
      break;
    }
    case 'downloadReport': {
      const massPayoutId = this.getNodeParameter('massPayoutId', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.massPayout.report, { programId, massPayoutId }) });
      break;
    }
  }
  return response;
}

export async function executeNotificationOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  const accountId = await getAccountId(this);
  let response: IDataObject = {};
  switch (operation) {
    case 'list':
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.notification.list, { accountId }) });
      break;
    case 'getSettings':
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.notification.settings, { accountId }) });
      break;
    case 'updateSettings': {
      const emailNotifications = this.getNodeParameter('emailNotifications', i, true) as boolean;
      const pushNotifications = this.getNodeParameter('pushNotifications', i, true) as boolean;
      response = await payoneerApiRequest(this, { method: 'PUT', endpoint: replacePathParams(ENDPOINTS.notification.updateSettings, { accountId }), body: { emailNotifications, pushNotifications } });
      break;
    }
    case 'markRead': {
      const notificationId = this.getNodeParameter('notificationId', i) as string;
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: replacePathParams(ENDPOINTS.notification.markRead, { accountId, notificationId }) });
      break;
    }
    case 'getUnreadCount':
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.notification.unreadCount, { accountId }) });
      break;
    case 'subscribe': {
      const eventTypes = this.getNodeParameter('eventTypes', i, []) as string[];
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: replacePathParams(ENDPOINTS.notification.subscribe, { accountId }), body: { eventTypes } });
      break;
    }
  }
  return response;
}

export async function executeUtilityOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  let response: IDataObject = {};
  switch (operation) {
    case 'validateBank': {
      const accountNumber = this.getNodeParameter('accountNumber', i, '') as string;
      const routingNumber = this.getNodeParameter('routingNumber', i, '') as string;
      const bankCountry = this.getNodeParameter('bankCountry', i, 'US') as string;
      response = await payoneerApiRequest(this, { method: 'POST', endpoint: ENDPOINTS.utility.validateBank, body: { accountNumber, routingNumber, country: bankCountry } });
      break;
    }
    case 'getCountries':
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: ENDPOINTS.utility.countries });
      break;
    case 'getBanks': {
      const countryCode = this.getNodeParameter('countryCode', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: ENDPOINTS.utility.banks, query: { country: countryCode } });
      break;
    }
    case 'getCountryRequirements': {
      const countryCode = this.getNodeParameter('countryCode', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.utility.countryRequirements, { countryCode }) });
      break;
    }
    case 'getBankBySwift': {
      const swiftCode = this.getNodeParameter('swiftCode', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.utility.bankBySwift, { swift: swiftCode }) });
      break;
    }
    case 'getBankByRouting': {
      const routingNumber = this.getNodeParameter('routingNumber', i) as string;
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: replacePathParams(ENDPOINTS.utility.bankByRouting, { routing: routingNumber }) });
      break;
    }
    case 'testConnection':
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: ENDPOINTS.utility.testConnection });
      break;
    case 'getApiStatus':
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: ENDPOINTS.utility.apiStatus });
      break;
    case 'getRateLimits':
      response = await payoneerApiRequest(this, { method: 'GET', endpoint: ENDPOINTS.utility.rateLimits });
      break;
  }
  return response;
}
