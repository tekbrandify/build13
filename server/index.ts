import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleInitiatePayment,
  handlePaymentCallback,
  handleGetPaymentStatus,
} from "./routes/payment";
import {
  handleCreateOrder,
  handleGetOrder,
  handleGetOrders,
  handleUpdateOrderStatus,
  handleCancelOrder,
} from "./routes/orders";
import {
  handleAdminLogin,
  handleGetCurrentAdmin,
  handleGetDashboardStats,
  handleGetPaymentWebhooks,
  handleGetPaymentTransactions,
  handleProcessRefund,
  handleRetryPayment,
  handleAdminGetOrders,
  handleAdminUpdateOrderStatus,
  handleAdminGetProducts,
  handleAdminUpdateProduct,
  handleGetCarousel,
  handleUpdateCarousel,
  handleGetAnalytics,
  handleAdminGetUsers,
  handleAdminUpdateUser,
  verifyAdminToken,
} from "./routes/admin";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Payment routes
  app.post("/api/payment/initialize", handleInitiatePayment);
  app.post("/api/payment/callback", handlePaymentCallback);
  app.get("/api/payment/status/:reference", handleGetPaymentStatus);

  // Order routes
  app.post("/api/orders", handleCreateOrder);
  app.get("/api/orders", handleGetOrders);
  app.get("/api/orders/:orderId", handleGetOrder);
  app.patch("/api/orders/:orderId/status", handleUpdateOrderStatus);
  app.delete("/api/orders/:orderId", handleCancelOrder);

  // Admin routes
  app.post("/api/admin/login", handleAdminLogin);
  app.get("/api/admin/me", verifyAdminToken, handleGetCurrentAdmin);
  app.get("/api/admin/dashboard/stats", verifyAdminToken, handleGetDashboardStats);

  // Payment management
  app.get("/api/admin/payments/webhooks", verifyAdminToken, handleGetPaymentWebhooks);
  app.get("/api/admin/payments/transactions", verifyAdminToken, handleGetPaymentTransactions);
  app.post("/api/admin/payments/refund", verifyAdminToken, handleProcessRefund);
  app.post("/api/admin/payments/retry", verifyAdminToken, handleRetryPayment);

  // Orders management
  app.get("/api/admin/orders", verifyAdminToken, handleAdminGetOrders);
  app.patch("/api/admin/orders/:orderId/status", verifyAdminToken, handleAdminUpdateOrderStatus);

  // Products management
  app.get("/api/admin/products", verifyAdminToken, handleAdminGetProducts);
  app.patch("/api/admin/products/:productId", verifyAdminToken, handleAdminUpdateProduct);

  // Carousel management
  app.get("/api/admin/carousel", verifyAdminToken, handleGetCarousel);
  app.put("/api/admin/carousel", verifyAdminToken, handleUpdateCarousel);

  // Analytics
  app.get("/api/admin/analytics", verifyAdminToken, handleGetAnalytics);

  // Users management
  app.get("/api/admin/users", verifyAdminToken, handleAdminGetUsers);
  app.patch("/api/admin/users/:userId", verifyAdminToken, handleAdminUpdateUser);

  return app;
}
