/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { verifyPayment } from "@/features/bookings/bookingThunks";
import { loadRazorpayScript } from "@/utils/razorpayLoader";
import { RAZORPAY_KEY_ID } from "@/constants/booking";
import { showError, showSuccess } from "@/utils/toast";
import api from "@/lib/api";

export default function PaymentPage() {
  const location = useLocation();
  const { order, bookingId } = location.state || {};

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const razorpayRef = useRef<any>(null);
  const timeoutRef = useRef<number | null>(null);
  const hasCancelled = useRef(false);
  const mountedRef = useRef(true);

  const [statusMessage, setStatusMessage] = useState("Initializing payment...");

  // Cancel Booking Function
  const cancelBooking = useCallback(
    async (reason = "Payment cancelled") => {
      if (!bookingId) return;

      if (hasCancelled.current) return;

      hasCancelled.current = true;

      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";

      setStatusMessage("Cancelling booking...");

      try {
        await api.patch(`/booking/${bookingId}/mark-failed`);
        showError(reason);
      } catch (err) {
        console.error("Cancel API error:", err);
        showError("Could not update server. Contact support if needed.");
      }

      navigate("/bookings/failed", { replace: true });
    },
    [bookingId, navigate],
  );

  // Payment Initialization
  useEffect(() => {
    if (!order?.id || !bookingId) {
      showError("Invalid payment session");
      navigate(-1);
      return;
    }

    mountedRef.current = true;

    const initializePayment = async () => {
      setStatusMessage("Loading payment gateway...");

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        await cancelBooking("Failed to load payment gateway");
        return;
      }

      if (!mountedRef.current) return;

      setStatusMessage("Opening payment window...");

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount * 100,
        currency: order.currency,
        name: "Event Management",
        description: `Booking #${bookingId.slice(-8)}`,
        order_id: order.id,

        // SUCCESS HANDLER
        handler: async (response: any) => {
          if (!mountedRef.current) return;

          setStatusMessage("Verifying payment...");

          try {
            await dispatch(verifyPayment(response)).unwrap();

            // CLOSE RAZORPAY MODAL
            if (razorpayRef.current) {
              razorpayRef.current.close();
            }

            document.body.style.overflow = "";
            document.body.style.paddingRight = "";

            showSuccess("Payment successful! Booking confirmed.");
            navigate("/bookings/success", { replace: true });
          } catch (err) {
            console.error("Verification failed:", err);
            await cancelBooking("Payment verification failed");
          }
        },

        // MODAL CLOSE
        modal: {
          ondismiss: async () => {
            if (!mountedRef.current || hasCancelled.current) return;

            console.log("Modal dismissed");

            // Clear timeout
            if (timeoutRef.current) {
              window.clearTimeout(timeoutRef.current);
            }

            // Restore scroll
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";

            await cancelBooking("Payment cancelled or failed");
          },
        },

        prefill: {
          name: "User",
          email: "user@example.com",
        },

        theme: { color: "#4f46e5" },

        retry: { enabled: false },
      };

      try {
        razorpayRef.current = new (window as any).Razorpay(options);

        // PAYMENT FAILED EVENT
        razorpayRef.current.on("payment.failed", (response: any) => {
          console.log("Payment failed:", response);
          // cancelBooking("Payment failed on gateway");
        });

        razorpayRef.current.open();

        // AUTO TIMEOUT (15 min)
        timeoutRef.current = window.setTimeout(
          () => {
            if (!hasCancelled.current) {
              cancelBooking("Payment timed out (15 minutes)");
            }
          },
          15 * 60 * 1000,
        );
      } catch (err) {
        console.error("Razorpay init failed:", err);
        await cancelBooking("Failed to open payment window");
      }
    };

    initializePayment();

    return () => {
      mountedRef.current = false;

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      if (razorpayRef.current) {
        try {
          razorpayRef.current.close();
        } catch (error: unknown) {
          console.log("razorpayerror:", error);
        }
      }
    };
  }, [order, bookingId, dispatch, cancelBooking, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-6"></div>

        <h2 className="text-2xl font-bold mb-4">{statusMessage}</h2>

        <p className="text-gray-600 mb-6">
          Please complete the payment in the popup window.
          <br />
          Do not close or refresh this page.
        </p>

        <button
          onClick={async () => {
            if (window.confirm("Are you sure you want to cancel payment?")) {
              await cancelBooking("User cancelled payment");
            }
          }}
          className="text-red-600 hover:text-red-800 font-medium underline mt-4"
        >
          Cancel Payment
        </button>

        <div className="mt-8 text-xs text-gray-500 break-all">
          Booking ID: {bookingId || "missing"}
          <br />
          Order ID: {order?.id || "missing"}
        </div>
      </div>
    </div>
  );
}
