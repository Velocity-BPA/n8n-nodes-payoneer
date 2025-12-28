/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { payoneerApiRequest, replacePathParams, getProgramId } from '../../transport/payoneerClient';
import { ENDPOINTS } from '../../constants/endpoints';
import { CURRENCY_OPTIONS } from '../../constants/currencies';
import { PAYMENT_STATUS_OPTIONS } from '../../constants/statusCodes';

export const paymentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['payment'],
      },
    },
    options: [
      { name: 'Create', value: 'create', description: 'Create a new payment', action: 'Create payment' },
      { name: 'Get', value: 'get', description: 'Get payment details', action: 'Get payment' },
      { name: 'Get Status', value: 'getStatus', description: 'Get payment status', action: 'Get payment status' },
      { name: 'Cancel', value: 'cancel', description: 'Cancel a payment', action: 'Cancel payment' },
      { name: 'List', value: 'list', description: 'List all payments', action: 'List payments' },
      { name: 'Get by Payee', value: 'getByPayee', description: 'Get payments by payee', action: 'Get payments by payee' },
      { name: 'Get by Date', value: 'getByDate', description: 'Get payments by date range', action: 'Get payments by date' },
      { name: 'Get by Status', value: 'getByStatus', description: 'Get payments by status', action: 'Get payments by status' },
      { name: 'Batch Create', value: 'batchCreate', description: 'Create multiple payments', action: 'Batch create payments' },
      { name: 'Get Details', value: 'getDetails', description: 'Get full payment details', action: 'Get payment details' },
      { name: 'Get Fees', value: 'getFees', description: 'Get payment fees', action: 'Get payment fees' },
      { name: 'Approve', value: 'approve', description: 'Approve a pending payment', action: 'Approve payment' },
      { name: 'Reject', value: 'reject', description: 'Reject a pending payment', action: 'Reject payment' },
    ],
    default: 'list',
  },
];

export const paymentFields: INodeProperties[] = [
  // Payment ID
  {
    displayName: 'Payment ID',
    name: 'paymentId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['get', 'getStatus', 'cancel', 'getDetails', 'getFees', 'approve', 'reject'],
      },
    },
    default: '',
    description: 'The unique payment identifier',
  },

  // Payee ID for create and getByPayee
  {
    displayName: 'Payee ID',
    name: 'payeeId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['create', 'getByPayee'],
      },
    },
    default: '',
    description: 'The payee identifier',
  },

  // Amount for create
  {
    displayName: 'Amount',
    name: 'amount',
    type: 'number',
    typeOptions: {
      numberPrecision: 2,
      minValue: 0.01,
    },
    required: true,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['create'],
      },
    },
    default: 0,
    description: 'Payment amount',
  },

  // Currency for create
  {
    displayName: 'Currency',
    name: 'currency',
    type: 'options',
    options: CURRENCY_OPTIONS,
    required: true,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['create'],
      },
    },
    default: 'USD',
    description: 'Payment currency',
  },

  // Description
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Payment description',
  },

  // Additional create fields
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['create'],
      },
    },
    default: {},
    options: [
      { displayName: 'Client Reference ID', name: 'clientReferenceId', type: 'string', default: '', description: 'Your unique reference for this payment' },
      { displayName: 'Payment Method', name: 'paymentMethod', type: 'string', default: '', description: 'Preferred payment method' },
      { displayName: 'Group ID', name: 'groupId', type: 'string', default: '', description: 'Group payments together' },
      { displayName: 'Invoice Number', name: 'invoiceNumber', type: 'string', default: '' },
      { displayName: 'Purchase Order', name: 'purchaseOrder', type: 'string', default: '' },
      { displayName: 'Memo', name: 'memo', type: 'string', default: '', description: 'Internal memo for the payment' },
    ],
  },

  // Date range for getByDate
  {
    displayName: 'Start Date',
    name: 'startDate',
    type: 'dateTime',
    required: true,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['getByDate'],
      },
    },
    default: '',
    description: 'Start date for the date range',
  },
  {
    displayName: 'End Date',
    name: 'endDate',
    type: 'dateTime',
    required: true,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['getByDate'],
      },
    },
    default: '',
    description: 'End date for the date range',
  },

  // Status for getByStatus
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    options: PAYMENT_STATUS_OPTIONS,
    required: true,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['getByStatus'],
      },
    },
    default: 'PENDING',
    description: 'Payment status to filter by',
  },

  // Batch payments
  {
    displayName: 'Payments',
    name: 'payments',
    type: 'json',
    required: true,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['batchCreate'],
      },
    },
    default: '[]',
    description: 'Array of payment objects with payeeId, amount, currency, and description',
  },

  // Rejection reason
  {
    displayName: 'Rejection Reason',
    name: 'rejectionReason',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['reject'],
      },
    },
    default: '',
    description: 'Reason for rejecting the payment',
  },

  // List/query filters
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['list', 'getByPayee', 'getByDate', 'getByStatus'],
      },
    },
    default: {},
    options: [
      { displayName: 'Page', name: 'page', type: 'number', typeOptions: { minValue: 1 }, default: 1 },
      { displayName: 'Page Size', name: 'pageSize', type: 'number', typeOptions: { minValue: 1, maxValue: 100 }, default: 20 },
      { displayName: 'Sort By', name: 'sortBy', type: 'options', options: [
        { name: 'Created Date', value: 'createdDate' },
        { name: 'Amount', value: 'amount' },
        { name: 'Status', value: 'status' },
      ], default: 'createdDate' },
      { displayName: 'Sort Order', name: 'sortOrder', type: 'options', options: [
        { name: 'Ascending', value: 'asc' },
        { name: 'Descending', value: 'desc' },
      ], default: 'desc' },
    ],
  },
];

