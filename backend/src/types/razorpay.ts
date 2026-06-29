export interface RazorpayRefundResponse {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  payment_id: string;
  status: 'processed' | 'pending' | 'failed';
  created_at: number;
  notes?: Record<string, string>;
  receipt?: string;
}

export interface PaymentOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
}

export interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
