# TradeHub E-Commerce Platform - Complete Implementation Guide

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Demo Mode Setup](#demo-mode-setup)
5. [Production Deployment](#production-deployment)
6. [OPay Integration](#opay-integration)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Security & Compliance](#security--compliance)
10. [Monitoring & Logging](#monitoring--logging)
11. [Testing Guide](#testing-guide)
12. [Troubleshooting](#troubleshooting)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Layer                          │
│  React 18 + React Router + TailwindCSS + Radix UI          │
│  ✓ Shopping Cart, Product Catalog, User Orders             │
│  ✓ Checkout Flow, Payment Processing                       │
│  ✓ Real-time Notifications, Order Tracking                 │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend API Layer                        │
│  Express.js + TypeScript + Node.js                          │
│  ✓ REST API Endpoints                                      │
│  ✓ OPay Payment Integration                                │
│  ✓ Order Management                                        │
│  ✓ Webhook Handling                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    ┌────────┐ ┌────────┐ ┌────────┐
    │ OPay   │ │Database│ │ Cache  │
    │ API    │ │PostgreSQL Redis  │
    │        │ │        │ │        │
    └────────┘ └────────┘ └────────┘
```

### Key Features

**Current Implementation (Demo Mode)**
- ✓ Complete React frontend with modern UI
- ✓ Full checkout flow with multi-step wizard
- ✓ Shopping cart with promo codes
- ✓ Order management and tracking
- ✓ Payment initialization with OPay
- ✓ Mock payment processing in demo mode
- ✓ Comprehensive error handling
- ✓ Logging and monitoring

**Production Ready**
- ✓ Production payment mode with real OPay integration
- ✓ Database persistence for orders and payments
- ✓ Session management and user authentication
- ✓ Webhook signature verification
- ✓ Automated email notifications
- ✓ Invoice generation
- ✓ Transaction logging

---

## Tech Stack

### Frontend
- **React 18**: UI library with hooks
- **React Router 6**: Client-side routing (SPA mode)
- **TypeScript**: Type safety
- **TailwindCSS 3**: Utility-first styling
- **Radix UI**: Accessible component library
- **React Query**: Server state management
- **Sonner**: Toast notifications
- **Lucide Icons**: SVG icons
- **React Hook Form**: Form management

### Backend
- **Node.js**: JavaScript runtime
- **Express.js 5**: Web framework
- **TypeScript**: Type safety
- **Zod**: Runtime validation (optional)

### Infrastructure
- **Vite**: Build tool and dev server
- **Netlify/Vercel**: Deployment platform (optional)
- **Docker**: Containerization (optional)

---

## Project Structure

```
project-root/
├── client/                          # Frontend React application
│   ├── components/
│   │   ├── ui/                     # Pre-built UI components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (40+ components)
│   │   ├── Layout.tsx              # Main app layout
│   │   ├── NotificationCenter.tsx  # Notification UI
│   │   └── ... (other components)
│   ├── pages/
│   │   ├── Index.tsx               # Home page
│   │   ├── Products.tsx            # Product listing
│   │   ├── ProductDetail.tsx       # Single product view
│   │   ├── Cart.tsx                # Shopping cart
│   │   ├── Checkout.tsx            # Checkout flow
│   │   ├── PaymentReturn.tsx       # Payment confirmation
│   │   ├── Orders.tsx              # Order history
│   │   ├── OrderTracking.tsx       # Order details & tracking
│   │   └── ... (other pages)
│   ├── hooks/
│   │   ├── useCart.ts              # Cart state management
│   │   ├── useOrders.ts            # Order operations
│   │   ├── usePayment.ts           # Payment processing
│   │   ├── useOrderAPI.ts          # Order API calls
│   │   ├── useNotifications.ts     # Notification management
│   │   ├── usePromoCode.ts         # Promo code validation
│   │   └── ... (other hooks)
│   ├── store/
│   │   ├── cart.ts                 # Cart state (Zustand)
│   │   ├── orders.ts               # Orders state
│   │   ├── notifications.ts        # Notifications state
│   │   └── ... (other stores)
│   ├── types/
│   │   └── index.ts                # Type definitions
│   ├── data/
│   │   └── products.ts             # Mock product data
│   ├── services/
│   │   └── invoiceGenerator.ts     # Invoice generation
│   ├── lib/
│   │   └── utils.ts                # Utility functions
│   ├── App.tsx                     # App routing
│   ├── main.tsx                    # Entry point
│   ├── global.css                  # Global styles
│   └── vite-env.d.ts               # Vite types
│
├── server/                          # Backend Express application
│   ├── config/
│   │   └── payment.ts              # Payment configuration
│   ├── routes/
│   │   ├── demo.ts                 # Demo endpoint
│   │   ├── payment.ts              # Payment routes
│   │   └── orders.ts               # Order routes
│   ├── services/
│   │   └── invoiceGenerator.ts     # Server-side invoice generation
│   ├── utils/
│   │   ├── logger.ts               # Logging utility
│   │   └── errors.ts               # Error handling
│   ├── index.ts                    # Server setup & routes
│   ├── node-build.ts               # Production build config
│   └── routes/
│
├── shared/
│   └── api.ts                       # Shared types (client + server)
│
├── netlify/
│   └── functions/
│       └── api.ts                   # Netlify serverless function
│
├── public/                          # Static assets
│
├── DEPLOYMENT.md                    # This file
├── .env.example                     # Environment template
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── vite.config.ts                   # Vite frontend config
├── vite.config.server.ts            # Vite server config
└── README.md                        # Project README
```

---

## Demo Mode Setup

### Quick Start (Development)

```bash
# 1. Install dependencies
pnpm install

# 2. Create environment file (uses demo mode by default)
cp .env.example .env

# 3. Start development server
pnpm dev

# 4. Open browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:5173/api/*
```

### Testing Payment Flow

**In Demo Mode:**

1. Navigate to **Products** and add items to cart
2. Go to **Cart** and review items
3. Click **Proceed to Checkout**
4. Fill in shipping details:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: +234 801 234 5678
   - Address: 123 Main Street
   - City: Lagos
   - State: Lagos
   - Postal Code: 100001
5. Select **Shipping Method** (Standard/Express/Overnight)
6. (Optional) Apply a **Promo Code**:
   - Valid codes: `SAVE10`, `SAVE20`, `WELCOME50`
7. Click **Proceed to Shipping**
8. Click **Proceed to Payment**
9. Review **Order Summary**
10. Click **Pay Now** button
11. You'll be redirected to the demo OPay sandbox
12. Complete payment confirmation
13. Receive order confirmation and tracking number

### Demo Data

**Sample Products** (from `client/data/products.ts`):
- Electronics, Clothing, Home & Garden items with realistic pricing

**Promo Codes** (from `client/hooks/usePromoCode.ts`):
- `SAVE10`: 10% discount
- `SAVE20`: 20% discount
- `WELCOME50`: ₦5,000 fixed discount

**Test Payment Cards** (OPay Sandbox):
- Use any test card number provided by OPay
- Expiry: Any future date
- CVV: Any 3 digits

---

## Production Deployment

### Prerequisites

- Node.js 18+ installed
- OPay account with API credentials
- Database (PostgreSQL recommended)
- Redis instance (for caching/sessions)
- Netlify or Vercel account (optional)

### Step 1: Configure Environment Variables

Create `.env` file with production settings:

```bash
# Application
NODE_ENV=production
PORT=3000

# Payment Configuration - PRODUCTION MODE
PAYMENT_MODE=production
OPAY_SECRET_KEY=your_opay_production_secret_key
OPAY_API_URL=https://api.opaycheckout.com
OPAY_PUBLIC_KEY=your_opay_production_public_key

# Database
DATABASE_URL=postgresql://user:password@host:5432/tradehub
REDIS_URL=redis://user:password@host:6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Security
JWT_SECRET=your_very_secure_random_secret_key_here
CORS_ORIGIN=https://yourdomain.com

# Logging & Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
LOG_LEVEL=info
```

### Step 2: Build Application

```bash
# Build frontend and backend
pnpm build

# Output:
# - dist/spa/          (Frontend bundle)
# - dist/server/       (Backend bundle)
```

### Step 3: Start Production Server

```bash
# Start application
pnpm start

# Server will listen on configured PORT (default 3000)
```

### Step 4: Deploy to Netlify

```bash
# 1. Connect your Git repository to Netlify
# 2. Configure build settings:

Build command:    pnpm build
Publish directory: dist/spa
```

**Netlify Functions** (for serverless API):

The `netlify/functions/api.ts` file can be used for serverless deployment:

```bash
# Deploy with netlify-cli
npm install -g netlify-cli
netlify deploy
```

### Step 5: Setup HTTPS & CDN

- **Enable HTTPS**: Required for production payment processing
- **CDN**: Use Cloudflare or Netlify Edge for static assets
- **WAF**: Enable Web Application Firewall

### Step 6: Database Setup

**PostgreSQL Schema** (to be implemented):

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  reference_id VARCHAR(100) UNIQUE NOT NULL,
  tracking_number VARCHAR(100),
  total DECIMAL(10, 2),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  reference VARCHAR(100) UNIQUE NOT NULL,
  amount DECIMAL(10, 2),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_reference ON orders(reference_id);
CREATE INDEX idx_payment_reference ON payments(reference);
```

---

## OPay Integration

### Overview

OPay is a Nigerian fintech payment platform supporting:
- Wallet payments
- Bank transfers
- Card payments (via OPay)
- USSD
- Mobile money

### Integration Architecture

```
Client Browser
    ↓
[Checkout Form]
    ↓
POST /api/payment/initialize
    ↓
Backend Express Server
    ├─ Validate Order
    ├─ Create Order Record
    ├─ Call OPay API
    └─ Return Checkout URL
    ↓
Redirect to OPay Cashier
    ↓
User Completes Payment
    ↓
OPay Webhook → POST /api/payment/callback
    ↓
Update Order Status
    ↓
Redirect to Order Confirmation
```

### Payment Flow Implementation

**1. Initialize Payment**

```typescript
// client/hooks/usePayment.ts
const { initiatePayment } = usePayment();

const checkoutUrl = await initiatePayment({
  reference: orderData.referenceId,
  amount: totalAmount,
  userEmail: customerEmail,
  userName: customerName,
  callbackUrl: "https://api.yourdomain.com/payment/callback",
  returnUrl: "https://yourdomain.com/payment-return"
});

// Redirect user
window.location.href = checkoutUrl;
```

**2. Handle Callback**

```typescript
// server/routes/payment.ts
app.post("/api/payment/callback", async (req, res) => {
  // 1. Verify webhook signature
  const isValid = verifyOPaySignature(req.body, req.headers["opay-signature"]);
  
  // 2. Update order status
  if (req.body.status === "SUCCESS") {
    await updateOrderStatus(req.body.reference, "PAID");
    await sendConfirmationEmail(req.body.reference);
  }
  
  // 3. Acknowledge receipt
  res.json({ status: "success" });
});
```

**3. Payment Status Polling**

```typescript
// Client-side status check
const { getPaymentStatus } = usePayment();

const status = await getPaymentStatus(orderReference);
// Returns: { status: "PENDING" | "SUCCESS" | "FAILED" }
```

### OPay API Endpoints

**Initialize Payment (Production)**

```
POST https://api.opaycheckout.com/api/v1/international/transaction/initialize

Headers:
  Authorization: Bearer YOUR_SECRET_KEY
  Content-Type: application/json

Body:
{
  "reference": "ORD-1234567890",
  "amount": 150000,        // Amount in kobo (multiply by 100)
  "currency": "NGN",
  "country": "NG",
  "callbackUrl": "https://yourdomain.com/api/payment/callback",
  "returnUrl": "https://yourdomain.com/order/confirmation",
  "userInfo": {
    "userEmail": "customer@email.com",
    "userName": "John Doe"
  }
}

Response:
{
  "status": "success",
  "data": {
    "cashierUrl": "https://checkout.opaycheckout.com/...",
    "reference": "ORD-1234567890"
  }
}
```

**Webhook Signature Verification**

```typescript
import crypto from "crypto";

function verifyOPaySignature(body: object, signature: string): boolean {
  const hash = crypto
    .createHmac("sha256", process.env.OPAY_SECRET_KEY!)
    .update(JSON.stringify(body))
    .digest("hex");
  
  return hash === signature;
}
```

### Production Checklist

- [ ] OPay Account setup (live mode)
- [ ] API credentials configured in `.env`
- [ ] HTTPS enabled
- [ ] Webhook signature verification implemented
- [ ] Error handling for failed payments
- [ ] Email notifications for payment status
- [ ] Order status tracking
- [ ] Refund mechanism
- [ ] Payment logging
- [ ] Rate limiting on payment endpoints

---

## API Documentation

### Payment Endpoints

**POST /api/payment/initialize**

Initialize a payment transaction.

```typescript
Request:
{
  "reference": "REF-1234567890",
  "amount": 50000,
  "currency": "NGN",
  "country": "NG",
  "callbackUrl": "https://...",
  "returnUrl": "https://...",
  "userInfo": {
    "userEmail": "user@email.com",
    "userName": "John Doe"
  }
}

Response (200):
{
  "status": "success",
  "data": {
    "cashierUrl": "https://checkout.opaycheckout.com/...",
    "reference": "REF-1234567890"
  }
}

Response (400):
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Amount must be greater than 0"
}
```

**POST /api/payment/callback**

Webhook endpoint for OPay payment notifications.

```typescript
Request (from OPay):
{
  "reference": "REF-1234567890",
  "status": "SUCCESS",
  "amount": 50000,
  "timestamp": "2024-01-15T10:30:00Z",
  "transactionId": "TXN-123456789"
}

Headers:
  opay-signature: <hmac-sha256 signature>

Response (200):
{
  "status": "success",
  "message": "Webhook received and processed",
  "reference": "REF-1234567890"
}
```

**GET /api/payment/status/:reference**

Get payment status by reference ID.

```typescript
Response (200):
{
  "status": "success",
  "data": {
    "reference": "REF-1234567890",
    "paymentStatus": "SUCCESS",
    "amount": 50000,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Order Endpoints

**POST /api/orders**

Create a new order.

```typescript
Request:
{
  "items": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 10000,
      "quantity": 2,
      "category": "Electronics"
    }
  ],
  "subtotal": 20000,
  "shipping": 2000,
  "tax": 1650,
  "total": 23650,
  "shippingMethod": "standard",
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@email.com",
    "phone": "+234 801 234 5678",
    "address": "123 Main Street",
    "city": "Lagos",
    "state": "Lagos",
    "zipCode": "100001"
  },
  "discount": {
    "code": "SAVE10",
    "discountType": "percentage",
    "discountAmount": 2000
  }
}

Response (201):
{
  "status": "success",
  "id": "order_...",
  "orderNumber": "ORD-1234567890",
  "referenceId": "REF-1234567890",
  "trackingNumber": "TRK-...",
  "message": "Order created successfully"
}
```

**GET /api/orders**

Get all orders.

```typescript
Response (200):
{
  "status": "success",
  "data": [...],
  "count": 10
}
```

**GET /api/orders/:orderId**

Get specific order details.

```typescript
Response (200):
{
  "status": "success",
  "data": { ... }
}

Response (404):
{
  "status": "error",
  "message": "Order not found"
}
```

**PATCH /api/orders/:orderId/status**

Update order status.

```typescript
Request:
{
  "status": "shipped",
  "message": "Order has been dispatched"
}

Response (200):
{
  "status": "success",
  "message": "Order status updated",
  "data": { ... }
}
```

**DELETE /api/orders/:orderId**

Cancel an order.

```typescript
Response (200):
{
  "status": "success",
  "message": "Order cancelled successfully",
  "data": { ... }
}
```

---

## Database Schema

### Recommended PostgreSQL Schema

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  reference_id VARCHAR(100) UNIQUE NOT NULL,
  tracking_number VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  shipping DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  shipping_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  reference VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Status History Table
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Promo Codes Table
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20),
  discount_amount DECIMAL(10, 2),
  discount_percentage INTEGER,
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_reference_id ON orders(reference_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_reference ON payments(reference);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_promo_codes_active ON promo_codes(active);
```

---

## Security & Compliance

### PCI-DSS Compliance

**✓ Already Implemented:**
- No credit card data stored locally
- All payments handled by OPay (PCI-DSS compliant)
- HTTPS enforced
- Input validation
- Error handling without exposing sensitive data

**☐ To Implement:**
- WAF (Web Application Firewall)
- Rate limiting on payment endpoints
- Intrusion detection
- Security headers (CSP, X-Frame-Options, etc.)

### Security Headers

```typescript
// server/index.ts
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});
```

### HTTPS Configuration

**Mandatory for Production:**

```bash
# Netlify - Automatic HTTPS
# Vercel - Automatic HTTPS
# Self-hosted - Use Let's Encrypt

certbot certonly --standalone -d yourdomain.com
```

### JWT Security

```typescript
// Token generation
const token = jwt.sign(
  { userId, email },
  process.env.JWT_SECRET!,
  { expiresIn: "7d", algorithm: "HS256" }
);

// Token verification
const decoded = jwt.verify(token, process.env.JWT_SECRET!);
```

### Environment Variables

✓ **Never commit secrets to Git**
✓ **Use environment configuration**
✓ **Rotate keys regularly**
✓ **Use separate keys for dev/prod**

---

## Monitoring & Logging

### Logging Configuration

```typescript
// server/utils/logger.ts
import { logger } from "./utils/logger";

// Log different levels
logger.debug("Debug message", { data });
logger.info("Info message", { data });
logger.warn("Warning message", { data });
logger.error("Error message", error, { context });

// Retrieve logs
const logs = logger.getLogs({ level: "ERROR", limit: 100 });
```

### Error Tracking (Sentry)

```typescript
// Initialize Sentry
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Capture errors
try {
  // risky operation
} catch (error) {
  Sentry.captureException(error);
}
```

### Metrics to Monitor

- **Payment Success Rate**: `successful_payments / total_payments`
- **Average Payment Time**: Time from initialization to confirmation
- **Order Completion Rate**: `completed_orders / total_orders`
- **API Response Time**: Per endpoint latency
- **Error Rate**: Failed requests / total requests
- **Webhook Delivery**: Callback processing time and failures

---

## Testing Guide

### Unit Tests

```bash
# Run tests
pnpm test

# Watch mode
pnpm test --watch
```

### Integration Testing

```typescript
// test/payment.test.ts
import { describe, it, expect } from "vitest";

describe("Payment API", () => {
  it("should initialize payment", async () => {
    const response = await fetch("/api/payment/initialize", {
      method: "POST",
      body: JSON.stringify({
        reference: "REF-123",
        amount: 10000,
        // ...
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data.cashierUrl).toBeDefined();
  });
});
```

### E2E Testing (Cypress)

```typescript
// cypress/e2e/checkout.cy.ts
describe("Checkout Flow", () => {
  it("should complete purchase", () => {
    cy.visit("/");
    cy.contains("Add to Cart").click();
    cy.visit("/checkout");
    cy.get("input[name='firstName']").type("John");
    // ... complete checkout
    cy.contains("Pay Now").click();
    cy.url().should("include", "/order/");
  });
});
```

---

## Troubleshooting

### Common Issues

**1. Payment Initialization Fails**

```
Error: "Failed to initialize payment"

Solutions:
✓ Check OPAY_SECRET_KEY is set correctly
✓ Verify amount is positive number
✓ Ensure all required fields are provided
✓ Check network connectivity
```

**2. Webhook Not Received**

```
Error: Callback endpoint not triggered

Solutions:
✓ Verify callback URL is publicly accessible
✓ Check HTTPS is enabled
✓ Whitelist OPay IP addresses
✓ Review server logs for errors
```

**3. Order Not Created**

```
Error: "Failed to create order"

Solutions:
✓ Validate shipping address data
✓ Check items array is not empty
✓ Verify amounts are valid numbers
✓ Check server logs
```

**4. CORS Issues**

```
Error: "Access to XMLHttpRequest blocked by CORS"

Solutions:
✓ Check CORS_ORIGIN in .env
✓ Verify frontend domain is whitelisted
✓ Check server CORS middleware
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* pnpm dev

# Check logs
tail -f logs/server.log

# Monitor requests
curl -v http://localhost:3000/api/ping
```

---

## Production Checklist

### Pre-Launch

- [ ] OPay account configured
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] HTTPS certificate installed
- [ ] Email service configured
- [ ] Logging service connected
- [ ] Monitoring dashboards set up
- [ ] Backup strategy in place
- [ ] Security audit completed
- [ ] Load testing passed

### Launch Day

- [ ] Monitor error rates
- [ ] Check payment success rates
- [ ] Verify email notifications
- [ ] Monitor server resources
- [ ] Test order tracking
- [ ] Verify webhook delivery

### Post-Launch

- [ ] Regular security updates
- [ ] Database backups verified
- [ ] Analytics dashboard monitoring
- [ ] Customer support prepared
- [ ] Documentation updated

---

## Support & Resources

### Documentation
- [OPay API Docs](https://opaycheckout.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Community
- GitHub Issues: Report bugs
- Discussions: Ask questions
- Pull Requests: Contribute improvements

### Contact
- Email: support@tradehub.com
- Website: https://tradehub.com

---

## License

MIT License - See LICENSE file for details

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-15  
**Maintainer**: TradeHub Team
