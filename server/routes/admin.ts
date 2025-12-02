import { RequestHandler } from 'express';
import {
  AdminLoginRequest,
  AdminLoginResponse,
  PaymentWebhookLog,
  PaymentTransaction,
  RefundRequest,
  CarouselItem,
  DashboardStats,
  AnalyticsData,
} from '@shared/api';
import { authenticateAdmin, verifyToken, generateToken, hasPermission, getAllAdminUsers } from '../utils/auth';
import { logger } from '../utils/logger';

// Middleware to verify admin token
export const verifyAdminToken: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'No authorization token provided',
    });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }

  (req as any).admin = payload;
  next();
};

// ==================== Authentication ====================

/**
 * Admin login
 */
export const handleAdminLogin: RequestHandler = (req, res) => {
  try {
    const { email, password } = req.body as AdminLoginRequest;

    const result = authenticateAdmin(email, password);

    if (!result) {
      logger.warn('Failed admin login attempt', { email });
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      } as AdminLoginResponse);
    }

    logger.info('Admin logged in', { email, role: result.user.role });

    res.json({
      status: 'success',
      message: 'Login successful',
      data: result,
    } as AdminLoginResponse);
  } catch (error) {
    logger.error('Admin login error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      status: 'error',
      message: 'Login failed',
    });
  }
};

/**
 * Get current admin user
 */
export const handleGetCurrentAdmin: RequestHandler = (req, res) => {
  try {
    const admin = (req as any).admin;

    const allAdmins = getAllAdminUsers();
    const currentAdmin = allAdmins.find((a) => a.id === admin.userId);

    if (!currentAdmin) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin not found',
      });
    }

    res.json({
      status: 'success',
      data: currentAdmin,
    });
  } catch (error) {
    logger.error('Get current admin error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch admin info',
    });
  }
};

// ==================== Dashboard Stats ====================

/**
 * Get dashboard statistics
 */
export const handleGetDashboardStats: RequestHandler = (req, res) => {
  try {
    const stats: DashboardStats = {
      totalOrders: 1254,
      totalRevenue: 25680000,
      totalUsers: 3421,
      pendingOrders: 34,
      failedPayments: 8,
      inventoryAlerts: 12,
    };

    logger.info('Dashboard stats retrieved');
    res.json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    logger.error('Dashboard stats error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch stats',
    });
  }
};

// ==================== Payment Management ====================

/**
 * Get payment webhook logs
 */
export const handleGetPaymentWebhooks: RequestHandler = (req, res) => {
  try {
    const { limit = 50, offset = 0, status } = req.query;

    // Mock data - in production, query database
    const webhooks: PaymentWebhookLog[] = [
      {
        id: 'webhook-1',
        reference: 'REF-1704067200000',
        paymentStatus: 'SUCCESS',
        amount: 50000,
        signature_valid: true,
        processed: true,
        processedAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'webhook-2',
        reference: 'REF-1704067200001',
        paymentStatus: 'FAILED',
        amount: 25000,
        signature_valid: true,
        processed: true,
        errorMessage: 'Insufficient funds',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ];

    logger.info('Payment webhooks retrieved', { count: webhooks.length });

    res.json({
      status: 'success',
      data: webhooks,
      total: webhooks.length,
    });
  } catch (error) {
    logger.error('Get webhooks error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch webhooks',
    });
  }
};

/**
 * Get payment transactions
 */
export const handleGetPaymentTransactions: RequestHandler = (req, res) => {
  try {
    const { limit = 50, offset = 0, status } = req.query;

    const transactions: PaymentTransaction[] = [
      {
        id: 'txn-1',
        orderId: 'order-123',
        reference: 'REF-1704067200000',
        transactionId: 'TXN-001',
        amount: 50000,
        status: 'SUCCESS',
        paymentMethod: 'wallet',
        customerEmail: 'customer@email.com',
        retryCount: 0,
        createdAt: new Date().toISOString(),
      },
    ];

    logger.info('Payment transactions retrieved', { count: transactions.length });

    res.json({
      status: 'success',
      data: transactions,
      total: transactions.length,
    });
  } catch (error) {
    logger.error('Get transactions error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch transactions',
    });
  }
};

/**
 * Process refund
 */
export const handleProcessRefund: RequestHandler = (req, res) => {
  try {
    const { paymentId, orderId, amount, reason } = req.body as RefundRequest;
    const admin = (req as any).admin;

    // Check permission
    if (!hasPermission(admin.role, 'orders.refund')) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions to process refund',
      });
    }

    // Process refund logic (in production, call OPay API)
    logger.info('Refund processed', {
      paymentId,
      orderId,
      amount,
      processedBy: admin.userId,
    });

    res.json({
      status: 'success',
      message: 'Refund processed successfully',
      data: {
        id: `refund-${Date.now()}`,
        status: 'processed',
      },
    });
  } catch (error) {
    logger.error('Process refund error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      status: 'error',
      message: 'Failed to process refund',
    });
  }
};

/**
 * Retry failed payment
 */
export const handleRetryPayment: RequestHandler = (req, res) => {
  try {
    const { transactionId } = req.body;
    const admin = (req as any).admin;

    logger.info('Payment retry initiated', { transactionId, by: admin.userId });

    res.json({
      status: 'success',
      message: 'Payment retry initiated',
    });
  } catch (error) {
    logger.error('Retry payment error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      status: 'error',
      message: 'Failed to retry payment',
    });
  }
};

