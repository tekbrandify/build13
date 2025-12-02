import { useState, useCallback } from "react";
import { PaymentInitRequest, PaymentInitResponse } from "@shared/api";

interface PaymentState {
  loading: boolean;
  error: string | null;
  status: "idle" | "initializing" | "success" | "error";
  reference: string | null;
}

export function usePayment() {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    loading: false,
    error: null,
    status: "idle",
    reference: null,
  });

  /**
   * Initiate OPay payment
   */
  const initiatePayment = useCallback(
    async (orderData: {
      reference: string;
      amount: number;
      userEmail: string;
      userName: string;
      callbackUrl: string;
      returnUrl: string;
    }) => {
      setPaymentState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        status: "initializing",
      }));

      try {
        const request: PaymentInitRequest = {
          reference: orderData.reference,
          amount: orderData.amount,
          currency: "NGN",
          country: "NG",
          callbackUrl: orderData.callbackUrl,
          returnUrl: orderData.returnUrl,
          userInfo: {
            userEmail: orderData.userEmail,
            userName: orderData.userName,
          },
        };

        const response = await fetch("/api/payment/initialize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          throw new Error("Failed to initialize payment");
        }

        const data: PaymentInitResponse = await response.json();

        setPaymentState({
          loading: false,
          error: null,
          status: "success",
          reference: orderData.reference,
        });

        return data.data.cashierUrl || data.data.checkoutUrl;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Payment initialization failed";

        setPaymentState({
          loading: false,
          error: errorMessage,
          status: "error",
          reference: null,
        });

        throw error;
      }
    },
    []
  );

  /**
   * Get payment status
   */
  const getPaymentStatus = useCallback(async (reference: string) => {
    try {
      const response = await fetch(`/api/payment/status/${reference}`);

      if (!response.ok) {
        throw new Error("Failed to get payment status");
      }

      return await response.json();
    } catch (error) {
      console.error("Get payment status error:", error);
      throw error;
    }
  }, []);

  /**
   * Reset payment state
   */
  const resetPayment = useCallback(() => {
    setPaymentState({
      loading: false,
      error: null,
      status: "idle",
      reference: null,
    });
  }, []);

  return {
    ...paymentState,
    initiatePayment,
    getPaymentStatus,
    resetPayment,
  };
}
