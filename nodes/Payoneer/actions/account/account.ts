/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { payoneerApiRequest, replacePathParams, getAccountId } from '../../transport/payoneerClient';
import { ENDPOINTS } from '../../constants/endpoints';
import { CURRENCY_OPTIONS } from '../../constants/currencies';

export const accountOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['account'],
      },
    },
    options: [
      {
        name: 'Get Details',
        value: 'getDetails',
        description: 'Get account details',
        action: 'Get account details',
      },
      {
        name: 'Get Balance',
        value: 'getBalance',
        description: 'Get account balance',
        action: 'Get account balance',
      },
      {
        name: 'Get Balances',
        value: 'getBalances',
        description: 'Get multi-currency balances',
        action: 'Get account balances',
      },
      {
        name: 'Get Status',
        value: 'getStatus',
        description: 'Get account status',
        action: 'Get account status',
      },
      {
        name: 'Get Limits',
        value: 'getLimits',
        description: 'Get account limits',
        action: 'Get account limits',
      },
      {
        name: 'Get Fees',
        value: 'getFees',
        description: 'Get account fees',
        action: 'Get account fees',
      },
      {
        name: 'Get Activity',
        value: 'getActivity',
        description: 'Get account activity',
        action: 'Get account activity',
      },
      {
        name: 'Update Info',
        value: 'updateInfo',
        description: 'Update account information',
        action: 'Update account info',
      },
      {
        name: 'Get by ID',
        value: 'getById',
        description: 'Get account by specific ID',
        action: 'Get account by ID',
      },
      {
        name: 'Get Holder',
        value: 'getHolder',
        description: 'Get account holder information',
        action: 'Get account holder',
      },
      {
        name: 'Get KYC Status',
        value: 'getKycStatus',
        description: 'Get KYC verification status',
        action: 'Get KYC status',
      },
    ],
    default: 'getDetails',
  },
];

export const accountFields: INodeProperties[] = [
  // Account ID field for operations that need it explicitly
  {
    displayName: 'Account ID',
    name: 'accountId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['getById'],
      },
    },
    default: '',
    description: 'The Payoneer account ID',
  },

  // Currency for balance operations
  {
    displayName: 'Currency',
    name: 'currency',
    type: 'options',
    options: CURRENCY_OPTIONS,
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['getBalance'],
      },
    },
    default: 'USD',
    description: 'Currency for balance inquiry',
  },

  // Date range for activity
  {
    displayName: 'Start Date',
    name: 'startDate',
    type: 'dateTime',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['getActivity'],
      },
    },
    default: '',
    description: 'Start date for activity range',
  },
  {
    displayName: 'End Date',
    name: 'endDate',
    type: 'dateTime',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['getActivity'],
      },
    },
    default: '',
    description: 'End date for activity range',
  },

  // Update info fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['updateInfo'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        description: 'Account holder first name',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        description: 'Account holder last name',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        default: '',
        description: 'Account holder email',
      },
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        description: 'Account holder phone number',
      },
      {
        displayName: 'Address Line 1',
        name: 'addressLine1',
        type: 'string',
        default: '',
        description: 'Street address line 1',
      },
      {
        displayName: 'Address Line 2',
        name: 'addressLine2',
        type: 'string',
        default: '',
        description: 'Street address line 2',
      },
      {
        displayName: 'City',
        name: 'city',
        type: 'string',
        default: '',
        description: 'City',
      },
      {
        displayName: 'State/Province',
        name: 'state',
        type: 'string',
        default: '',
        description: 'State or province',
      },
      {
        displayName: 'Postal Code',
        name: 'postalCode',
        type: 'string',
        default: '',
        description: 'Postal/ZIP code',
      },
      {
        displayName: 'Country',
        name: 'country',
        type: 'string',
        default: '',
        description: 'Country code (ISO 3166-1 alpha-2)',
      },
    ],
  },

  // Additional options for various operations
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['getActivity', 'getBalances'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        typeOptions: {
          minValue: 1,
        },
        default: 1,
        description: 'Page number for pagination',
      },
      {
        displayName: 'Page Size',
        name: 'pageSize',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        default: 20,
        description: 'Number of items per page',
      },
    ],
  },
];

export async function executeAccountOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  let response: IDataObject = {};

  const accountId = await getAccountId(this);

  switch (operation) {
    case 'getDetails': {
      const endpoint = replacePathParams(ENDPOINTS.account.details, { accountId });
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint,
      });
      break;
    }

    case 'getBalance': {
      const currency = this.getNodeParameter('currency', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.account.balance, { accountId });
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint,
        query: { currency },
      });
      break;
    }

    case 'getBalances': {
      const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;
      const endpoint = replacePathParams(ENDPOINTS.account.balances, { accountId });
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint,
        query: additionalOptions,
      });
      break;
    }

    case 'getStatus': {
      const endpoint = replacePathParams(ENDPOINTS.account.status, { accountId });
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint,
      });
      break;
    }

    case 'getLimits': {
      const endpoint = replacePathParams(ENDPOINTS.account.limits, { accountId });
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint,
      });
      break;
    }

    case 'getFees': {
      const endpoint = replacePathParams(ENDPOINTS.account.fees, { accountId });
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint,
      });
      break;
    }

    case 'getActivity': {
      const startDate = this.getNodeParameter('startDate', i, '') as string;
      const endDate = this.getNodeParameter('endDate', i, '') as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

      const query: IDataObject = { ...additionalOptions };
      if (startDate) query.startDate = startDate;
      if (endDate) query.endDate = endDate;

      const endpoint = replacePathParams(ENDPOINTS.account.activity, { accountId });
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint,
        query,
      });
      break;
    }

    case 'updateInfo': {
      const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
      const endpoint = replacePathParams(ENDPOINTS.account.update, { accountId });
      response = await payoneerApiRequest(this, {
        method: 'PUT',
        endpoint,
        body: updateFields,
      });
      break;
    }

    case 'getById': {
      const specificAccountId = this.getNodeParameter('accountId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.account.details, { accountId: specificAccountId });
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint,
      });
      break;
    }

    case 'getHolder': {
      const endpoint = replacePathParams(ENDPOINTS.account.holder, { accountId });
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint,
      });
      break;
    }

    case 'getKycStatus': {
      const endpoint = replacePathParams(ENDPOINTS.account.kyc, { accountId });
      response = await payoneerApiRequest(this, {
        method: 'GET',
        endpoint,
      });
      break;
    }
  }

  return response;
}
