/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IWebhookFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { verifyWebhookSignature, verifyWebhookWithTimestamp } from '../utils/signatureUtils';

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  // Account events
  ACCOUNT_CREATED: 'account.created',
  ACCOUNT_UPDATED: 'account.updated',
  ACCOUNT_VERIFIED: 'account.verified',
  ACCOUNT_SUSPENDED: 'account.suspended',
  BALANCE_CHANGED: 'account.balance.changed',
  KYC_STATUS_CHANGED: 'account.kyc.status_changed',

  // Payee events
  PAYEE_CREATED: 'payee.created',
  PAYEE_UPDATED: 'payee.updated',
  PAYEE_VERIFIED: 'payee.verified',
  PAYEE_REGISTRATION_COMPLETE: 'payee.registration.complete',
  PAYEE_STATUS_CHANGED: 'payee.status.changed',

  // Payment events
  PAYMENT_CREATED: 'payment.created',
  PAYMENT_APPROVED: 'payment.approved',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_CANCELLED: 'payment.cancelled',
  PAYMENT_PENDING: 'payment.pending',

  // Payout events
  PAYOUT_CREATED: 'payout.created',
  PAYOUT_COMPLETED: 'payout.completed',
  PAYOUT_FAILED: 'payout.failed',
  PAYOUT_CANCELLED: 'payout.cancelled',
  PAYOUT_PENDING: 'payout.pending',

  // Transfer events
  TRANSFER_CREATED: 'transfer.created',
  TRANSFER_COMPLETED: 'transfer.completed',
  TRANSFER_FAILED: 'transfer.failed',
  TRANSFER_CANCELLED: 'transfer.cancelled',

  // Withdrawal events
  WITHDRAWAL_REQUESTED: 'withdrawal.requested',
  WITHDRAWAL_COMPLETED: 'withdrawal.completed',
  WITHDRAWAL_FAILED: 'withdrawal.failed',
  WITHDRAWAL_CANCELLED: 'withdrawal.cancelled',

  // Load events
  LOAD_REQUESTED: 'load.requested',
  LOAD_COMPLETED: 'load.completed',
  FUNDS_RECEIVED: 'load.funds_received',

  // Card events
  CARD_ACTIVATED: 'card.activated',
  CARD_BLOCKED: 'card.blocked',
  CARD_TRANSACTION: 'card.transaction',
  CARD_BALANCE_LOW: 'card.balance.low',

  // Bank account events
  BANK_ACCOUNT_ADDED: 'bank_account.added',
  BANK_ACCOUNT_VERIFIED: 'bank_account.verified',
  BANK_ACCOUNT_REMOVED: 'bank_account.removed',

  // Compliance events
  KYC_REQUIRED: 'compliance.kyc.required',
  KYC_APPROVED: 'compliance.kyc.approved',
  KYC_REJECTED: 'compliance.kyc.rejected',
  DOCUMENTS_REQUIRED: 'compliance.documents.required',

  // Invoice events
  INVOICE_CREATED: 'invoice.created',
  INVOICE_SENT: 'invoice.sent',
  INVOICE_PAID: 'invoice.paid',
  INVOICE_OVERDUE: 'invoice.overdue',

  // Mass payout events
  MASS_PAYOUT_CREATED: 'mass_payout.created',
  MASS_PAYOUT_COMPLETED: 'mass_payout.completed',
  MASS_PAYOUT_FAILED: 'mass_payout.failed',
  MASS_PAYOUT_PARTIAL: 'mass_payout.partial',
} as const;

export type WebhookEvent = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS];

/**
 * Webhook payload structure
 */
export interface WebhookPayload {
  id: string;
  type: WebhookEvent;
  created: string;
  data: IDataObject;
  accountId?: string;
  programId?: string;
}

/**
 * Get webhook event options for n8n dropdown
 */
export function getWebhookEventOptions(): Array<{ name: string; value: string }> {
  return Object.entries(WEBHOOK_EVENTS).map(([key, value]) => ({
    name: key
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' '),
    value,
  }));
}

/**
 * Parse incoming webhook request
 */
export async function parseWebhookRequest(
  context: IWebhookFunctions,
): Promise<{ payload: WebhookPayload; rawBody: string }> {
  const req = context.getRequestObject();

  // Get raw body
  let rawBody: string;
  if (typeof req.body === 'string') {
    rawBody = req.body;
  } else {
    rawBody = JSON.stringify(req.body);
  }

  // Parse payload
  let payload: WebhookPayload;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    throw new NodeOperationError(context.getNode(), 'Invalid webhook payload');
  }

  return { payload, rawBody };
}

/**
 * Verify webhook signature
 */
export async function verifyWebhook(
  context: IWebhookFunctions,
  rawBody: string,
): Promise<boolean> {
  const credentials = await context.getCredentials('payoneerApi');
  const webhookSecret = credentials.webhookSecret as string;

  if (!webhookSecret) {
    // If no secret configured, skip verification
    console.warn('Webhook secret not configured - skipping signature verification');
    return true;
  }

  const req = context.getRequestObject();

  // Try different signature header formats
  const signatureHeader =
    req.headers['x-payoneer-signature'] ||
    req.headers['payoneer-signature'] ||
    req.headers['x-signature'];

  if (!signatureHeader) {
    throw new NodeOperationError(
      context.getNode(),
      'Webhook signature header is missing',
    );
  }

  const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;

  // Check if signature includes timestamp
  if (signature.includes(',')) {
    const result = verifyWebhookWithTimestamp(rawBody, signature, webhookSecret);
    if (!result.valid) {
      throw new NodeOperationError(
        context.getNode(),
        `Webhook verification failed: ${result.error}`,
      );
    }
    return true;
  }

  // Simple signature verification
  if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
    throw new NodeOperationError(
      context.getNode(),
      'Webhook signature verification failed',
    );
  }

  return true;
}

/**
 * Filter webhook events
 */
export function filterWebhookEvents(
  payload: WebhookPayload,
  allowedEvents: string[],
): boolean {
  if (allowedEvents.length === 0 || allowedEvents.includes('*')) {
    return true;
  }

  return allowedEvents.includes(payload.type);
}

/**
 * Format webhook response for n8n
 */
export function formatWebhookResponse(
  payload: WebhookPayload,
): IDataObject {
  return {
    webhookId: payload.id,
    eventType: payload.type,
    eventTime: payload.created,
    accountId: payload.accountId,
    programId: payload.programId,
    data: payload.data,
  };
}

/**
 * Extract resource type from event
 */
export function getResourceFromEvent(event: string): string {
  const parts = event.split('.');
  return parts[0] || 'unknown';
}

/**
 * Extract action from event
 */
export function getActionFromEvent(event: string): string {
  const parts = event.split('.');
  return parts.slice(1).join('.') || 'unknown';
}

/**
 * Build webhook registration payload
 */
export function buildWebhookRegistration(
  url: string,
  events: string[],
  options?: {
    secret?: string;
    description?: string;
    active?: boolean;
  },
): IDataObject {
  return {
    url,
    events,
    secret: options?.secret,
    description: options?.description,
    active: options?.active ?? true,
  };
}
