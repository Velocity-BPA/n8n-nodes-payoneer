/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Import account actions
import { accountOperations, accountFields, executeAccountOperation } from './actions/account';
// Import payee actions
import { payeeOperations, payeeFields, executePayeeOperation } from './actions/payee';
// Import payment actions
import { paymentOperations, paymentFields, executePaymentOperation } from './actions/payment';
// Import all other actions
import {
  payoutOperations, payoutFields,
  transferOperations, transferFields,
  withdrawalOperations, withdrawalFields,
  loadOperations, loadFields,
  currencyOperations, currencyFields,
  cardOperations, cardFields,
  bankAccountOperations, bankAccountFields,
  transactionOperations, transactionFields,
  feeOperations, feeFields,
  complianceOperations, complianceFields,
  taxOperations, taxFields,
  reportOperations, reportFields,
  webhookOperations, webhookFields,
  programOperations, programFields,
  marketplaceOperations, marketplaceFields,
  invoiceOperations, invoiceFields,
  escrowOperations, escrowFields,
  massPayoutOperations, massPayoutFields,
  notificationOperations, notificationFields,
  utilityOperations, utilityFields,
  executeWebhookOperation,
  executeProgramOperation,
  executeMarketplaceOperation,
  executeInvoiceOperation,
  executeEscrowOperation,
  executeMassPayoutOperation,
  executeNotificationOperation,
  executeUtilityOperation,
} from './actions/allActions';

import { payoneerApiRequest, replacePathParams, getAccountId, getProgramId } from './transport/payoneerClient';
import { ENDPOINTS } from './constants/endpoints';

