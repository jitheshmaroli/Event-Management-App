import { HTTP_STATUS } from '@/constants/httpStatusCode';
import { errorResponse } from '@/utils/response';
import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

type ValidationTarget = 'body' | 'query' | 'params';

export const validateRequest =
  (schema: ObjectSchema, target: ValidationTarget = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return errorResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Validation failed',
        'VALIDATION_ERROR',
        error.details.map((d) => ({
          field: d.path.join('.'),
          message: d.message.replace(/"/g, ''),
        }))
      );
    }
    req[target] = value;
    next();
  };
