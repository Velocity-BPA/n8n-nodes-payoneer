# n8n-nodes-payoneer

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for the Payoneer global payment platform, providing 23 resources and 200+ operations for payments, payouts, transfers, currency exchange, KYC compliance, and more.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **Account Management**: View balances, account details, status, limits, and KYC information
- **Payee Management**: Create, invite, and manage payment recipients with full lifecycle support
- **Payments & Payouts**: Create single payments, batch payments, scheduled payouts, and mass payouts
- **Transfers**: Internal transfers, currency conversion, and FX rate management
- **Withdrawals**: Withdraw to bank accounts with support for multiple methods
- **Currency Operations**: Exchange rates, FX quotes, rate locking, and multi-currency balances
- **Card Management**: Payoneer card activation, blocking, PIN management, and transaction history
- **Bank Accounts**: Add, verify, and manage linked bank accounts
- **Compliance**: KYC status, document submission, and country-specific requirements
- **Tax Management**: Tax form submission, W-9/W-8 status, and 1099 retrieval
- **Reporting**: Generate and download transaction reports, statements, and custom reports
- **Webhooks**: Real-time event notifications for all major operations
- **Marketplace Integration**: Link Amazon, eBay, Etsy, and other marketplace seller accounts
- **Invoice & Escrow**: Create invoices and manage escrow transactions

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-payoneer`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n custom nodes directory
cd ~/.n8n/custom

# Clone or copy the package
npm install n8n-nodes-payoneer
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-payoneer.git
cd n8n-nodes-payoneer

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink
./scripts/install-local.sh

# Restart n8n
```

## Credentials Setup

### API Key Authentication

| Field | Description |
|-------|-------------|
| Environment | `Production` or `Sandbox` |
| Account ID | Your Payoneer Account ID |
| API Username | Your API username |
| API Password | Your API password |
| Program ID | Program ID for partner operations (optional) |
| Webhook Secret | Secret for webhook verification (optional) |

### OAuth2 Authentication

| Field | Description |
|-------|-------------|
| Environment | `Production` or `Sandbox` |
| Client ID | OAuth Client ID |
| Client Secret | OAuth Client Secret |
| Scope | OAuth scopes (space-separated) |

## Resources & Operations

### Account
- Get Details, Balance, Balances, Status, Limits, Fees, Activity
- Update Info, Get by ID, Get Holder, Get KYC Status

### Payee
- Create, Get, Update, Delete, List
- Get Status, Get by Email, Get Balance
- Get Payment Methods, Invite, Get Registration Link, Check Eligibility

### Payment
- Create, Get, Get Status, Cancel, List
- Get by Payee, Get by Date, Get by Status
- Batch Create, Get Details, Get Fees, Approve, Reject

### Payout
- Create, Get, Get Status, Cancel, List
- Get by Reference, Batch Create, Get Fees, Get Options
- Schedule, Get Scheduled

### Transfer
- Create, Get, Get Status, List
- Get by Reference, Get Fees, Get Internal
- Convert Currency, Get Rate, Cancel

### Withdrawal
- Create, Get, Get Status, Cancel, List
- Get Methods, Get Fees, Get Limits
- Get Bank Accounts, Add Bank Account, Remove Bank Account

### Currency
- Get Supported, Get Balance, Get Exchange Rate
- Convert, Get FX Quote, Lock Rate, Get Limits, Get Fees

### Card
- Get Details, Get Balance, Activate, Block, Unblock
- Get Status, Get Transactions, Set PIN
- Get Limits, Update Limits, Get Virtual, Order Physical

### And 14 more resources...

## Trigger Node

The Payoneer Trigger node supports real-time webhooks for:
- Account events (created, updated, verified, suspended)
- Payee events (created, updated, registration complete)
- Payment events (created, approved, completed, failed)
- Payout events (created, completed, failed)
- Transfer events (created, completed, failed)
- Card events (activated, blocked, transaction)
- Compliance events (KYC required, approved, rejected)
- And many more...

## Usage Examples

### Create a Payee and Make Payment

```javascript
// Node 1: Payoneer - Create Payee
{
  "resource": "payee",
  "operation": "create",
  "email": "contractor@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "country": "US"
}

// Node 2: Payoneer - Create Payment
{
  "resource": "payment",
  "operation": "create",
  "payeeId": "{{ $node['Create Payee'].json.payeeId }}",
  "amount": 1000,
  "currency": "USD",
  "description": "Monthly payment"
}
```

### Mass Payout to Multiple Recipients

```javascript
{
  "resource": "massPayout",
  "operation": "create",
  "payments": [
    { "payeeId": "payee1", "amount": 500, "currency": "USD" },
    { "payeeId": "payee2", "amount": 750, "currency": "USD" },
    { "payeeId": "payee3", "amount": 300, "currency": "EUR" }
  ],
  "description": "Weekly payroll"
}
```

### Currency Conversion

```javascript
{
  "resource": "currency",
  "operation": "convert",
  "amount": 1000,
  "fromCurrency": "USD",
  "toCurrency": "EUR"
}
```

## Payoneer Concepts

| Term | Description |
|------|-------------|
| **Payee** | Payment recipient (freelancer, contractor, seller) |
| **Payer** | Entity making payments (your organization) |
| **Program** | Partner/merchant program account |
| **Load** | Adding funds to your Payoneer account |
| **Receiving Account** | Virtual bank account for receiving payments |
| **Mass Payout** | Batch payment to multiple recipients |
| **KYC** | Know Your Customer verification process |
| **FX** | Foreign exchange / currency conversion |

## Error Handling

The node provides detailed error messages for common scenarios:
- `AUTH_INVALID_CREDENTIALS` - Check API credentials
- `ACCOUNT_INSUFFICIENT_BALANCE` - Insufficient funds for operation
- `PAYEE_NOT_FOUND` - Invalid payee ID
- `VALIDATION_INVALID_AMOUNT` - Amount format or limits issue
- `KYC_REQUIRED` - KYC verification needed
- `RATE_LIMIT_EXCEEDED` - API rate limit reached

## Security Best Practices

1. **Use Sandbox for Testing**: Always test with sandbox credentials first
2. **Secure Credentials**: Never log or expose API credentials
3. **Verify Webhooks**: Enable signature verification for webhooks
4. **Minimum Permissions**: Use OAuth scopes that match your needs
5. **Monitor Transactions**: Set up alerts for unusual activity

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run linting
npm run lint

# Run tests
npm test

# Build for production
npm run build
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Documentation**: [Payoneer API Docs](https://developer.payoneer.com/docs/)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-payoneer/issues)
- **Licensing**: licensing@velobpa.com

## Acknowledgments

- [Payoneer](https://www.payoneer.com/) for providing the API
- [n8n](https://n8n.io/) for the workflow automation platform
- The n8n community for inspiration and support
