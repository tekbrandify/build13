import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Check, AlertCircle, Loader } from "lucide-react";
import { useOrderAPI } from "@/hooks/useOrderAPI";
import { toast } from "sonner";

export default function PaymentReturn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getOrder, loading } = useOrderAPI();
  const [paymentStatus, setPaymentStatus] = useState<"loading" | "success" | "error">("loading");
  const [order, setOrder] = useState<any | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const handlePaymentReturn = async () => {
      try {
        // Get order ID from URL or search params
        const orderId = searchParams.get("orderId");
        const reference = searchParams.get("reference");
        const status = searchParams.get("status");

        if (!orderId && !reference) {
          setPaymentStatus("error");
          setStatusMessage("No order information found");
          return;
        }

        // Try to fetch order details
        if (orderId) {
          const orderData = await getOrder(orderId);
          setOrder(orderData);

          if (status === "success" || orderData.status === "processing") {
            setPaymentStatus("success");
            setStatusMessage("Payment confirmed! Your order is being processed.");
            toast.success("Payment successful!");

            // Redirect to order tracking after 3 seconds
            setTimeout(() => {
              navigate(`/order/${orderId}`);
            }, 3000);
          } else {
            setPaymentStatus("error");
            setStatusMessage("Payment verification pending. Please check your email for confirmation.");
          }
        } else {
          setPaymentStatus("success");
          setStatusMessage("Your payment has been received. Check your email for order confirmation.");
          
          setTimeout(() => {
            navigate("/orders");
          }, 3000);
        }
      } catch (error) {
        console.error("Payment return error:", error);
        setPaymentStatus("error");
        setStatusMessage("Failed to verify payment status. Please check your email or contact support.");
        toast.error("Failed to verify payment");
      }
    };

    handlePaymentReturn();
  }, [searchParams, navigate, getOrder]);

  return (
    <Layout>
      <div className="bg-white min-h-screen flex items-center justify-center py-12">
        <div className="mx-auto max-w-md w-full px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {paymentStatus === "loading" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Loader className="h-12 w-12 text-primary animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Processing Payment
              </h1>
              <p className="text-muted-foreground mb-6">
                Please wait while we verify your payment...
              </p>
            </div>
          )}

          {/* Success State */}
          {paymentStatus === "success" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Payment Successful!
              </h1>
              <p className="text-muted-foreground mb-6">
                {statusMessage}
              </p>
              {order && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-muted-foreground mb-2">
                    Order Number
                  </p>
                  <p className="font-semibold text-foreground mb-4">
                    {order.orderNumber}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Total Amount
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    ₦{order.total?.toLocaleString()}
                  </p>
                </div>
              )}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Redirecting to order tracking in a few seconds...
                </p>
                <button
                  onClick={() =>
                    order ? navigate(`/order/${order.id}`) : navigate("/orders")
                  }
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  View Order
                </button>
              </div>
            </div>
          )}

          {/* Error State */}
          {paymentStatus === "error" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Payment Verification Failed
              </h1>
              <p className="text-muted-foreground mb-6">
                {statusMessage}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  Return to Checkout
                </button>
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  View Orders
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
