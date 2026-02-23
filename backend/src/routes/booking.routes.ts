import { Router } from 'express';
import container from '@/inversify/container';
import { TYPES } from '@/inversify/types';
import { BookingController } from '@/controllers/BookingController';
import { authenticate } from '@/middlewares/auth.middleware';
import { validateRequest } from '@/middlewares/validateRequest';
import Joi from 'joi';

const router = Router();
const controller = container.get<BookingController>(TYPES.BookingController);

const createBookingSchema = Joi.object({
  serviceId: Joi.string().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
});

router.post(
  '/',
  authenticate,
  validateRequest(createBookingSchema, 'body'),
  controller.createBooking.bind(controller)
);

router.post('/verify-payment', controller.verifyPayment.bind(controller));

router.patch(
  '/:id/cancel',
  authenticate,
  controller.cancelBooking.bind(controller)
);

router.patch(
  '/:id/mark-failed',
  authenticate,
  controller.markBookingAsFailed.bind(controller)
);

router.get(
  '/my-bookings',
  authenticate,
  controller.getMyBookings.bind(controller)
);

export default router;
