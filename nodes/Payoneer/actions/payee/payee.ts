/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { payoneerApiRequest, replacePathParams, getProgramId } from '../../transport/payoneerClient';
import { ENDPOINTS } from '../../constants/endpoints';
import { COUNTRY_OPTIONS } from '../../constants/countries';
import { PAYEE_STATUS_OPTIONS } from '../../constants/statusCodes';

export const payeeOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['payee'],
      },
    },
    options: [
      { name: 'Create', value: 'create', description: 'Create a new payee', action: 'Create payee' },
      { name: 'Get', value: 'get', description: 'Get a payee by ID', action: 'Get payee' },
      { name: 'Update', value: 'update', description: 'Update a payee', action: 'Update payee' },
      { name: 'Delete', value: 'delete', description: 'Delete a payee', action: 'Delete payee' },
      { name: 'List', value: 'list', description: 'List all payees', action: 'List payees' },
      { name: 'Get Status', value: 'getStatus', description: 'Get payee status', action: 'Get payee status' },
      { name: 'Get by Email', value: 'getByEmail', description: 'Get payee by email', action: 'Get payee by email' },
      { name: 'Get Balance', value: 'getBalance', description: 'Get payee balance', action: 'Get payee balance' },
      { name: 'Get Payment Methods', value: 'getPaymentMethods', description: 'Get payee payment methods', action: 'Get payee payment methods' },
      { name: 'Invite', value: 'invite', description: 'Send invitation to payee', action: 'Invite payee' },
      { name: 'Get Registration Link', value: 'getRegistrationLink', description: 'Get payee registration link', action: 'Get registration link' },
      { name: 'Check Eligibility', value: 'checkEligibility', description: 'Check payee eligibility', action: 'Check payee eligibility' },
    ],
    default: 'list',
  },
];

export const payeeFields: INodeProperties[] = [
  // Payee ID
  {
    displayName: 'Payee ID',
    name: 'payeeId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['payee'],
        operation: ['get', 'update', 'delete', 'getStatus', 'getBalance', 'getPaymentMethods', 'invite', 'checkEligibility'],
      },
    },
    default: '',
    description: 'The unique identifier of the payee',
  },

  // Email for getByEmail
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@email.com',
    required: true,
    displayOptions: {
      show: {
        resource: ['payee'],
        operation: ['getByEmail'],
      },
    },
    default: '',
    description: 'Email address of the payee',
  },

  // Create payee fields
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@email.com',
    required: true,
    displayOptions: {
      show: {
        resource: ['payee'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Email address of the payee',
  },
  {
    displayName: 'First Name',
    name: 'firstName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['payee'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Payee first name',
  },
  {
    displayName: 'Last Name',
    name: 'lastName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['payee'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Payee last name',
  },
  {
    displayName: 'Country',
    name: 'country',
    type: 'options',
    options: COUNTRY_OPTIONS,
    required: true,
    displayOptions: {
      show: {
        resource: ['payee'],
        operation: ['create'],
      },
    },
    default: 'US',
    description: 'Country of residence (ISO 3166-1 alpha-2)',
  },

  // Create payee additional fields
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['payee'],
        operation: ['create'],
      },
    },
    default: {},
    options: [
      { displayName: 'External ID', name: 'externalId', type: 'string', default: '', description: 'Your unique identifier for this payee' },
      { displayName: 'Company Name', name: 'companyName', type: 'string', default: '', description: 'Company name (for business payees)' },
      { displayName: 'Phone', name: 'phone', type: 'string', default: '', description: 'Phone number' },
      { displayName: 'Date of Birth', name: 'dateOfBirth', type: 'string', default: '', description: 'Date of birth (YYYY-MM-DD)' },
      { displayName: 'Address Line 1', name: 'addressLine1', type: 'string', default: '', description: 'Street address' },
      { displayName: 'Address Line 2', name: 'addressLine2', type: 'string', default: '' },
      { displayName: 'City', name: 'city', type: 'string', default: '' },
      { displayName: 'State', name: 'state', type: 'string', default: '', description: 'State/Province code' },
      { displayName: 'Postal Code', name: 'postalCode', type: 'string', default: '' },
      { displayName: 'Entity Type', name: 'entityType', type: 'options', options: [
        { name: 'Individual', value: 'INDIVIDUAL' },
        { name: 'Business', value: 'BUSINESS' },
      ], default: 'INDIVIDUAL' },
    ],
  },

  // Update fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['payee'],
        operation: ['update'],
      },
    },
    default: {},
    options: [
      { displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
      { displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
      { displayName: 'Email', name: 'email', type: 'string', default: '' },
      { displayName: 'Phone', name: 'phone', type: 'string', default: '' },
      { displayName: 'Company Name', name: 'companyName', type: 'string', default: '' },
      { displayName: 'Address Line 1', name: 'addressLine1', type: 'string', default: '' },
      { displayName: 'City', name: 'city', type: 'string', default: '' },
      { displayName: 'State', name: 'state', type: 'string', default: '' },
      { displayName: 'Postal Code', name: 'postalCode', type: 'string', default: '' },
      { displayName: 'Country', name: 'country', type: 'options', options: COUNTRY_OPTIONS, default: '' },
    ],
  },

  // List filters
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['payee'],
        operation: ['list'],
      },
    },
    default: {},
    options: [
      { displayName: 'Status', name: 'status', type: 'options', options: PAYEE_STATUS_OPTIONS, default: '' },
      { displayName: 'Country', name: 'country', type: 'options', options: COUNTRY_OPTIONS, default: '' },
      { displayName: 'Search', name: 'search', type: 'string', default: '', description: 'Search by name or email' },
      { displayName: 'Page', name: 'page', type: 'number', typeOptions: { minValue: 1 }, default: 1 },
      { displayName: 'Page Size', name: 'pageSize', type: 'number', typeOptions: { minValue: 1, maxValue: 100 }, default: 20 },
    ],
  },

  // Registration link options
  {
    displayName: 'Registration Options',
    name: 'registrationOptions',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['payee'],
        operation: ['getRegistrationLink'],
      },
    },
    default: {},
    options: [
      { displayName: 'Redirect URL', name: 'redirectUrl', type: 'string', default: '', description: 'URL to redirect after registration' },
      { displayName: 'Locale', name: 'locale', type: 'string', default: 'en', description: 'Registration form language' },
    ],
  },
];