// ==================== Orders Management ====================

/**
 * Get all orders
 */
export const handleAdminGetOrders: RequestHandler = (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    // Mock data - in production, query database
    const orders = [
      {
        id: 'order-1',
        orderNumber: 'ORD-1704067200000',
        customerEmail: 'customer@email.com',
        total: 50000,
        status: 'delivered',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
      },
    ];

    logger.info('Admin orders retrieved', { count: orders.length });

    res.json({
      status: 'success',
      data: orders,
      total: orders.length,
    });
  } catch (error) {
    logger.error('Get orders error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch orders',
    });
  }
};

/**
 * Update order status
 */
export const handleAdminUpdateOrderStatus: RequestHandler = (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;
    const admin = (req as any).admin;

    logger.info('Order status updated', { orderId, newStatus: status, by: admin.userId });

    res.json({
      status: 'success',
      message: 'Order updated successfully',
    });
  } catch (error) {
    logger.error('Update order error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      status: 'error',
      message: 'Failed to update order',
    });
  }
};

// ==================== Products Management ====================

/**
 * Get all products
 */
export const handleAdminGetProducts: RequestHandler = (req, res) => {
  try {
    const { category, inStock, limit = 50 } = req.query;

    // Return in-memory products
    const products = [
      {
        id: 1,
        name: 'Wireless Earbuds',
        price: 15000,
        category: 'Electronics',
        inStock: true,
        sold: 245,
      },
    ];

    logger.info('Admin products retrieved', { count: products.length });

    res.json({
      status: 'success',
      data: products,
      total: products.length,
    });
  } catch (error) {
    logger.error('Get products error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
    });
  }
};

/**
 * Update product
 */
export const handleAdminUpdateProduct: RequestHandler = (req, res) => {
  try {
    const { productId } = req.params;
    const { name, price, category, inStock, featured } = req.body;
    const admin = (req as any).admin;

    logger.info('Product updated', { productId, by: admin.userId });

    res.json({
      status: 'success',
      message: 'Product updated successfully',
    });
  } catch (error) {
    logger.error('Update product error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      status: 'error',
      message: 'Failed to update product',
    });
  }
};

// ==================== Carousel Management ====================

/**
 * Get carousel items
 */
export const handleGetCarousel: RequestHandler = (req, res) => {
  try {
    const items: CarouselItem[] = [
      {
        id: 'carousel-1',
        type: 'product',
        title: 'Featured Product',
        imageUrl: '/images/carousel-1.jpg',
        linkedProductId: 1,
        position: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];

    logger.info('Carousel items retrieved');

    res.json({
      status: 'success',
      data: items,
    });
  } catch (error) {
    logger.error('Get carousel error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch carousel',
    });
  }
};

/**
 * Update carousel
 */
export const handleUpdateCarousel: RequestHandler = (req, res) => {
  try {
    const { items } = req.body as { items: CarouselItem[] };
    const admin = (req as any).admin;

    if (!hasPermission(admin.role, 'carousel.edit')) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions',
      });
    }

    logger.info('Carousel updated', { itemCount: items.length, by: admin.userId });

    res.json({
      status: 'success',
      message: 'Carousel updated successfully',
    });
  } catch (error) {
    logger.error('Update carousel error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      status: 'error',
      message: 'Failed to update carousel',
    });
  }
};

// ==================== Analytics ====================

/**
 * Get analytics data
 */
export const handleGetAnalytics: RequestHandler = (req, res) => {
  try {
    const { metric, period = 'daily' } = req.query;

    const data: AnalyticsData[] = [
      {
        metric: 'sales',
        value: 250000,
        category: 'Electronics',
        period: 'daily',
        date: new Date().toISOString().split('T')[0],
      },
      {
        metric: 'orders',
        value: 45,
        period: 'daily',
        date: new Date().toISOString().split('T')[0],
      },
      {
        metric: 'users',
        value: 156,
        period: 'daily',
        date: new Date().toISOString().split('T')[0],
      },
    ];

    logger.info('Analytics data retrieved', { metric, period });

    res.json({
      status: 'success',
      data,
    });
  } catch (error) {
    logger.error('Get analytics error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch analytics',
    });
  }
};

// ==================== Users Management ====================

/**
 * Get all users
 */
export const handleAdminGetUsers: RequestHandler = (req, res) => {
  try {
    const { role, status, limit = 50 } = req.query;

    const users = getAllAdminUsers();

    logger.info('Admin users retrieved', { count: users.length });

    res.json({
      status: 'success',
      data: users,
      total: users.length,
    });
  } catch (error) {
    logger.error('Get users error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users',
    });
  }
};

/**
 * Update user
 */
export const handleAdminUpdateUser: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    const { role, status, permissions } = req.body;
    const admin = (req as any).admin;

    if (!hasPermission(admin.role, 'users.edit')) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions',
      });
    }

    logger.info('User updated', { userId, newRole: role, by: admin.userId });

    res.json({
      status: 'success',
      message: 'User updated successfully',
    });
  } catch (error) {
    logger.error('Update user error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user',
    });
  }
};
