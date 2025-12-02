/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export interface DemoResponse {
  message: string;
}

// Payment Integration Types
export interface PaymentInitRequest {
  reference: string;
  amount: number;
  currency: string;
  country: string;
  callbackUrl: string;
  returnUrl: string;
  userInfo: {
    userEmail: string;
    userName: string;
  };
}

export interface PaymentInitResponse {
  data: {
    cashierUrl: string;
    reference: string;
    checkoutUrl: string;
  };
  status: string;
  message: string;
}

export interface PaymentCallbackPayload {
  reference: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  amount: number;
  timestamp: string;
  transactionId?: string;
  message: string;
}

export interface OrderCreateRequest {
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    category: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  shippingMethod: 'standard' | 'express' | 'overnight';
  discount?: {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountAmount: number;
  };
}

export interface OrderCreateResponse {
  id: string;
  orderNumber: string;
  referenceId: string;
  trackingNumber: string;
  status: string;
  message: string;
}

// Admin Types
export type AdminRole = 'super_admin' | 'product_manager' | 'order_manager' | 'marketing' | 'support';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  permissions: string[];
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  status: string;
  message: string;
  data?: {
    user: AdminUser;
    token: string;
  };
}

export interface PaymentWebhookLog {
  id: string;
  reference: string;
  paymentStatus: string;
  amount: number;
  signature_valid: boolean;
  processed: boolean;
  processedAt?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  orderId?: string;
  reference: string;
  transactionId?: string;
  amount: number;
  status: string;
  paymentMethod: string;
  customerEmail: string;
  retryCount: number;
  createdAt: string;
}

export interface RefundRequest {
  paymentId: string;
  orderId: string;
  amount: number;
  reason: string;
}

export interface RefundResponse {
  id: string;
  status: string;
  message: string;
}

export interface CarouselItem {
  id: string;
  type: 'product' | 'banner' | 'category';
  title: string;
  imageUrl: string;
  linkUrl?: string;
  linkedProductId?: number;
  position: number;
  isActive: boolean;
  createdAt: string;
}

export interface AnalyticsData {
  metric: string;
  value: number;
  category?: string;
  period: 'daily' | 'weekly' | 'monthly';
  date: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  pendingOrders: number;
  failedPayments: number;
  inventoryAlerts: number;
}
