import { Router } from 'express';
import container from '@/inversify/container';
import { AuthController } from '@/controllers/AuthController';
import { TYPES } from '@/inversify/types';
import { validateRequest } from '@/middlewares/validateRequest';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from '@/validations/auth.validation';

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post(
  '/register',
  validateRequest(registerSchema, 'body'),
  authController.register.bind(authController)
);
router.post(
  '/resend-otp',
  validateRequest(resendOtpSchema, 'body'),
  authController.resendOtp.bind(authController)
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
  '/forgot-password',
  validateRequest(forgotPasswordSchema, 'body'),
  authController.forgotPassword.bind(authController)
);
router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema, 'body'),
  authController.resetPassword.bind(authController)
);

export default router;
