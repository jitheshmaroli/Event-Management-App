import { Router } from 'express';
import container from '@/inversify/container';
import { TYPES } from '@/inversify/types';
import { ServiceController } from '@/controllers/ServiceController';
import { authenticate, restrictTo } from '@/middlewares/auth.middleware';
import { validateRequest } from '@/middlewares/validateRequest';
import { ROLES } from '@/constants/roles';
import { uploadServiceImages } from '@/middlewares/multers3';
import {
  createServiceSchema,
  serviceIdSchema,
  updateServiceSchema,
} from '@/validations/service.validation';
import { parseMultipartJson } from '@/middlewares/parseMultipartJson';
import { AdminController } from '@/controllers/AdminController';

const router = Router();
const serviceController = container.get<ServiceController>(
  TYPES.ServiceController
);
const adminController = container.get<AdminController>(TYPES.AdminController);

router.use(authenticate, restrictTo(ROLES.ADMIN));

//service
router.post(
  '/service',
  uploadServiceImages,
  parseMultipartJson(['availability']),
  validateRequest(createServiceSchema, 'body'),
  serviceController.createService.bind(serviceController)
);
router.put(
  '/service/:serviceId',
  uploadServiceImages,
  parseMultipartJson(['availability']),
  validateRequest(serviceIdSchema, 'params'),
  validateRequest(updateServiceSchema, 'body'),
  serviceController.updateService.bind(serviceController)
);
router.delete(
  '/service/:serviceId',
  validateRequest(serviceIdSchema, 'params'),
  serviceController.deleteService.bind(serviceController)
);

//dashboard
router.get('/dashboard', adminController.getDashboard.bind(adminController));
router.get('/users', adminController.getUsers.bind(adminController));
router.get('/bookings', adminController.getBookings.bind(adminController));

export default router;
