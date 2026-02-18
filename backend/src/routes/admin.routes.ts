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

const router = Router();
const controller = container.get<ServiceController>(TYPES.ServiceController);

router.use(authenticate, restrictTo(ROLES.ADMIN));

//service
router.post(
  '/service',
  uploadServiceImages,
  parseMultipartJson(['availability']),
  validateRequest(createServiceSchema, 'body'),
  controller.createService.bind(controller)
);
router.put(
  '/service/:serviceId',
  uploadServiceImages,
  parseMultipartJson(['availability']),
  validateRequest(serviceIdSchema, 'params'),
  validateRequest(updateServiceSchema, 'body'),
  controller.updateService.bind(controller)
);
router.delete(
  '/service/:serviceId',
  validateRequest(serviceIdSchema, 'params'),
  controller.deleteService.bind(controller)
);

export default router;
