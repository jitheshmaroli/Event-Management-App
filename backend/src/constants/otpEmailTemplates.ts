import { OtpPurpose } from '@/constants/otpPurpose';

export const otpEmailTemplates = {
  [OtpPurpose.SIGNUP]: {
    subject: 'Verify your email address',
    title: 'Verify your account',
    message: 'Use this OTP to complete your registration.',
  },

  [OtpPurpose.FORGOT_PASSWORD]: {
    subject: 'Reset your password',
    title: 'Password reset request',
    message: 'Use this OTP to reset your password.',
  },
};
