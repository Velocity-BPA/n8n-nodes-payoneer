/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class PayoneerApi implements ICredentialType {
  name = 'payoneerApi';
  displayName = 'Payoneer API';
  documentationUrl = 'https://developer.payoneer.com/docs/';

  properties: INodeProperties[] = [
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      options: [
        {
          name: 'Production',
          value: 'production',
        },
        {
          name: 'Sandbox',
          value: 'sandbox',
        },
      ],
      default: 'sandbox',
      description: 'Select the Payoneer environment to connect to',
    },
    {
      displayName: 'Account ID',
      name: 'accountId',
      type: 'string',
      default: '',
      required: true,
      description: 'Your Payoneer Account ID',
    },
    {
      displayName: 'API Username',
      name: 'apiUsername',
      type: 'string',
      default: '',
      required: true,
      description: 'Your Payoneer API Username',
    },
    {
      displayName: 'API Password',
      name: 'apiPassword',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your Payoneer API Password',
    },
    {
      displayName: 'Program ID',
      name: 'programId',
      type: 'string',
      default: '',
      description: 'Your Payoneer Program ID (for partner/payer operations)',
    },
    {
      displayName: 'Partner ID',
      name: 'partnerId',
      type: 'string',
      default: '',
      description: 'Your Payoneer Partner ID (optional)',
    },
    {
      displayName: 'Webhook Secret',
      name: 'webhookSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Secret key for verifying webhook signatures (optional)',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      auth: {
        username: '={{$credentials.apiUsername}}',
        password: '={{$credentials.apiPassword}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '={{$credentials.environment === "production" ? "https://api.payoneer.com" : "https://api.sandbox.payoneer.com"}}',
      url: '/v4/accounts/{{$credentials.accountId}}/status',
      method: 'GET',
    },
  };
}
