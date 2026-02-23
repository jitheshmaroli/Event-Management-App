import { injectable, inject } from 'inversify';
import { TYPES } from '@/inversify/types';
import { IPaymentService } from '@/interfaces/services/IPaymentService';
import { RazorpayPaymentService } from './RazorpayPaymentService';

@injectable()
export class PaymentFactory {
  private providers: Map<string, IPaymentService> = new Map();

  constructor(
    @inject(TYPES.RazorpayPaymentService)
    private razorpay: RazorpayPaymentService
  ) {
    this.providers.set('razorpay', razorpay);
  }

  getProvider(provider: string): IPaymentService {
    const service = this.providers.get(provider.toLowerCase());
    if (!service) {
      throw new Error(`Payment provider ${provider} not supported`);
    }
    return service;
  }
}
