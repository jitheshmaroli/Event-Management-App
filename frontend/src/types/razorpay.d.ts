export {};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

// Main Options passed to new Razorpay()
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  retry?: {
    enabled: boolean;
  };
  notes?: Record<string, string>;
}

// Instance returned by new Razorpay()
export interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (
    event: "payment.failed",
    callback: (response: RazorpayFailedResponse) => void,
  ) => void;
}

// Response when payment succeeds
export interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Response when payment fails
export interface RazorpayFailedResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
  };
}