export class Payoneer implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Payoneer',
    name: 'payoneer',
    icon: 'file:payoneer.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Payoneer global payment platform',
    defaults: {
      name: 'Payoneer',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'payoneerApi',
        required: true,
        displayOptions: {
          show: {
            authentication: ['apiKey'],
          },
        },
      },
      {
        name: 'payoneerOAuthApi',
        required: true,
        displayOptions: {
          show: {
            authentication: ['oAuth2'],
          },
        },
      },
    ],
    properties: [
      {
        displayName: 'Authentication',
        name: 'authentication',
        type: 'options',
        options: [
          {
            name: 'API Key',
            value: 'apiKey',
          },
          {
            name: 'OAuth2',
            value: 'oAuth2',
          },
        ],
        default: 'apiKey',
      },
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Account', value: 'account', description: 'Manage Payoneer accounts' },
          { name: 'Bank Account', value: 'bankAccount', description: 'Manage bank accounts' },
          { name: 'Card', value: 'card', description: 'Manage Payoneer cards' },
          { name: 'Compliance', value: 'compliance', description: 'KYC and compliance operations' },
          { name: 'Currency', value: 'currency', description: 'Currency and FX operations' },
          { name: 'Escrow', value: 'escrow', description: 'Manage escrow transactions' },
          { name: 'Fee', value: 'fee', description: 'Fee information and calculations' },
          { name: 'Invoice', value: 'invoice', description: 'Create and manage invoices' },
          { name: 'Load', value: 'load', description: 'Add funds to account' },
          { name: 'Marketplace', value: 'marketplace', description: 'Marketplace integrations' },
          { name: 'Mass Payout', value: 'massPayout', description: 'Batch payment operations' },
          { name: 'Notification', value: 'notification', description: 'Manage notifications' },
          { name: 'Payee', value: 'payee', description: 'Manage payment recipients' },
          { name: 'Payment', value: 'payment', description: 'Create and manage payments' },
          { name: 'Payout', value: 'payout', description: 'Create and manage payouts' },
          { name: 'Program', value: 'program', description: 'Partner program operations' },
          { name: 'Report', value: 'report', description: 'Generate and download reports' },
          { name: 'Tax', value: 'tax', description: 'Tax information and forms' },
          { name: 'Transaction', value: 'transaction', description: 'View transactions' },
          { name: 'Transfer', value: 'transfer', description: 'Internal transfers' },
          { name: 'Utility', value: 'utility', description: 'Utility operations' },
          { name: 'Webhook', value: 'webhook', description: 'Manage webhooks' },
          { name: 'Withdrawal', value: 'withdrawal', description: 'Withdraw funds' },
        ],
        default: 'account',
      },
      // Account operations and fields
      ...accountOperations,
      ...accountFields,
      // Payee operations and fields
      ...payeeOperations,
      ...payeeFields,
      // Payment operations and fields
      ...paymentOperations,
      ...paymentFields,
      // Payout operations and fields
      ...payoutOperations,
      ...payoutFields,
      // Transfer operations and fields
      ...transferOperations,
      ...transferFields,
      // Withdrawal operations and fields
      ...withdrawalOperations,
      ...withdrawalFields,
      // Load operations and fields
      ...loadOperations,
      ...loadFields,
      // Currency operations and fields
      ...currencyOperations,
      ...currencyFields,
      // Card operations and fields
      ...cardOperations,
      ...cardFields,
      // Bank Account operations and fields
      ...bankAccountOperations,
      ...bankAccountFields,
      // Transaction operations and fields
      ...transactionOperations,
      ...transactionFields,
      // Fee operations and fields
      ...feeOperations,
      ...feeFields,
      // Compliance operations and fields
      ...complianceOperations,
      ...complianceFields,
      // Tax operations and fields
      ...taxOperations,
      ...taxFields,
      // Report operations and fields
      ...reportOperations,
      ...reportFields,
      // Webhook operations and fields
      ...webhookOperations,
      ...webhookFields,
      // Program operations and fields
      ...programOperations,
      ...programFields,
      // Marketplace operations and fields
      ...marketplaceOperations,
      ...marketplaceFields,
      // Invoice operations and fields
      ...invoiceOperations,
      ...invoiceFields,
      // Escrow operations and fields
      ...escrowOperations,
      ...escrowFields,
      // Mass Payout operations and fields
      ...massPayoutOperations,
      ...massPayoutFields,
      // Notification operations and fields
      ...notificationOperations,
      ...notificationFields,
      // Utility operations and fields
      ...utilityOperations,
      ...utilityFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject = {};

        switch (resource) {
          case 'account':
            responseData = await executeAccountOperation.call(this, operation, i);
            break;
          case 'payee':
            responseData = await executePayeeOperation.call(this, operation, i);
            break;
          case 'payment':
            responseData = await executePaymentOperation.call(this, operation, i);
            break;
          case 'payout':
            responseData = await executePayoutOperation.call(this, operation, i);
            break;
          case 'transfer':
            responseData = await executeTransferOperation.call(this, operation, i);
            break;
          case 'withdrawal':
            responseData = await executeWithdrawalOperation.call(this, operation, i);
            break;
          case 'load':
            responseData = await executeLoadOperation.call(this, operation, i);
            break;
          case 'currency':
            responseData = await executeCurrencyOperation.call(this, operation, i);
            break;
          case 'card':
            responseData = await executeCardOperation.call(this, operation, i);
            break;
          case 'bankAccount':
            responseData = await executeBankAccountOperation.call(this, operation, i);
            break;
          case 'transaction':
            responseData = await executeTransactionOperation.call(this, operation, i);
            break;
          case 'fee':
            responseData = await executeFeeOperation.call(this, operation, i);
            break;
          case 'compliance':
            responseData = await executeComplianceOperation.call(this, operation, i);
            break;
          case 'tax':
            responseData = await executeTaxOperation.call(this, operation, i);
            break;
          case 'report':
            responseData = await executeReportOperation.call(this, operation, i);
            break;
          case 'webhook':
            responseData = await executeWebhookOperation.call(this, operation, i);
            break;
          case 'program':
            responseData = await executeProgramOperation.call(this, operation, i);
            break;
          case 'marketplace':
            responseData = await executeMarketplaceOperation.call(this, operation, i);
            break;
          case 'invoice':
            responseData = await executeInvoiceOperation.call(this, operation, i);
            break;
          case 'escrow':
            responseData = await executeEscrowOperation.call(this, operation, i);
            break;
          case 'massPayout':
            responseData = await executeMassPayoutOperation.call(this, operation, i);
            break;
          case 'notification':
            responseData = await executeNotificationOperation.call(this, operation, i);
            break;
          case 'utility':
            responseData = await executeUtilityOperation.call(this, operation, i);
            break;
          default:
            throw new NodeOperationError(
              this.getNode(),
              `The resource "${resource}" is not supported`,
            );
        }

        returnData.push({
          json: responseData,
          pairedItem: { item: i },
        });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as Error).message },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}

