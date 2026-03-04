import { ContainerModule } from 'inversify';
import { TYPES } from '../types';
import { ServiceRepository } from '@/repositories/ServiceRepository';
import { ServiceService } from '@/services/ServiceService';
import { ServiceController } from '@/controllers/ServiceController';
import { IServiceRepository } from '@/interfaces/repositories/IServiceRepository';
import { IServiceService } from '@/interfaces/services/IServiceService';
import { IBookingRepository } from '@/interfaces/repositories/IBookingRepository';
import { IBookingService } from '@/interfaces/services/IBookingService';
import { BookingController } from '@/controllers/BookingController';
import { BookingRepository } from '@/repositories/BookingRepository';
import { BookingService } from '@/services/BookingService';
import { IPaymentService } from '@/interfaces/services/IPaymentService';
import { RazorpayPaymentService } from '@/services/payment/RazorpayPaymentService';
import { PaymentFactory } from '@/services/payment/PaymentFactory';

export const serviceModule = new ContainerModule(({ bind }) => {
  bind<IServiceRepository>(TYPES.ServiceRepository)
    .to(ServiceRepository)
    .inSingletonScope();
  bind<IServiceService>(TYPES.ServiceService)
    .to(ServiceService)
    .inSingletonScope();
  bind<ServiceController>(TYPES.ServiceController)
    .to(ServiceController)
    .inSingletonScope();

  bind<IBookingRepository>(TYPES.BookingRepository)
    .to(BookingRepository)
    .inSingletonScope();
  bind<IBookingService>(TYPES.BookingService)
    .to(BookingService)
    .inSingletonScope();
  bind<BookingController>(TYPES.BookingController)
    .to(BookingController)
    .inSingletonScope();
  bind<IPaymentService>(TYPES.RazorpayPaymentService)
    .to(RazorpayPaymentService)
    .inSingletonScope();
  bind<PaymentFactory>(TYPES.PaymentFactory)
    .to(PaymentFactory)
    .inSingletonScope();
});
