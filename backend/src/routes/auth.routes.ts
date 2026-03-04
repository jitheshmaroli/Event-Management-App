import { Router } from 'express';
import container from '@/inversify/container';
import { AuthController } from '@/controllers/AuthController';
import { TYPES } from '@/inversify/types';
import { validateRequest } from '@/middlewares/validateRequest';
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from '@/validations/auth.validation';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post(
  '/register',
  validateRequest(registerSchema, 'body'),
  authController.register.bind(authController)
);
router.post(
  '/send-otp',
  validateRequest(sendOtpSchema, 'body'),
  authController.sendOtp.bind(authController)
);
router.post(
  '/verify-otp',
  validateRequest(verifyOtpSchema, 'body'),
  authController.verifyOTP.bind(authController)
);
router.post(
  '/login',
  validateRequest(loginSchema, 'body'),
  authController.login.bind(authController)
);
router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema, 'body'),
  authController.resetPassword.bind(authController)
);
router.post('/refresh', authController.refresh.bind(authController));
router.post(
  '/logout',
  authenticate,
  authController.logout.bind(authController)
);
router.get(
  '/me',
  authenticate,
  authController.getCurrentUser.bind(authController)
);
export default router;