// Execute functions for resources that need inline implementation
async function executePayoutOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  const accountId = await getAccountId(this);
  let response: IDataObject = {};

  switch (operation) {
    case 'create': {
      const amount = this.getNodeParameter('amount', i) as number;
      const currency = this.getNodeParameter('currency', i) as string;
      const bankAccountId = this.getNodeParameter('bankAccountId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.payout.create, { accountId }),
        body: { amount, currency, bankAccountId },
      });
      break;
    }
    case 'get': {
      const payoutId = this.getNodeParameter('payoutId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.payout.get, { accountId, payoutId }),
      });
      break;
    }
    case 'getStatus': {
      const payoutId = this.getNodeParameter('payoutId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.payout.status, { accountId, payoutId }),
      });
      break;
    }
    case 'cancel': {
      const payoutId = this.getNodeParameter('payoutId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.payout.cancel, { accountId, payoutId }),
      });
      break;
    }
    case 'list': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.payout.list, { accountId }),
      });
      break;
    }
    case 'getByReference': {
      const reference = this.getNodeParameter('reference', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.payout.byReference, { accountId, reference }),
      });
      break;
    }
    case 'batchCreate': {
      const payoutsJson = this.getNodeParameter('payouts', i) as string;
      const payouts = JSON.parse(payoutsJson);
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.payout.batch, { accountId }),
        body: { payouts },
      });
      break;
    }
    case 'getFees': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.payout.fees, { accountId }),
      });
      break;
    }
    case 'getOptions': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.payout.options, { accountId }),
      });
      break;
    }
    case 'schedule': {
      const amount = this.getNodeParameter('amount', i) as number;
      const currency = this.getNodeParameter('currency', i) as string;
      const bankAccountId = this.getNodeParameter('bankAccountId', i) as string;
      const scheduleDate = this.getNodeParameter('scheduleDate', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.payout.schedule, { accountId }),
        body: { amount, currency, bankAccountId, scheduleDate },
      });
      break;
    }
    case 'getScheduled': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.payout.scheduled, { accountId }),
      });
      break;
    }
  }
  return response;
}

async function executeTransferOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  const accountId = await getAccountId(this);
  let response: IDataObject = {};

  switch (operation) {
    case 'create': {
      const amount = this.getNodeParameter('amount', i) as number;
      const destinationAccountId = this.getNodeParameter('destinationAccountId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.transfer.create, { accountId }),
        body: { amount, destinationAccountId },
      });
      break;
    }
    case 'get': {
      const transferId = this.getNodeParameter('transferId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.transfer.get, { accountId, transferId }),
      });
      break;
    }
    case 'list': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.transfer.list, { accountId }),
      });
      break;
    }
    case 'convert': {
      const amount = this.getNodeParameter('amount', i) as number;
      const fromCurrency = this.getNodeParameter('fromCurrency', i) as string;
      const toCurrency = this.getNodeParameter('toCurrency', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.transfer.convert, { accountId }),
        body: { amount, fromCurrency, toCurrency },
      });
      break;
    }
    case 'getRate': {
      const fromCurrency = this.getNodeParameter('fromCurrency', i) as string;
      const toCurrency = this.getNodeParameter('toCurrency', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.transfer.rate, { accountId }),
        query: { fromCurrency, toCurrency },
      });
      break;
    }
    case 'getFees': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.transfer.fees, { accountId }),
      });
      break;
    }
    case 'getInternal': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.transfer.internal, { accountId }),
      });
      break;
    }
    case 'cancel': {
      const transferId = this.getNodeParameter('transferId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.transfer.cancel, { accountId, transferId }),
      });
      break;
    }
  }
  return response;
}

async function executeWithdrawalOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  const accountId = await getAccountId(this);
  let response: IDataObject = {};

  switch (operation) {
    case 'create': {
      const amount = this.getNodeParameter('amount', i) as number;
      const currency = this.getNodeParameter('currency', i) as string;
      const bankAccountId = this.getNodeParameter('bankAccountId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.withdrawal.create, { accountId }),
        body: { amount, currency, bankAccountId },
      });
      break;
    }
    case 'get': {
      const withdrawalId = this.getNodeParameter('withdrawalId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.withdrawal.get, { accountId, withdrawalId }),
      });
      break;
    }
    case 'list': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.withdrawal.list, { accountId }),
      });
      break;
    }
    case 'getMethods': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.withdrawal.methods, { accountId }),
      });
      break;
    }
    case 'getFees': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.withdrawal.fees, { accountId }),
      });
      break;
    }
    case 'getLimits': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.withdrawal.limits, { accountId }),
      });
      break;
    }
    case 'cancel': {
      const withdrawalId = this.getNodeParameter('withdrawalId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.withdrawal.cancel, { accountId, withdrawalId }),
      });
      break;
    }
  }
  return response;
}

