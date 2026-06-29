import Razorpay from 'razorpay';
import crypto from 'crypto';
import { injectable } from 'inversify';
import { IPaymentService } from '@/interfaces/services/IPaymentService';
import { BadRequestError } from '@/utils/errors';
import {
  PaymentOrderResponse,
  PaymentVerificationData,
  RazorpayRefundResponse,
} from '@/types/razorpay';

@injectable()
export class RazorpayPaymentService implements IPaymentService {
  private _razorpay: Razorpay;

  constructor() {
    this._razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createOrder(
    amount: number,
    receipt: string
  ): Promise<PaymentOrderResponse> {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt,
    };

    const order = await this._razorpay.orders.create(options);
    return {
      id: order.id,
      amount: Number(order.amount) / 100,
      currency: order.currency,
      receipt: order.receipt,
    };
  }

  async verifyPayment(data: PaymentVerificationData): Promise<boolean> {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    return generatedSignature === razorpay_signature;
  }

  async refundPayment(
    paymentId: string,
    amount?: number
  ): Promise<RazorpayRefundResponse> {
    try {
      const refund = await this._razorpay.payments.refund(paymentId, {
        amount: amount ? amount * 100 : undefined,
      });
      return refund as RazorpayRefundResponse;
    } catch (err: unknown) {
      const error = err as Error & { description?: string };
      throw new BadRequestError(
        `Refund failed: ${error.description || error.message}`
      );
    }
  }
}
