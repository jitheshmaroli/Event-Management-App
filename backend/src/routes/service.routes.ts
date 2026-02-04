import { Router } from 'express';
import container from '@/inversify/container';
import { TYPES } from '@/inversify/types';
import { ServiceController } from '@/controllers/ServiceController';

const router = Router();
const controller = container.get<ServiceController>(TYPES.ServiceController);

router.get('/', controller.getAllServices.bind(controller));
router.get('/:id', controller.getServiceById.bind(controller));

export default router;