async function executeLoadOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  const accountId = await getAccountId(this);
  let response: IDataObject = {};

  switch (operation) {
    case 'create': {
      const amount = this.getNodeParameter('amount', i) as number;
      const currency = this.getNodeParameter('currency', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.load.create, { accountId }),
        body: { amount, currency },
      });
      break;
    }
    case 'getStatus': {
      const loadId = this.getNodeParameter('loadId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.load.status, { accountId, loadId }),
      });
      break;
    }
    case 'list': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.load.list, { accountId }),
      });
      break;
    }
    case 'getMethods': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.load.methods, { accountId }),
      });
      break;
    }
    case 'getWireInstructions': {
      const currency = this.getNodeParameter('currency', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.load.wireInstructions, { accountId }),
        query: { currency },
      });
      break;
    }
    case 'getLocalBankDetails': {
      const currency = this.getNodeParameter('currency', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.load.localBankDetails, { accountId }),
        query: { currency },
      });
      break;
    }
    case 'getReceivingAccount': {
      const currency = this.getNodeParameter('currency', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.load.receivingAccount, { accountId }),
        query: { currency },
      });
      break;
    }
  }
  return response;
}

async function executeCurrencyOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  const accountId = await getAccountId(this);
  let response: IDataObject = {};

  switch (operation) {
    case 'getSupported': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: ENDPOINTS.currency.supported,
      });
      break;
    }
    case 'getBalance': {
      const currency = this.getNodeParameter('currency', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.currency.balance, { accountId, currency }),
      });
      break;
    }
    case 'getExchangeRate': {
      const fromCurrency = this.getNodeParameter('fromCurrency', i) as string;
      const toCurrency = this.getNodeParameter('toCurrency', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.currency.exchangeRate, { from: fromCurrency, to: toCurrency }),
      });
      break;
    }
    case 'convert': {
      const amount = this.getNodeParameter('amount', i) as number;
      const fromCurrency = this.getNodeParameter('fromCurrency', i) as string;
      const toCurrency = this.getNodeParameter('toCurrency', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.currency.convert, { accountId }),
        body: { amount, fromCurrency, toCurrency },
      });
      break;
    }
    case 'getFxQuote': {
      const amount = this.getNodeParameter('amount', i) as number;
      const fromCurrency = this.getNodeParameter('fromCurrency', i) as string;
      const toCurrency = this.getNodeParameter('toCurrency', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.currency.fxQuote, { accountId }),
        body: { amount, fromCurrency, toCurrency },
      });
      break;
    }
    case 'lockRate': {
      const fromCurrency = this.getNodeParameter('fromCurrency', i) as string;
      const toCurrency = this.getNodeParameter('toCurrency', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.currency.lockRate, { accountId }),
        body: { fromCurrency, toCurrency },
      });
      break;
    }
    case 'getLimits': {
      const currency = this.getNodeParameter('currency', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.currency.limits, { accountId }),
        query: { currency },
      });
      break;
    }
    case 'getFees': {
      const currency = this.getNodeParameter('currency', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.currency.fees, { accountId }),
        query: { currency },
      });
      break;
    }
  }
  return response;
}

async function executeCardOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  const accountId = await getAccountId(this);
  let response: IDataObject = {};

  switch (operation) {
    case 'getDetails': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.card.details, { accountId }),
      });
      break;
    }
    case 'getBalance': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.card.balance, { accountId }),
      });
      break;
    }
    case 'activate': {
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.card.activate, { accountId }),
      });
      break;
    }
    case 'block': {
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.card.block, { accountId }),
      });
      break;
    }
    case 'unblock': {
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.card.unblock, { accountId }),
      });
      break;
    }
    case 'getStatus': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.card.status, { accountId }),
      });
      break;
    }
    case 'getTransactions': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.card.transactions, { accountId }),
      });
      break;
    }
    case 'setPin': {
      const pin = this.getNodeParameter('pin', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.card.setPin, { accountId }),
        body: { pin },
      });
      break;
    }
    case 'getLimits': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.card.limits, { accountId }),
      });
      break;
    }
    case 'updateLimits': {
      const dailyLimit = this.getNodeParameter('dailyLimit', i, 0) as number;
      const monthlyLimit = this.getNodeParameter('monthlyLimit', i, 0) as number;
      const body: IDataObject = {};
      if (dailyLimit) body.dailyLimit = dailyLimit;
      if (monthlyLimit) body.monthlyLimit = monthlyLimit;
      response = await payoneerApiRequest(this, {
        method: 'PUT',
        endpoint: replacePathParams(ENDPOINTS.card.updateLimits, { accountId }),
        body,
      });
      break;
    }
    case 'getVirtual': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.card.virtual, { accountId }),
      });
      break;
    }
    case 'orderPhysical': {
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.card.orderPhysical, { accountId }),
      });
      break;
    }
  }
  return response;
}

