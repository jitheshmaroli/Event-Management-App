import { Router } from 'express';
import container from '@/inversify/container';
import { TYPES } from '@/inversify/types';
import { BookingController } from '@/controllers/BookingController';
import { authenticate, restrictTo } from '@/middlewares/auth.middleware';
import { validateRequest } from '@/middlewares/validateRequest';
import Joi from 'joi';
import { ROLES } from '@/constants/roles';

const router = Router();
const controller = container.get<BookingController>(TYPES.BookingController);

const createBookingSchema = Joi.object({
  serviceId: Joi.string().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
});

router.use(authenticate, restrictTo(ROLES.USER));

router.post(
  '/',
  validateRequest(createBookingSchema, 'body'),
  controller.createBooking.bind(controller)
);

router.post('/verify-payment', controller.verifyPayment.bind(controller));

router.patch('/:id/cancel', controller.cancelBooking.bind(controller));

router.patch(
  '/:id/mark-failed',
  controller.markBookingAsFailed.bind(controller)
);

router.get('/my-bookings', controller.getMyBookings.bind(controller));

export default router;
