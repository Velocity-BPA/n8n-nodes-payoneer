/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';

/**
 * Signature utilities for Payoneer webhook verification and request signing
 */

/**
 * Generate HMAC-SHA256 signature
 */
export function generateHmacSignature(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Generate HMAC-SHA512 signature
 */
export function generateHmacSignature512(payload: string, secret: string): string {
  return crypto.createHmac('sha512', secret).update(payload).digest('hex');
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
  algorithm: 'sha256' | 'sha512' = 'sha256',
): boolean {
  const expectedSignature =
    algorithm === 'sha256'
      ? generateHmacSignature(payload, secret)
      : generateHmacSignature512(payload, secret);

  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex'),
    );
  } catch {
    return false;
  }
}

/**
 * Parse webhook signature header
 * Payoneer may use format: t=timestamp,v1=signature
 */
export function parseSignatureHeader(
  header: string,
): { timestamp?: string; signatures: string[] } {
  const parts = header.split(',');
  const result: { timestamp?: string; signatures: string[] } = { signatures: [] };

  for (const part of parts) {
    const [key, value] = part.split('=');
    if (key === 't') {
      result.timestamp = value;
    } else if (key.startsWith('v')) {
      result.signatures.push(value);
    }
  }

  return result;
}

/**
 * Verify webhook with timestamp tolerance
 */
export function verifyWebhookWithTimestamp(
  payload: string,
  signatureHeader: string,
  secret: string,
  toleranceSeconds: number = 300,
): { valid: boolean; error?: string } {
  const { timestamp, signatures } = parseSignatureHeader(signatureHeader);

  if (!timestamp) {
    return { valid: false, error: 'Missing timestamp in signature header' };
  }

  if (signatures.length === 0) {
    return { valid: false, error: 'No signatures found in header' };
  }

  // Check timestamp tolerance
  const webhookTime = parseInt(timestamp, 10);
  const currentTime = Math.floor(Date.now() / 1000);

  if (Math.abs(currentTime - webhookTime) > toleranceSeconds) {
    return { valid: false, error: 'Webhook timestamp is outside tolerance window' };
  }

  // Build signed payload
  const signedPayload = `${timestamp}.${payload}`;

  // Verify against any valid signature
  for (const signature of signatures) {
    if (verifyWebhookSignature(signedPayload, signature, secret)) {
      return { valid: true };
    }
  }

  return { valid: false, error: 'Signature verification failed' };
}

/**
 * Generate request signature for API calls
 */
export function generateRequestSignature(
  method: string,
  path: string,
  timestamp: string,
  body: string,
  secret: string,
): string {
  const payload = `${method.toUpperCase()}\n${path}\n${timestamp}\n${body}`;
  return generateHmacSignature(payload, secret);
}

/**
 * Generate authorization header for Basic Auth
 */
export function generateBasicAuthHeader(username: string, password: string): string {
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  return `Basic ${credentials}`;
}

/**
 * Generate a random webhook secret
 */
export function generateWebhookSecret(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash sensitive data for logging (non-reversible)
 */
export function hashForLogging(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16) + '...';
}

/**
 * Generate idempotency key
 */
export function generateIdempotencyKey(): string {
  return `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
}

/**
 * Generate nonce for OAuth
 */
export function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
}