async function executeBankAccountOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  const accountId = await getAccountId(this);
  let response: IDataObject = {};

  switch (operation) {
    case 'add': {
      const accountNumber = this.getNodeParameter('accountNumber', i) as string;
      const routingNumber = this.getNodeParameter('routingNumber', i, '') as string;
      const accountHolderName = this.getNodeParameter('accountHolderName', i) as string;
      const accountType = this.getNodeParameter('accountType', i, 'CHECKING') as string;
      const country = this.getNodeParameter('country', i) as string;
      const currency = this.getNodeParameter('currency', i, 'USD') as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.bankAccount.add, { accountId }),
        body: { accountNumber, routingNumber, accountHolderName, accountType, country, currency },
      });
      break;
    }
    case 'get': {
      const bankAccountId = this.getNodeParameter('bankAccountId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.bankAccount.get, { accountId, bankAccountId }),
      });
      break;
    }
    case 'list': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.bankAccount.list, { accountId }),
      });
      break;
    }
    case 'delete': {
      const bankAccountId = this.getNodeParameter('bankAccountId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'DELETE',
        endpoint: replacePathParams(ENDPOINTS.bankAccount.delete, { accountId, bankAccountId }),
      });
      break;
    }
    case 'validate': {
      const accountNumber = this.getNodeParameter('accountNumber', i) as string;
      const routingNumber = this.getNodeParameter('routingNumber', i, '') as string;
      const country = this.getNodeParameter('country', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.bankAccount.validate, { accountId }),
        body: { accountNumber, routingNumber, country },
      });
      break;
    }
    case 'setPrimary': {
      const bankAccountId = this.getNodeParameter('bankAccountId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.bankAccount.setPrimary, { accountId, bankAccountId }),
      });
      break;
    }
  }
  return response;
}

async function executeTransactionOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  const accountId = await getAccountId(this);
  let response: IDataObject = {};

  switch (operation) {
    case 'get': {
      const transactionId = this.getNodeParameter('transactionId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.transaction.get, { accountId, transactionId }),
      });
      break;
    }
    case 'list': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.transaction.list, { accountId }),
      });
      break;
    }
    case 'getByDate': {
      const startDate = this.getNodeParameter('startDate', i) as string;
      const endDate = this.getNodeParameter('endDate', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.transaction.byDate, { accountId }),
        query: { startDate, endDate },
      });
      break;
    }
    case 'getByType': {
      const transactionType = this.getNodeParameter('transactionType', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.transaction.byType, { accountId }),
        query: { type: transactionType },
      });
      break;
    }
    case 'search': {
      const searchQuery = this.getNodeParameter('searchQuery', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.transaction.search, { accountId }),
        query: { q: searchQuery },
      });
      break;
    }
    case 'export': {
      const startDate = this.getNodeParameter('startDate', i) as string;
      const endDate = this.getNodeParameter('endDate', i) as string;
      const exportFormat = this.getNodeParameter('exportFormat', i, 'csv') as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.transaction.export, { accountId }),
        query: { startDate, endDate, format: exportFormat },
      });
      break;
    }
    case 'getStatement': {
      const startDate = this.getNodeParameter('startDate', i) as string;
      const endDate = this.getNodeParameter('endDate', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.transaction.statement, { accountId }),
        query: { startDate, endDate },
      });
      break;
    }
    case 'getCategories': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.transaction.categories, { accountId }),
      });
      break;
    }
  }
  return response;
}

