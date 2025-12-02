import { RequestHandler } from "express";
import {
  PaymentInitRequest,
  PaymentInitResponse,
  PaymentCallbackPayload,
} from "@shared/api";
import { logger } from "../utils/logger";
import {
  ValidationError,
  PaymentInitializationError,
  formatErrorResponse,
} from "../utils/errors";
import { paymentConfig } from "../config/payment";

// Store for demo mode (in production, use database)
const paymentRecords: Map<
  string,
  {
    reference: string;
    amount: number;
    status: string;
    timestamp: string;
    userData: PaymentInitRequest["userInfo"];
  }
> = new Map();

/**
 * Initialize OPay payment
 * In demo mode, returns sandbox URL
 * In production, calls actual OPay API
 */
export const handleInitiatePayment: RequestHandler = async (req, res) => {
  try {
    const { reference, amount, userInfo, callbackUrl, returnUrl } =
      req.body as PaymentInitRequest;

    // Validate required fields
    if (!reference || !amount || !userInfo) {
      logger.warn("Missing required payment fields", {
        hasReference: !!reference,
        hasAmount: !!amount,
        hasUserInfo: !!userInfo,
      });
      return res.status(400).json(
        formatErrorResponse(
          new ValidationError("Missing required fields")
        )
      );
    }

    // Validate amount
    if (amount <= 0) {
      logger.warn("Invalid payment amount", { amount });
      return res.status(400).json(
        formatErrorResponse(
          new ValidationError("Amount must be greater than 0")
        )
      );
    }

    // Store payment record
    paymentRecords.set(reference, {
      reference,
      amount,
      status: "PENDING",
      timestamp: new Date().toISOString(),
      userData: userInfo,
    });

    logger.info("Payment initialization started", {
      reference,
      amount,
      email: userInfo.userEmail,
    });

    if (paymentConfig.mode === "demo") {
      // Demo mode: return mock OPay checkout URL
      const checkoutUrl = `${paymentConfig.demoCashierUrl}?reference=${reference}&amount=${amount}&email=${userInfo.userEmail}`;

      const response: PaymentInitResponse = {
        data: {
          cashierUrl: checkoutUrl,
          checkoutUrl,
          reference,
        },
        status: "success",
        message: "Payment initialization successful (Demo Mode)",
      };

      logger.info("Demo payment URL generated", { reference });
      res.json(response);
    } else {
      // Production mode: call actual OPay API
      try {
        const opayResponse = await fetch(
          `${paymentConfig.opayApiUrl}/api/v1/international/transaction/initialize`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${paymentConfig.opaySecretKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reference,
              amount: Math.round(amount * 100), // Convert to cents
              currency: paymentConfig.currency,
              country: paymentConfig.country,
              callbackUrl,
              returnUrl,
              userInfo,
            }),
          }
        );

        if (!opayResponse.ok) {
          const errorData = await opayResponse.text();
          throw new PaymentInitializationError(
            `OPay API error: ${opayResponse.statusText}`,
            { status: opayResponse.status, body: errorData }
          );
        }

        const data: PaymentInitResponse = await opayResponse.json();
        logger.info("OPay payment URL generated", { reference });
        res.json(data);
      } catch (error) {
        logger.error(
          "OPay API error",
          error instanceof Error ? error : new Error(String(error)),
          { reference }
        );
        res.status(500).json(
          formatErrorResponse(
            new PaymentInitializationError("Failed to initialize payment with OPay")
          )
        );
      }
    }
  } catch (error) {
    logger.error(
      "Payment initialization error",
      error instanceof Error ? error : new Error(String(error))
    );
    res.status(500).json(
      formatErrorResponse(
        new Error("Internal server error")
      )
    );
  }
};

/**
 * Handle OPay payment callback/webhook
 * Called by OPay when payment is completed
 */
export const handlePaymentCallback: RequestHandler = async (req, res) => {
  try {
    const payload = req.body as PaymentCallbackPayload;
    const signature = req.headers[paymentConfig.webhookSignatureHeader] as string;

    logger.info("Payment callback received", {
      reference: payload.reference,
      status: payload.status,
    });

    // Verify signature (in production)
    if (paymentConfig.mode === "production" && signature) {
      const isValid = verifyOPaySignature(req.body, signature);
      if (!isValid) {
        logger.warn("Invalid OPay signature", {
          reference: payload.reference,
        });
        return res.status(401).json(
          formatErrorResponse(
            new Error("Invalid webhook signature")
          )
        );
      }
    }

    const { reference, status, amount } = payload;

    // Validate reference exists
    if (!paymentRecords.has(reference)) {
      logger.warn("Payment record not found for callback", { reference });
    }

    // Update payment record
    const record = paymentRecords.get(reference);
    if (record) {
      record.status = status;
      logger.info("Payment record updated", { reference, status });
    }

    // In production, update database order status here
    // For demo, just acknowledge receipt

    res.json({
      status: "success",
      message: "Webhook received and processed",
      reference,
    });
  } catch (error) {
    logger.error(
      "Payment callback error",
      error instanceof Error ? error : new Error(String(error))
    );
    res.status(500).json(
      formatErrorResponse(new Error("Webhook processing failed"))
    );
  }
};

/**
 * Verify OPay webhook signature
 * Compare signature with HMAC of request body
 */
function verifyOPaySignature(
  body: Record<string, unknown>,
  signature: string
): boolean {
  try {
    const crypto = require("crypto");
    const secretKey = process.env.OPAY_SECRET_KEY || "";

    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(JSON.stringify(body))
      .digest("hex");

    return hash === signature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

/**
 * Get payment status by reference
 * Useful for polling payment status on client
 */
export const handleGetPaymentStatus: RequestHandler = (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference || typeof reference !== "string") {
      logger.warn("Invalid payment status request - missing reference");
      return res.status(400).json(
        formatErrorResponse(new ValidationError("Reference is required"))
      );
    }

    const record = paymentRecords.get(reference);

    if (!record) {
      logger.warn("Payment record not found", { reference });
      return res.status(404).json(
        formatErrorResponse(new Error("Payment record not found"))
      );
    }

    logger.info("Payment status retrieved", { reference, status: record.status });

    res.json({
      status: "success",
      data: {
        reference: record.reference,
        paymentStatus: record.status,
        amount: record.amount,
        timestamp: record.timestamp,
      },
    });
  } catch (error) {
    logger.error(
      "Get payment status error",
      error instanceof Error ? error : new Error(String(error))
    );
    res.status(500).json(
      formatErrorResponse(new Error("Internal server error"))
    );
  }
};
