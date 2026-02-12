import { Request, Response, NextFunction } from 'express';

export const parseMultipartJson = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      for (const field of fields) {
        if (req.body[field] && typeof req.body[field] === 'string') {
          req.body[field] = JSON.parse(req.body[field]);
        }
      }
      next();
    } catch {
      next(new Error('Invalid JSON format in request body'));
    }
  };
};
