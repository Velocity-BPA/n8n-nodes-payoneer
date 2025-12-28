/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class PayoneerOAuthApi implements ICredentialType {
  name = 'payoneerOAuthApi';
  displayName = 'Payoneer OAuth API';
  documentationUrl = 'https://developer.payoneer.com/docs/';
  extends = ['oAuth2Api'];

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
      displayName: 'Grant Type',
      name: 'grantType',
      type: 'hidden',
      default: 'authorizationCode',
    },
    {
      displayName: 'Authorization URL',
      name: 'authUrl',
      type: 'hidden',
      default:
        '={{$self.environment === "production" ? "https://login.payoneer.com/oauth2/authorize" : "https://login.sandbox.payoneer.com/oauth2/authorize"}}',
    },
    {
      displayName: 'Access Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default:
        '={{$self.environment === "production" ? "https://login.payoneer.com/oauth2/token" : "https://login.sandbox.payoneer.com/oauth2/token"}}',
    },
    {
      displayName: 'Client ID',
      name: 'clientId',
      type: 'string',
      default: '',
      required: true,
      description: 'Your Payoneer OAuth Client ID',
    },
    {
      displayName: 'Client Secret',
      name: 'clientSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your Payoneer OAuth Client Secret',
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'string',
      default: 'read write payments payees transfers withdrawals reports',
      description: 'OAuth scopes to request (space-separated)',
    },
    {
      displayName: 'Auth URI Query Parameters',
      name: 'authQueryParameters',
      type: 'hidden',
      default: '',
    },
    {
      displayName: 'Authentication',
      name: 'authentication',
      type: 'hidden',
      default: 'body',
    },
    {
      displayName: 'Account ID',
      name: 'accountId',
      type: 'string',
      default: '',
      description: 'Your Payoneer Account ID (optional, for some operations)',
    },
    {
      displayName: 'Program ID',
      name: 'programId',
      type: 'string',
      default: '',
      description: 'Your Payoneer Program ID (for partner/payer operations)',
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
}
