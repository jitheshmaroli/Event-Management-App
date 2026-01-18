import { HTTP_STATUS } from '@/constants/httpStatusCode';
import { ERROR_CODES, MESSAGES } from '@/constants/messages';
import { AppError } from '@/utils/errors';
import logger from '@/utils/logger';
import { errorResponse } from '@/utils/response';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return errorResponse(res, err.statusCode, err.message, err.code);
  }

  logger.error('Unhandled Error:', err);

  return errorResponse(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    MESSAGES.HTTP.INTERNAL_SERVER_ERROR,
    ERROR_CODES.INTERNAL_SERVER_ERROR
  );
};
