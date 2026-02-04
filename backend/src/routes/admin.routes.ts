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
  updateServiceSchema,
} from '@/validations/service.validation';

const router = Router();
const controller = container.get<ServiceController>(TYPES.ServiceController);

router.use(authenticate, restrictTo(ROLES.ADMIN));

//service
router.post(
  '/service',
  uploadServiceImages,
  validateRequest(createServiceSchema),
  controller.createService.bind(controller)
);
router.put(
  '/service/:id',
  uploadServiceImages,
  validateRequest(updateServiceSchema),
  controller.updateService.bind(controller)
);
router.delete('/service/:id', controller.deleteService.bind(controller));

export default router;
