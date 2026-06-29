import {
  PaymentOrderResponse,
  PaymentVerificationData,
  RazorpayRefundResponse,
} from '@/types/razorpay';

export interface IPaymentService {
  createOrder(amount: number, receipt: string): Promise<PaymentOrderResponse>;
  verifyPayment(data: PaymentVerificationData): Promise<boolean>;
  refundPayment(
    paymentId: string,
    amount?: number
  ): Promise<RazorpayRefundResponse>;
}
