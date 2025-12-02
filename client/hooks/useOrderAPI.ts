import { useCallback, useState } from "react";
import { OrderCreateRequest, OrderCreateResponse } from "@shared/api";

interface OrderAPIState {
  loading: boolean;
  error: string | null;
}

export function useOrderAPI() {
  const [state, setState] = useState<OrderAPIState>({
    loading: false,
    error: null,
  });

  /**
   * Create a new order
   */
  const createOrder = useCallback(
    async (orderData: OrderCreateRequest): Promise<OrderCreateResponse> => {
      setState({ loading: true, error: null });

      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create order");
        }

        const result: OrderCreateResponse = await response.json();

        setState({ loading: false, error: null });
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create order";

        setState({ loading: false, error: errorMessage });
        throw error;
      }
    },
    []
  );

  /**
   * Get order by ID
   */
  const getOrder = useCallback(async (orderId: string) => {
    setState({ loading: true, error: null });

    try {
      const response = await fetch(`/api/orders/${orderId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }

      const result = await response.json();

      setState({ loading: false, error: null });
      return result.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch order";

      setState({ loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  /**
   * Get all orders
   */
  const getOrders = useCallback(async () => {
    setState({ loading: true, error: null });

    try {
      const response = await fetch("/api/orders");

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const result = await response.json();

      setState({ loading: false, error: null });
      return result.data || [];
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch orders";

      setState({ loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  /**
   * Cancel an order
   */
  const cancelOrder = useCallback(async (orderId: string) => {
    setState({ loading: true, error: null });

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to cancel order");
      }

      const result = await response.json();

      setState({ loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to cancel order";

      setState({ loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return {
    ...state,
    createOrder,
    getOrder,
    getOrders,
    cancelOrder,
  };
}