export async function executePaymentOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  let response: IDataObject = {};

  const programId = await getProgramId(this);

  switch (operation) {
    case 'create': {
      const payeeId = this.getNodeParameter('payeeId', i) as string;
      const amount = this.getNodeParameter('amount', i) as number;
      const currency = this.getNodeParameter('currency', i) as string;
      const description = this.getNodeParameter('description', i, '') as string;
      const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

      const body: IDataObject = {
        payeeId,
        amount,
        currency,
        description,
        ...additionalFields,
      };

      const endpoint = replacePathParams(ENDPOINTS.payment.create, { programId });
      response = await payoneerApiRequest(this, { method: 'POST', endpoint, body });
      break;
    }

    case 'get': {
      const paymentId = this.getNodeParameter('paymentId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.payment.get, { programId, paymentId });
      response = await payoneerApiRequest(this, { method: 'GET', endpoint });
      break;
    }

    case 'getStatus': {
      const paymentId = this.getNodeParameter('paymentId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.payment.status, { programId, paymentId });
      response = await payoneerApiRequest(this, { method: 'GET', endpoint });
      break;
    }

    case 'cancel': {
      const paymentId = this.getNodeParameter('paymentId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.payment.cancel, { programId, paymentId });
      response = await payoneerApiRequest(this, { method: 'POST', endpoint });
      break;
    }

    case 'list': {
      const filters = this.getNodeParameter('filters', i) as IDataObject;
      const endpoint = replacePathParams(ENDPOINTS.payment.list, { programId });
      response = await payoneerApiRequest(this, { method: 'GET', endpoint, query: filters });
      break;
    }

    case 'getByPayee': {
      const payeeId = this.getNodeParameter('payeeId', i) as string;
      const filters = this.getNodeParameter('filters', i) as IDataObject;
      const endpoint = replacePathParams(ENDPOINTS.payment.byPayee, { programId, payeeId });
      response = await payoneerApiRequest(this, { method: 'GET', endpoint, query: filters });
      break;
    }

    case 'getByDate': {
      const startDate = this.getNodeParameter('startDate', i) as string;
      const endDate = this.getNodeParameter('endDate', i) as string;
      const filters = this.getNodeParameter('filters', i) as IDataObject;
      const endpoint = replacePathParams(ENDPOINTS.payment.byDate, { programId });
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint,
        query: { startDate, endDate, ...filters },
      });
      break;
    }

    case 'getByStatus': {
      const status = this.getNodeParameter('status', i) as string;
      const filters = this.getNodeParameter('filters', i) as IDataObject;
      const endpoint = replacePathParams(ENDPOINTS.payment.byStatus, { programId });
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint,
        query: { status, ...filters },
      });
      break;
    }

    case 'batchCreate': {
      const paymentsJson = this.getNodeParameter('payments', i) as string;
      const payments = JSON.parse(paymentsJson);
      const endpoint = replacePathParams(ENDPOINTS.payment.batch, { programId });
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint,
        body: { payments },
      });
      break;
    }

    case 'getDetails': {
      const paymentId = this.getNodeParameter('paymentId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.payment.details, { programId, paymentId });
      response = await payoneerApiRequest(this, { method: 'GET', endpoint });
      break;
    }

    case 'getFees': {
      const paymentId = this.getNodeParameter('paymentId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.payment.fees, { programId, paymentId });
      response = await payoneerApiRequest(this, { method: 'GET', endpoint });
      break;
    }

    case 'approve': {
      const paymentId = this.getNodeParameter('paymentId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.payment.approve, { programId, paymentId });
      response = await payoneerApiRequest(this, { method: 'POST', endpoint });
      break;
    }

    case 'reject': {
      const paymentId = this.getNodeParameter('paymentId', i) as string;
      const rejectionReason = this.getNodeParameter('rejectionReason', i, '') as string;
      const endpoint = replacePathParams(ENDPOINTS.payment.reject, { programId, paymentId });
      response = await payoneerApiRequest(this, {
        method: 'POST',
        endpoint,
        body: rejectionReason ? { reason: rejectionReason } : undefined,
      });
      break;
    }
  }

  return response;
}
