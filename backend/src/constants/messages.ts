export const MESSAGES = {
  USER: {
    CREATED: 'User registered successfully. Please verify your email.',
    VERIFIED: 'Email verified successfully',
    ALREADY_EXISTS: 'User with this email already exists',
    NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_ALREADY_VERIFIED: 'Email is already verified',
    EMAIL_NOT_VERIFIED: 'Please verify your email first',
    PASSWORD_RESET_SUCCESS: 'Password reset successful',
    UNAUTHORIZED: 'You do not have permission to perform this action',
  },
  OTP: {
    INVALID: 'Invalid OTP. Please check and try again.',
    EXPIRED: 'OTP has expired. Please request a new one.',
    SENT: 'OTP sent to your email',
  },
  AUTH: {
    LOGIN_SUCCESS: 'Logged in successfully',
    LOGOUT_SUCCESS: 'Logged out successfully',
    TOKEN_REFRESH_SUCCESS: 'Token refreshed successfully',
    TOKEN_EXPIRED: 'Invalid or expired token, Please login again',
    OTP_SENT_IF_EMAIL_EXISTS: 'If email exists, OTP will be sent',
    NO_ACCESS_TOKEN: 'No access token provided',
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
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  EMAIL_ALREADY_VERIFIED: 'EMAIL_ALREADY_VERIFIED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_TOKEN: 'INVALID_TOKEN',
  NO_ACCESS: 'NO_ACCESS',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;