async function executeFeeOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  const accountId = await getAccountId(this);
  let response: IDataObject = {};

  switch (operation) {
    case 'getSchedule': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.fee.schedule, { accountId }),
      });
      break;
    }
    case 'getPaymentFees': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.fee.payment, { accountId }),
      });
      break;
    }
    case 'getWithdrawalFees': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.fee.withdrawal, { accountId }),
      });
      break;
    }
    case 'getTransferFees': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.fee.transfer, { accountId }),
      });
      break;
    }
    case 'getConversionFees': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.fee.conversion, { accountId }),
      });
      break;
    }
    case 'getCardFees': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.fee.card, { accountId }),
      });
      break;
    }
    case 'calculate': {
      const feeType = this.getNodeParameter('feeType', i) as string;
      const amount = this.getNodeParameter('amount', i) as number;
      const currency = this.getNodeParameter('currency', i, 'USD') as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.fee.calculate, { accountId }),
        body: { feeType, amount, currency },
      });
      break;
    }
    case 'getAnnualFees': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.fee.annual, { accountId }),
      });
      break;
    }
    case 'getMinimumFees': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.fee.minimum, { accountId }),
      });
      break;
    }
  }
  return response;
}

async function executeComplianceOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  const accountId = await getAccountId(this);
  let response: IDataObject = {};

  switch (operation) {
    case 'getKycStatus': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.compliance.kycStatus, { accountId }),
      });
      break;
    }
    case 'submitDocuments': {
      const documentType = this.getNodeParameter('documentType', i) as string;
      const documentBase64 = this.getNodeParameter('documentBase64', i, '') as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.compliance.submitDocuments, { accountId }),
        body: { documentType, document: documentBase64 },
      });
      break;
    }
    case 'getRequiredDocuments': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.compliance.requiredDocuments, { accountId }),
      });
      break;
    }
    case 'getStatus': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.compliance.status, { accountId }),
      });
      break;
    }
    case 'getRestrictions': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.compliance.restrictions, { accountId }),
      });
      break;
    }
    case 'getCountryRequirements': {
      const countryCode = this.getNodeParameter('countryCode', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.compliance.countryRequirements, { countryCode }),
      });
      break;
    }
    case 'getRiskAssessment': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.compliance.riskAssessment, { accountId }),
      });
      break;
    }
  }
  return response;
}

async function executeTaxOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  const accountId = await getAccountId(this);
  let response: IDataObject = {};

  switch (operation) {
    case 'getInfo': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.tax.info, { accountId }),
      });
      break;
    }
    case 'submitForm': {
      const formType = this.getNodeParameter('formType', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.tax.submitForm, { accountId }),
        body: { formType },
      });
      break;
    }
    case 'getDocuments': {
      const taxYear = this.getNodeParameter('taxYear', i) as number;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.tax.documents, { accountId }),
        query: { year: taxYear },
      });
      break;
    }
    case 'getW9Status': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.tax.w9Status, { accountId }),
      });
      break;
    }
    case 'getW8Status': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.tax.w8Status, { accountId }),
      });
      break;
    }
    case 'getWithholding': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.tax.withholding, { accountId }),
      });
      break;
    }
    case 'get1099': {
      const taxYear = this.getNodeParameter('taxYear', i) as number;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.tax.form1099, { accountId }),
        query: { year: taxYear },
      });
      break;
    }
  }
  return response;
}

async function executeReportOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  const accountId = await getAccountId(this);
  let response: IDataObject = {};

  switch (operation) {
    case 'getAvailable': {
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.report.available, { accountId }),
      });
      break;
    }
    case 'generate': {
      const reportType = this.getNodeParameter('reportType', i) as string;
      const startDate = this.getNodeParameter('startDate', i, '') as string;
      const endDate = this.getNodeParameter('endDate', i, '') as string;
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint: replacePathParams(ENDPOINTS.report.generate, { accountId }),
        body: { reportType, startDate, endDate },
      });
      break;
    }
    case 'getStatus': {
      const reportId = this.getNodeParameter('reportId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.report.status, { accountId, reportId }),
      });
      break;
    }
    case 'download': {
      const reportId = this.getNodeParameter('reportId', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.report.download, { accountId, reportId }),
      });
      break;
    }
    case 'getStatement': {
      const startDate = this.getNodeParameter('startDate', i) as string;
      const endDate = this.getNodeParameter('endDate', i) as string;
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint: replacePathParams(ENDPOINTS.report.statement, { accountId }),
        query: { startDate, endDate },
      });
      break;
    }
  }
  return response;
}
