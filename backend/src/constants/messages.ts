export const MESSAGES = {
  USER: {
    CREATED: 'User registered successfully. Please verify your email.',
    VERIFIED: 'Email verified successfully',
    ALREADY_EXISTS: 'User with this email already exists',
    NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_ALREADY_VERIFIED: 'Email is already verified',
    EMAIL_NOT_VERIFIED: 'Please verify your email first',
    PASSWOR_RESET_SUCCESS: 'Password reset successful',
  },
  OTP: {
    INVALID: 'Invalid OTP. Please check and try again.',
    EXPIRED: 'OTP has expired. Please request a new one.',
    SENT: 'OTP sent to your email',
  },
  AUTH: {
    LOGIN_SUCCESS: 'Logged in successfully',
    LOGOUT_SUCCESS: 'Logged out successfully',
    TOKEN_EXPIRED: 'Token has expired',
    OTP_SENT_IF_EMAIL_EXISTS: 'If email exists, OTP will be sent',
  },
  HTTP: {
    BAD_REQUEST: 'Invalid request data',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Resource not found',
    CONFLICT: 'Resource conflict occurred',
    INTERNAL_SERVER_ERROR: 'Something went wrong on the server',
  },
} as const;

export const ERROR_CODES = {
  OTP_INVALID: 'OTP_INVALID',
  OTP_EXPIRED: 'OTP_EXPIRED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_ALREADY_VERIFIED: 'EMAIL_ALREADY_VERIFIED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;
