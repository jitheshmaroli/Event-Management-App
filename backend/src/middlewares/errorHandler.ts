import { HTTP_STATUS } from '@/constants/httpStatusCode';
import { MESSAGES } from '@/constants/messages';
import { AppError } from '@/utils/errors';
import logger from '@/utils/logger';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        code: err.code ?? 'APPLICATION_ERROR',
      },
    });
  }

  logger.error('Unhandled Error:', err);

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: MESSAGES.HTTP.INTERNAL_SERVER_ERROR,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
};
