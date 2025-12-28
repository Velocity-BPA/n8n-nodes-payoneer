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
  IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { PAYONEER_ENVIRONMENTS, OAUTH_ENDPOINTS, DEFAULT_SCOPES, PayoneerEnvironment } from '../constants/endpoints';
import { generateNonce } from '../utils/signatureUtils';

type ExecutionContext = IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions;

/**
 * OAuth token response
 */
export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

/**
 * OAuth configuration
 */
export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  environment: PayoneerEnvironment;
}

/**
 * Build OAuth URL for authorization
 */
export function buildAuthorizationUrl(config: OAuthConfig): string {
  const envConfig = PAYONEER_ENVIRONMENTS[config.environment];
  const baseUrl = envConfig.oauthUrl;

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope.join(' '),
    state: generateNonce(),
  });

  return `${baseUrl}${OAUTH_ENDPOINTS.authorize}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForToken(
  context: ExecutionContext,
  code: string,
  config: OAuthConfig,
): Promise<OAuthTokenResponse> {
  const envConfig = PAYONEER_ENVIRONMENTS[config.environment];
  const tokenUrl = `${envConfig.oauthUrl}${OAUTH_ENDPOINTS.token}`;

  const body = {
    grant_type: 'authorization_code',
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
  };

  try {
    const response = await context.helpers.request({
      method: 'POST',
      url: tokenUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams(body as Record<string, string>).toString(),
      json: true,
    });

    return response as OAuthTokenResponse;
  } catch (error) {
    throw new NodeOperationError(
      context.getNode(),
      `Failed to exchange authorization code: ${(error as Error).message}`,
    );
  }
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(
  context: ExecutionContext,
  refreshToken: string,
  config: OAuthConfig,
): Promise<OAuthTokenResponse> {
  const envConfig = PAYONEER_ENVIRONMENTS[config.environment];
  const tokenUrl = `${envConfig.oauthUrl}${OAUTH_ENDPOINTS.refresh}`;

  const body = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  };

  try {
    const response = await context.helpers.request({
      method: 'POST',
      url: tokenUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams(body as Record<string, string>).toString(),
      json: true,
    });

    return response as OAuthTokenResponse;
  } catch (error) {
    throw new NodeOperationError(
      context.getNode(),
      `Failed to refresh access token: ${(error as Error).message}`,
    );
  }
}

/**
 * Revoke access token
 */
export async function revokeToken(
  context: ExecutionContext,
  token: string,
  tokenType: 'access_token' | 'refresh_token',
  config: OAuthConfig,
): Promise<void> {
  const envConfig = PAYONEER_ENVIRONMENTS[config.environment];
  const revokeUrl = `${envConfig.oauthUrl}${OAUTH_ENDPOINTS.revoke}`;

  const body = {
    token,
    token_type_hint: tokenType,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  };

  try {
    await context.helpers.request({
      method: 'POST',
      url: revokeUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(body as Record<string, string>).toString(),
    });
  } catch (error) {
    // Revocation errors are typically not critical
    console.warn(`Token revocation warning: ${(error as Error).message}`);
  }
}

/**
 * Get OAuth config from credentials
 */
export async function getOAuthConfig(
  context: ExecutionContext,
): Promise<OAuthConfig> {
  const credentials = await context.getCredentials('payoneerOAuthApi');

  return {
    clientId: credentials.clientId as string,
    clientSecret: credentials.clientSecret as string,
    redirectUri: credentials.redirectUri as string,
    scope: (credentials.scope as string)?.split(',').map((s) => s.trim()) || [...DEFAULT_SCOPES],
    environment: (credentials.environment as PayoneerEnvironment) || 'sandbox',
  };
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expiresAt: number, bufferSeconds: number = 300): boolean {
  const now = Math.floor(Date.now() / 1000);
  return now >= expiresAt - bufferSeconds;
}

/**
 * Get valid access token (refreshing if necessary)
 */
export async function getValidAccessToken(
  context: ExecutionContext,
  credentials: IDataObject,
): Promise<string> {
  const accessToken = credentials.accessToken as string;
  const refreshToken = credentials.refreshToken as string;
  const expiresAt = credentials.expiresAt as number;

  // Check if current token is valid
  if (accessToken && !isTokenExpired(expiresAt)) {
    return accessToken;
  }

  // Refresh if we have a refresh token
  if (refreshToken) {
    const config = await getOAuthConfig(context);
    const newTokens = await refreshAccessToken(context, refreshToken, config);

    // Note: In a real implementation, you'd want to store these new tokens
    // This would typically be handled by n8n's credential system

    return newTokens.access_token;
  }

  throw new NodeOperationError(
    context.getNode(),
    'Access token is expired and no refresh token is available',
  );
}

/**
 * Build authorization header for OAuth
 */
export function buildOAuthHeader(accessToken: string): IDataObject {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}
