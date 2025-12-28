/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IHookFunctions,
  IWebhookFunctions,
  IDataObject,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import { PAYONEER_ENVIRONMENTS, API_VERSION, PayoneerEnvironment } from '../constants/endpoints';
import { generateIdempotencyKey, hashForLogging } from '../utils/signatureUtils';

type ExecutionContext =
  | IExecuteFunctions
  | ILoadOptionsFunctions
  | IHookFunctions
  | IWebhookFunctions;

/**
 * Payoneer API response interface
 */
export interface PayoneerApiResponse<T = IDataObject> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: IDataObject;
  };
  pagination?: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
}

/**
 * Payoneer API request options
 */
export interface PayoneerRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  body?: IDataObject;
  query?: IDataObject;
  headers?: IDataObject;
  useOAuth?: boolean;
  idempotencyKey?: string;
  timeout?: number;
}

/**
 * Logging notice - displayed once per node load
 */
let licensingNoticeLogged = false;

function logLicensingNotice(): void {
  if (!licensingNoticeLogged) {
    console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
    licensingNoticeLogged = true;
  }
}

/**
 * Build the full API URL
 */
function buildApiUrl(environment: PayoneerEnvironment, endpoint: string): string {
  const envConfig = PAYONEER_ENVIRONMENTS[environment];
  const baseUrl = envConfig.baseUrl;

  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return `${baseUrl}/${API_VERSION}${normalizedEndpoint}`;
}

/**
 * Replace path parameters in endpoint
 */
export function replacePathParams(
  endpoint: string,
  params: Record<string, string>,
): string {
  let result = endpoint;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`{${key}}`, encodeURIComponent(value));
  }
  return result;
}

/**
 * Get credentials from n8n
 */
async function getCredentials(
  context: ExecutionContext,
  useOAuth: boolean,
): Promise<IDataObject> {
  if (useOAuth) {
    return context.getCredentials('payoneerOAuthApi');
  }
  return context.getCredentials('payoneerApi');
}

/**
 * Build authentication headers
 */
function buildAuthHeaders(credentials: IDataObject, useOAuth: boolean): IDataObject {
  if (useOAuth) {
    const accessToken = credentials.accessToken as string;
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }

  // Basic auth
  const username = credentials.apiUsername as string;
  const password = credentials.apiPassword as string;
  const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

  return {
    Authorization: `Basic ${basicAuth}`,
  };
}

/**
 * Handle API errors
 */
function handleApiError(
  context: ExecutionContext,
  error: Error | JsonObject,
  endpoint: string,
): never {
  if (error instanceof NodeApiError || error instanceof NodeOperationError) {
    throw error;
  }

  const errorResponse = error as JsonObject;

  // Extract error details
  const statusCode = (errorResponse.statusCode as number) || 500;
  const errorMessage =
    (errorResponse.message as string) ||
    (errorResponse.error?.message as string) ||
    'Unknown error occurred';
  const errorCode =
    (errorResponse.code as string) ||
    (errorResponse.error?.code as string) ||
    'UNKNOWN_ERROR';

  // Log error (without sensitive data)
  console.error(`Payoneer API Error [${statusCode}]: ${errorCode} - ${errorMessage}`);
  console.error(`Endpoint: ${hashForLogging(endpoint)}`);

  throw new NodeApiError(context.getNode(), errorResponse as JsonObject, {
    message: errorMessage,
    description: `Payoneer API returned error code: ${errorCode}`,
    httpCode: statusCode.toString(),
  });
}

/**
 * Make an authenticated request to the Payoneer API
 */
