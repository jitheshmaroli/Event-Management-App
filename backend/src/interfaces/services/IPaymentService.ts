/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface IPaymentService {
  createOrder(amount: number, receipt: string): Promise<PaymentOrderResponse>;
  verifyPayment(data: PaymentVerificationData): Promise<boolean>;
  refundPayment(paymentId: string, amount?: number): Promise<any>;
}