export async function executePayeeOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  let response: IDataObject = {};

  const programId = await getProgramId(this);

  switch (operation) {
    case 'create': {
      const email = this.getNodeParameter('email', i) as string;
      const firstName = this.getNodeParameter('firstName', i) as string;
      const lastName = this.getNodeParameter('lastName', i) as string;
      const country = this.getNodeParameter('country', i) as string;
      const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

      const body: IDataObject = {
        email,
        firstName,
        lastName,
        country,
        ...additionalFields,
      };

      const endpoint = replacePathParams(ENDPOINTS.payee.create, { programId });
      response = await payoneerApiRequest(this, { method: 'POST', endpoint, body });
      break;
    }

    case 'get': {
      const payeeId = this.getNodeParameter('payeeId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.payee.get, { programId, payeeId });
      response = await payoneerApiRequest(this, { method: 'GET', endpoint });
      break;
    }

    case 'update': {
      const payeeId = this.getNodeParameter('payeeId', i) as string;
      const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
      const endpoint = replacePathParams(ENDPOINTS.payee.update, { programId, payeeId });
      response = await payoneerApiRequest(this, { method: 'PUT', endpoint, body: updateFields });
      break;
    }

    case 'delete': {
      const payeeId = this.getNodeParameter('payeeId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.payee.delete, { programId, payeeId });
      response = await payoneerApiRequest(this, { method: 'DELETE', endpoint });
      break;
    }

    case 'list': {
      const filters = this.getNodeParameter('filters', i) as IDataObject;
      const endpoint = replacePathParams(ENDPOINTS.payee.list, { programId });
      response = await payoneerApiRequest(this, { method: 'GET', endpoint, query: filters });
      break;
    }

    case 'getStatus': {
      const payeeId = this.getNodeParameter('payeeId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.payee.status, { programId, payeeId });
      response = await payoneerApiRequest(this, { method: 'GET', endpoint });
      break;
    }

    case 'getByEmail': {
      const email = this.getNodeParameter('email', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.payee.byEmail, { programId, email: encodeURIComponent(email) });
      response = await payoneerApiRequest(this, { method: 'GET', endpoint });
      break;
    }

    case 'getBalance': {
      const payeeId = this.getNodeParameter('payeeId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.payee.balance, { programId, payeeId });
      response = await payoneerApiRequest(this, { method: 'GET', endpoint });
      break;
    }

    case 'getPaymentMethods': {
      const payeeId = this.getNodeParameter('payeeId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.payee.paymentMethods, { programId, payeeId });
      response = await payoneerApiRequest(this, { method: 'GET', endpoint });
      break;
    }

    case 'invite': {
      const payeeId = this.getNodeParameter('payeeId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.payee.invite, { programId, payeeId });
      response = await payoneerApiRequest(this, { method: 'POST', endpoint });
      break;
    }

    case 'getRegistrationLink': {
      const registrationOptions = this.getNodeParameter('registrationOptions', i) as IDataObject;
      const endpoint = replacePathParams(ENDPOINTS.payee.registrationLink, { programId });
      response = await payoneerApiRequest(this, { method: 'POST', endpoint, body: registrationOptions });
      break;
    }

    case 'checkEligibility': {
      const payeeId = this.getNodeParameter('payeeId', i) as string;
      const endpoint = replacePathParams(ENDPOINTS.payee.eligibility, { programId, payeeId });
      response = await payoneerApiRequest(this, { method: 'GET', endpoint });
      break;
    }
  }

  return response;
}