export async function payoneerApiRequest(
  context: ExecutionContext,
  options: PayoneerRequestOptions,
): Promise<IDataObject> {
  // Log licensing notice once
  logLicensingNotice();

  const { method, endpoint, body, query, headers, useOAuth = false, idempotencyKey } = options;

  // Get credentials
  const credentials = await getCredentials(context, useOAuth);
  const environment = (credentials.environment as PayoneerEnvironment) || 'sandbox';

  // Build URL
  const url = buildApiUrl(environment, endpoint);

  // Build headers
  const authHeaders = buildAuthHeaders(credentials, useOAuth);
  const requestHeaders: IDataObject = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...authHeaders,
    ...headers,
  };

  // Add idempotency key for POST/PUT requests
  if ((method === 'POST' || method === 'PUT') && idempotencyKey) {
    requestHeaders['Idempotency-Key'] = idempotencyKey;
  } else if (method === 'POST' || method === 'PUT') {
    requestHeaders['Idempotency-Key'] = generateIdempotencyKey();
  }

  // Add program ID if available
  if (credentials.programId) {
    requestHeaders['X-Program-Id'] = credentials.programId;
  }

  // Add partner ID if available
  if (credentials.partnerId) {
    requestHeaders['X-Partner-Id'] = credentials.partnerId;
  }

  try {
    const response = await context.helpers.request({
      method,
      url,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      qs: query,
      json: true,
      timeout: options.timeout || 30000,
    });

    return response as IDataObject;
  } catch (error) {
    handleApiError(context, error as Error, endpoint);
  }
}

/**
 * Make a paginated request to the Payoneer API
 */
export async function payoneerApiRequestAllItems(
  context: ExecutionContext,
  options: PayoneerRequestOptions,
  propertyName: string = 'items',
  maxResults?: number,
): Promise<IDataObject[]> {
  const allItems: IDataObject[] = [];
  let page = 1;
  const pageSize = 100;

  const query = {
    ...options.query,
    page,
    pageSize,
  };

  do {
    const response = await payoneerApiRequest(context, {
      ...options,
      query: { ...query, page },
    });

    const items = (response[propertyName] as IDataObject[]) || [];
    allItems.push(...items);

    // Check if we've reached max results
    if (maxResults && allItems.length >= maxResults) {
      return allItems.slice(0, maxResults);
    }

    // Check pagination info
    const pagination = response.pagination as IDataObject;
    const totalPages = (pagination?.totalPages as number) || 1;

    if (page >= totalPages) {
      break;
    }

    page++;
  } while (true);

  return allItems;
}

/**
 * Make a request with retry logic
 */
export async function payoneerApiRequestWithRetry(
  context: ExecutionContext,
  options: PayoneerRequestOptions,
  maxRetries: number = 3,
  retryDelay: number = 1000,
): Promise<IDataObject> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await payoneerApiRequest(context, options);
    } catch (error) {
      lastError = error as Error;

      // Check if error is retryable
      const errorResponse = error as JsonObject;
      const statusCode = (errorResponse.statusCode as number) || 500;

      // Only retry on 5xx errors or rate limiting
      if (statusCode < 500 && statusCode !== 429) {
        throw error;
      }

      // Wait before retry
      if (attempt < maxRetries - 1) {
        const delay = statusCode === 429 ? retryDelay * 2 : retryDelay;
        await new Promise((resolve) => setTimeout(resolve, delay * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

/**
 * Validate API connection
 */
export async function validateConnection(
  context: ExecutionContext,
  useOAuth: boolean = false,
): Promise<boolean> {
  try {
    const credentials = await getCredentials(context, useOAuth);
    const accountId = credentials.accountId as string;

    await payoneerApiRequest(context, {
      method: 'GET',
      endpoint: `/accounts/${accountId}/status`,
      useOAuth,
    });

    return true;
  } catch {
    return false;
  }
}

/**
 * Get account ID from credentials or context
 */
export async function getAccountId(context: ExecutionContext): Promise<string> {
  const credentials = await context.getCredentials('payoneerApi');
  const accountId = credentials.accountId as string;

  if (!accountId) {
    throw new NodeOperationError(context.getNode(), 'Account ID is required');
  }

  return accountId;
}

/**
 * Get program ID from credentials or context
 */
export async function getProgramId(context: ExecutionContext): Promise<string> {
  const credentials = await context.getCredentials('payoneerApi');
  const programId = credentials.programId as string;

  if (!programId) {
    throw new NodeOperationError(context.getNode(), 'Program ID is required');
  }

  return programId;
}
