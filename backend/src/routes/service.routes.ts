import { Router } from 'express';
import container from '@/inversify/container';
import { TYPES } from '@/inversify/types';
import { ServiceController } from '@/controllers/ServiceController';
import { validateRequest } from '@/middlewares/validateRequest';
import {
  availabilityParamsSchema,
  availabilityQuerySchema,
  serviceIdSchema,
  serviceQuerySchema,
} from '@/validations/service.validation';

const router = Router();
const controller = container.get<ServiceController>(TYPES.ServiceController);

router.get(
  '/',
  validateRequest(serviceQuerySchema, 'query'),
  controller.getAllServices.bind(controller)
);
router.get(
  '/:serviceId',
  validateRequest(serviceIdSchema, 'params'),
  controller.getServiceById.bind(controller)
);
router.get(
  '/:serviceId/availability',
  validateRequest(availabilityParamsSchema, 'params'),
  validateRequest(availabilityQuerySchema, 'query'),
  controller.getAvailability.bind(controller)
);

export default router;
