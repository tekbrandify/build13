# TradeHub - Quick Start Guide

## 🚀 Get Started in 2 Minutes

### 1. Installation

```bash
# Clone repository and install dependencies
pnpm install
```

### 2. Start Development Server

```bash
# Starts both frontend and backend
pnpm dev
```

Open http://localhost:5173 in your browser

### 3. Test Payment Flow

1. **Browse Products**: Navigate to Products page
2. **Add Items**: Click "Add to Cart" on any product
3. **Checkout**: Go to Cart → Click "Proceed to Checkout"
4. **Enter Details**:
   ```
   First Name: John
   Last Name: Doe
   Email: john@example.com
   Phone: +234 801 234 5678
   Address: 123 Main Street
   City: Lagos
   State: Lagos
   Postal Code: 100001
   ```
5. **Select Shipping**: Choose Standard/Express/Overnight
6. **Apply Promo** (Optional): Try codes like `SAVE10`, `SAVE20`, `WELCOME50`
7. **Complete Payment**: Click "Pay Now" → Demo OPay sandbox
8. **Confirm**: You'll see order confirmation with tracking number

---

## 📁 Key Files to Know

### Frontend Pages
- `client/pages/Index.tsx` - Home page
- `client/pages/Products.tsx` - Product listing
- `client/pages/Checkout.tsx` - Checkout flow (Main payment integration)
- `client/pages/Orders.tsx` - Order history
- `client/pages/OrderTracking.tsx` - Order details

### Backend Routes
- `server/routes/payment.ts` - Payment initialization & callbacks
- `server/routes/orders.ts` - Order CRUD operations
- `server/index.ts` - Route registration

### Hooks (State Management)
- `client/hooks/usePayment.ts` - Payment operations (NEW)
- `client/hooks/useOrderAPI.ts` - Order API calls (NEW)
- `client/hooks/useCart.ts` - Shopping cart
- `client/hooks/useOrders.ts` - Local order management

### Configuration
- `.env` - Environment variables (create from `.env.example`)
- `server/config/payment.ts` - Payment configuration
- `shared/api.ts` - Shared API types

---

## 🔌 API Endpoints

### Payment API

```
POST   /api/payment/initialize     Initialize OPay payment
POST   /api/payment/callback       OPay webhook
GET    /api/payment/status/:ref    Check payment status
```

### Order API

```
POST   /api/orders                 Create order
GET    /api/orders                 List orders
GET    /api/orders/:orderId        Get order details
PATCH  /api/orders/:orderId/status Update status
DELETE /api/orders/:orderId        Cancel order
```

### Example Payment Initialization

```bash
curl -X POST http://localhost:3000/api/payment/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "REF-12345",
    "amount": 50000,
    "currency": "NGN",
    "country": "NG",
    "callbackUrl": "http://localhost:3000/api/payment/callback",
    "returnUrl": "http://localhost:3000/payment-return",
    "userInfo": {
      "userEmail": "test@example.com",
      "userName": "John Doe"
    }
  }'
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│  React Frontend (Port 5173)              │
│  - Shopping Cart                         │
│  - Checkout Flow                         │
│  - Order Tracking                        │
└────────────────┬────────────────────────┘
                 │ HTTP
                 ▼
┌─────────────────────────────────────────┐
│  Express Backend (Port 3000 / Vite)     │
│  - Payment Routes                       │
│  - Order Routes                         │
│  - Webhook Handler                      │
└────────────────┬────────────────────────┘
                 │
     ┌───────────┼───────────┐
     ▼           ▼           ▼
  OPay API   In-Memory   Logger
             Storage
```

---

## 🎯 Development Tasks

### Add a New Product

Edit `client/data/products.ts`:

```typescript
export const products: Product[] = [
  // ... existing products
  {
    id: 999,
    name: "New Product",
    price: 15000,
    category: "Electronics",
    image: "/images/product.jpg",
    description: "Product description",
    inStock: true,
  }
];
```

### Add a Promo Code

Edit `client/hooks/usePromoCode.ts`:

```typescript
const VALID_PROMO_CODES: Record<string, PromoCode> = {
  // ... existing codes
  NEWCODE: {
    code: "NEWCODE",
    discountType: "fixed",
    discountAmount: 3000,
  }
};
```

### Modify Payment Flow

Edit `client/pages/Checkout.tsx` or `client/hooks/usePayment.ts`

---

## 🐛 Debugging

### View Server Logs

```bash
# All logs
tail -f logs/*.log

# Payment logs only
grep "payment" logs/server.log

# Errors only
grep "ERROR" logs/server.log
```

### Check Payment Status

```bash
# Get payment status by reference
curl http://localhost:3000/api/payment/status/REF-12345
```

### Network Inspector

Open DevTools → Network tab to see:
- `/api/payment/initialize` - Payment init request
- `/api/orders` - Order creation
- WebSocket connections for real-time updates

---

## 📊 Testing Checklist

- [ ] Add product to cart
- [ ] Remove product from cart
- [ ] Apply promo code
- [ ] Fill checkout form
- [ ] Select shipping method
- [ ] Initiate payment
- [ ] View order confirmation
- [ ] Check order tracking page
- [ ] Verify notifications

---

## 🚨 Common Issues

### Payment Not Initializing
```
Check:
✓ PAYMENT_MODE=demo in .env
✓ Server is running (pnpm dev)
✓ Browser console for errors
```

### 404 on API Calls
```
Check:
✓ Server running on correct port
✓ API route exists in server/routes/
✓ Route registered in server/index.ts
```

### Styles Not Loading
```
Check:
✓ Vite dev server running
✓ Clear browser cache
✓ Check global.css imported
```

---

## 📚 Documentation

- **Full Guide**: See `DEPLOYMENT.md` for comprehensive documentation
- **API Docs**: See `DEPLOYMENT.md` > API Documentation section
- **Architecture**: See `DEPLOYMENT.md` > System Architecture section

---

## 🔐 Security Notes

**Development Mode**
- Demo payment mode enabled
- No real transactions
- Mock OPay API
- In-memory data storage

**For Production**
- Switch `PAYMENT_MODE=production`
- Use real OPay API credentials
- Configure database
- Enable HTTPS
- See `DEPLOYMENT.md` for checklist

---

## 📞 Support

- Check logs: `tail -f logs/server.log`
- API docs: See `DEPLOYMENT.md`
- Code comments: Throughout codebase
- Types: Full TypeScript support

---

**Ready to ship! 🎉**
