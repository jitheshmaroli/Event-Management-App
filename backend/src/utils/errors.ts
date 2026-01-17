import { HTTP_STATUS } from '@/constants/httpStatusCode';
import { ERROR_CODES, MESSAGES } from '@/constants/messages';

interface FieldValidationError {
  field: string;
  message: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(
    message: string,
    statusCode: number,
    code?: string,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = MESSAGES.HTTP.BAD_REQUEST, code?: string) {
    super(message, HTTP_STATUS.BAD_REQUEST, code);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = MESSAGES.HTTP.UNAUTHORIZED, code?: string) {
    super(message, HTTP_STATUS.UNAUTHORIZED, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = MESSAGES.HTTP.FORBIDDEN, code?: string) {
    super(message, HTTP_STATUS.FORBIDDEN, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = MESSAGES.HTTP.NOT_FOUND, code?: string) {
    super(message, HTTP_STATUS.NOT_FOUND, code);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = MESSAGES.HTTP.CONFLICT, code?: string) {
    super(message, HTTP_STATUS.CONFLICT, code);
  }
}

export class ValidationError extends AppError {
  public readonly errors: FieldValidationError[];

  constructor(
    message = 'Please check your input',
    errors: FieldValidationError[] = []
  ) {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    this.errors = errors;
  }
}
