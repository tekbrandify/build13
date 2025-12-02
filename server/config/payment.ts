export interface PaymentConfig {
  mode: "demo" | "production";
  opayApiUrl: string;
  opaySecretKey: string;
  demoCashierUrl: string;
  callbackTimeout: number;
  webhookSignatureHeader: string;
  currency: string;
  country: string;
}

function getPaymentConfig(): PaymentConfig {
  const mode = (process.env.PAYMENT_MODE || "demo") as "demo" | "production";
  const isProduction = mode === "production";

  return {
    mode,
    opayApiUrl: isProduction
      ? process.env.OPAY_API_URL || "https://api.opaycheckout.com"
      : process.env.DEMO_OPAY_API_URL || "https://sandbox.opaycheckout.com",
    opaySecretKey: process.env.OPAY_SECRET_KEY || "",
    demoCashierUrl:
      process.env.DEMO_OPAY_CASHIER_URL ||
      "https://sandbox.opaycheckout.com/demo",
    callbackTimeout: parseInt(process.env.PAYMENT_CALLBACK_TIMEOUT || "30000"),
    webhookSignatureHeader: "opay-signature",
    currency: "NGN",
    country: "NG",
  };
}

export const paymentConfig = getPaymentConfig();

export function validatePaymentConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (paymentConfig.mode === "production") {
    if (!paymentConfig.opaySecretKey) {
      errors.push("OPAY_SECRET_KEY is required in production mode");
    }
    if (!paymentConfig.opayApiUrl) {
      errors.push("OPAY_API_URL is required in production mode");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
