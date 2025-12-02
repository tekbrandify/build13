import { RequestHandler } from "express";
import { OrderCreateRequest, OrderCreateResponse } from "@shared/api";
import { logger } from "../utils/logger";
import {
  ValidationError,
  NotFoundError,
  formatErrorResponse,
} from "../utils/errors";

interface StoredOrder {
  id: string;
  orderNumber: string;
  referenceId: string;
  trackingNumber: string;
  items: OrderCreateRequest["items"];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  estimatedDelivery: string;
  shippingAddress: OrderCreateRequest["shippingAddress"];
  shippingMethod: OrderCreateRequest["shippingMethod"];
  discount?: OrderCreateRequest["discount"];
  statusHistory: Array<{
    status: string;
    timestamp: string;
    message: string;
  }>;
}

// In-memory storage (in production, use database)
const orders = new Map<string, StoredOrder>();

/**
 * Create a new order
 */
export const handleCreateOrder: RequestHandler = (req, res) => {
  try {
    const orderData = req.body as OrderCreateRequest;

    // Validate required fields
    if (!orderData.items || !orderData.shippingAddress) {
      logger.warn("Order creation failed - missing required fields");
      return res.status(400).json(
        formatErrorResponse(new ValidationError("Items and shipping address are required"))
      );
    }

    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      logger.warn("Order creation failed - no items in order");
      return res.status(400).json(
        formatErrorResponse(new ValidationError("Order must contain at least one item"))
      );
    }

    // Generate order identifiers
    const id = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderNumber = `ORD-${Date.now()}`;
    const referenceId = `REF-${Date.now()}`;
    const trackingNumber = `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order: StoredOrder = {
      id,
      orderNumber,
      referenceId,
      trackingNumber,
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      tax: orderData.tax,
      total: orderData.total,
      status: "pending",
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      shippingAddress: orderData.shippingAddress,
      shippingMethod: orderData.shippingMethod,
      ...(orderData.discount && { discount: orderData.discount }),
      statusHistory: [
        {
          status: "pending",
          timestamp: new Date().toISOString(),
          message: "Order created and awaiting payment",
        },
      ],
    };

    // Store order
    orders.set(id, order);

    logger.info("Order created successfully", {
      orderId: id,
      orderNumber,
      itemCount: orderData.items.length,
      total: orderData.total,
      email: orderData.shippingAddress.email,
    });

    const response: OrderCreateResponse = {
      id: order.id,
      orderNumber: order.orderNumber,
      referenceId: order.referenceId,
      trackingNumber: order.trackingNumber,
      status: "success",
      message: "Order created successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    logger.error(
      "Order creation error",
      error instanceof Error ? error : new Error(String(error))
    );
    res.status(500).json(
      formatErrorResponse(new Error("Failed to create order"))
    );
  }
};

/**
 * Get order details by ID
 */
export const handleGetOrder: RequestHandler = (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      logger.warn("Get order failed - missing order ID");
      return res.status(400).json(
        formatErrorResponse(new ValidationError("Order ID is required"))
      );
    }

    const order = orders.get(orderId);

    if (!order) {
      logger.warn("Order not found", { orderId });
      return res.status(404).json(
        formatErrorResponse(new NotFoundError("Order not found"))
      );
    }

    logger.info("Order retrieved", { orderId, orderNumber: order.orderNumber });

    res.json({
      status: "success",
      data: order,
    });
  } catch (error) {
    logger.error(
      "Get order error",
      error instanceof Error ? error : new Error(String(error))
    );
    res.status(500).json(
      formatErrorResponse(new Error("Failed to retrieve order"))
    );
  }
};

/**
 * Get all orders
 * In production, should be filtered by user ID
 */
export const handleGetOrders: RequestHandler = (req, res) => {
  try {
    const allOrders = Array.from(orders.values());

    logger.info("Orders retrieved", { count: allOrders.length });

    res.json({
      status: "success",
      data: allOrders,
      count: allOrders.length,
    });
  } catch (error) {
    logger.error(
      "Get orders error",
      error instanceof Error ? error : new Error(String(error))
    );
    res.status(500).json(
      formatErrorResponse(new Error("Failed to retrieve orders"))
    );
  }
};

/**
 * Update order status
 * Called from payment callback or admin
 */
export const handleUpdateOrderStatus: RequestHandler = (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, message } = req.body;

    const order = orders.get(orderId);

    if (!order) {
      logger.warn("Order not found for status update", { orderId });
      return res.status(404).json(
        formatErrorResponse(new NotFoundError("Order not found"))
      );
    }

    // Update status
    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      message: message || `Order status updated to ${status}`,
    });

    logger.info("Order status updated", {
      orderId,
      orderNumber: order.orderNumber,
      newStatus: status,
    });

    res.json({
      status: "success",
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    logger.error(
      "Update order status error",
      error instanceof Error ? error : new Error(String(error))
    );
    res.status(500).json(
      formatErrorResponse(new Error("Failed to update order status"))
    );
  }
};

/**
 * Cancel order
 */
export const handleCancelOrder: RequestHandler = (req, res) => {
  try {
    const { orderId } = req.params;

    const order = orders.get(orderId);

    if (!order) {
      logger.warn("Order not found for cancellation", { orderId });
      return res.status(404).json(
        formatErrorResponse(new NotFoundError("Order not found"))
      );
    }

    if (order.status !== "pending" && order.status !== "processing") {
      logger.warn("Cannot cancel order with current status", {
        orderId,
        currentStatus: order.status,
      });
      return res.status(400).json(
        formatErrorResponse(
          new ValidationError(`Cannot cancel order with status: ${order.status}`)
        )
      );
    }

    order.status = "cancelled";
    order.statusHistory.push({
      status: "cancelled",
      timestamp: new Date().toISOString(),
      message: "Order cancelled by user",
    });

    logger.info("Order cancelled", {
      orderId,
      orderNumber: order.orderNumber,
    });

    res.json({
      status: "success",
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    logger.error(
      "Cancel order error",
      error instanceof Error ? error : new Error(String(error))
    );
    res.status(500).json(
      formatErrorResponse(new Error("Failed to cancel order"))
    );
  }
};
