/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IWebhookFunctions,
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
} from 'n8n-workflow';
import { parseWebhookRequest, verifyWebhook, filterWebhookEvents, formatWebhookResponse, WEBHOOK_EVENTS } from './transport/webhookHandler';
import { payoneerApiRequest } from './transport/payoneerClient';
import { ENDPOINTS } from './constants/endpoints';

export class PayoneerTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Payoneer Trigger',
    name: 'payoneerTrigger',
    icon: 'file:payoneer.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["events"].length}} event(s)',
    description: 'Handle Payoneer events via webhooks',
    defaults: { name: 'Payoneer Trigger' },
    inputs: [],
    outputs: ['main'],
    credentials: [{ name: 'payoneerApi', required: true }],
    webhooks: [{ name: 'default', httpMethod: 'POST', responseMode: 'onReceived', path: 'webhook' }],
    properties: [
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        required: true,
        default: [],
        options: [
          { name: 'Account - Created', value: 'account.created' },
          { name: 'Account - Updated', value: 'account.updated' },
          { name: 'Account - Verified', value: 'account.verified' },
          { name: 'Account - Suspended', value: 'account.suspended' },
          { name: 'Account - Balance Changed', value: 'account.balance.changed' },
          { name: 'Account - KYC Status Changed', value: 'account.kyc.status_changed' },
          { name: 'Payee - Created', value: 'payee.created' },
          { name: 'Payee - Updated', value: 'payee.updated' },
          { name: 'Payee - Verified', value: 'payee.verified' },
          { name: 'Payee - Registration Complete', value: 'payee.registration.complete' },
          { name: 'Payee - Status Changed', value: 'payee.status.changed' },
          { name: 'Payment - Created', value: 'payment.created' },
          { name: 'Payment - Approved', value: 'payment.approved' },
          { name: 'Payment - Completed', value: 'payment.completed' },
          { name: 'Payment - Failed', value: 'payment.failed' },
          { name: 'Payment - Cancelled', value: 'payment.cancelled' },
          { name: 'Payment - Pending', value: 'payment.pending' },
          { name: 'Payout - Created', value: 'payout.created' },
          { name: 'Payout - Completed', value: 'payout.completed' },
          { name: 'Payout - Failed', value: 'payout.failed' },
          { name: 'Payout - Cancelled', value: 'payout.cancelled' },
          { name: 'Payout - Pending', value: 'payout.pending' },
          { name: 'Transfer - Created', value: 'transfer.created' },
          { name: 'Transfer - Completed', value: 'transfer.completed' },
          { name: 'Transfer - Failed', value: 'transfer.failed' },
          { name: 'Transfer - Cancelled', value: 'transfer.cancelled' },
          { name: 'Withdrawal - Requested', value: 'withdrawal.requested' },
          { name: 'Withdrawal - Completed', value: 'withdrawal.completed' },
          { name: 'Withdrawal - Failed', value: 'withdrawal.failed' },
          { name: 'Withdrawal - Cancelled', value: 'withdrawal.cancelled' },
          { name: 'Load - Requested', value: 'load.requested' },
          { name: 'Load - Completed', value: 'load.completed' },
          { name: 'Load - Funds Received', value: 'load.funds_received' },
          { name: 'Card - Activated', value: 'card.activated' },
          { name: 'Card - Blocked', value: 'card.blocked' },
          { name: 'Card - Transaction', value: 'card.transaction' },
          { name: 'Card - Balance Low', value: 'card.balance.low' },
          { name: 'Bank Account - Added', value: 'bank_account.added' },
          { name: 'Bank Account - Verified', value: 'bank_account.verified' },
          { name: 'Bank Account - Removed', value: 'bank_account.removed' },
          { name: 'Compliance - KYC Required', value: 'compliance.kyc.required' },
          { name: 'Compliance - KYC Approved', value: 'compliance.kyc.approved' },
          { name: 'Compliance - KYC Rejected', value: 'compliance.kyc.rejected' },
          { name: 'Compliance - Documents Required', value: 'compliance.documents.required' },
          { name: 'Invoice - Created', value: 'invoice.created' },
          { name: 'Invoice - Sent', value: 'invoice.sent' },
          { name: 'Invoice - Paid', value: 'invoice.paid' },
          { name: 'Invoice - Overdue', value: 'invoice.overdue' },
          { name: 'Mass Payout - Created', value: 'mass_payout.created' },
          { name: 'Mass Payout - Completed', value: 'mass_payout.completed' },
          { name: 'Mass Payout - Failed', value: 'mass_payout.failed' },
          { name: 'Mass Payout - Partial', value: 'mass_payout.partial' },
        ],
        description: 'Select events to listen for',
      },
      {
        displayName: 'Verify Signature',
        name: 'verifySignature',
        type: 'boolean',
        default: true,
        description: 'Whether to verify webhook signatures (requires webhook secret in credentials)',
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        try {
          const response = await payoneerApiRequest(this, { method: 'GET', endpoint: ENDPOINTS.webhook.list });
          const webhooks = (response.webhooks || response.data || []) as Array<{ url: string }>;
          return webhooks.some((webhook) => webhook.url === webhookUrl);
        } catch {
          return false;
        }
      },
      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const events = this.getNodeParameter('events') as string[];
        try {
          await payoneerApiRequest(this, {
            method: 'POST',
            endpoint: ENDPOINTS.webhook.create,
            body: { url: webhookUrl, events, active: true },
          });
          return true;
        } catch (error) {
          console.error('Failed to create Payoneer webhook:', error);
          return false;
        }
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        try {
          const response = await payoneerApiRequest(this, { method: 'GET', endpoint: ENDPOINTS.webhook.list });
          const webhooks = (response.webhooks || response.data || []) as Array<{ id: string; url: string }>;
          const webhook = webhooks.find((w) => w.url === webhookUrl);
          if (webhook) {
            await payoneerApiRequest(this, { method: 'DELETE', endpoint: `/webhooks/${webhook.id}` });
          }
          return true;
        } catch {
          return false;
        }
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const verifySignature = this.getNodeParameter('verifySignature', true) as boolean;
    const allowedEvents = this.getNodeParameter('events') as string[];

    const { payload, rawBody } = await parseWebhookRequest(this);

    if (verifySignature) {
      await verifyWebhook(this, rawBody);
    }

    if (!filterWebhookEvents(payload, allowedEvents)) {
      return { noWebhookResponse: true };
    }

    const formattedResponse = formatWebhookResponse(payload);

    return {
      workflowData: [[{ json: formattedResponse }]],
    };
  }
}
