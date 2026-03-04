import { Router } from 'express';
import container from '@/inversify/container';
import { TYPES } from '@/inversify/types';
import { UserController } from '@/controllers/UserController';
import { authenticate, restrictTo } from '@/middlewares/auth.middleware';
import { ROLES } from '@/constants/roles';

const router = Router();
const controller = container.get<UserController>(TYPES.UserController);

router.use(authenticate, restrictTo(ROLES.USER));

router.put('/profile', controller.updateProfile.bind(controller));

export default router;
