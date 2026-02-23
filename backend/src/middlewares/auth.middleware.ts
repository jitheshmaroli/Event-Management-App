import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/jwt';
import { UnauthorizedError, ForbiddenError } from '@/utils/errors';
import { Role } from '@/constants/roles';
import { ERROR_CODES, MESSAGES } from '@/constants/messages';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: Role;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;

  console.log('accesstoken:', req.cookies);
  if (!token) {
    return next(
      new UnauthorizedError(
        MESSAGES.AUTH.NO_ACCESS_TOKEN,
        ERROR_CODES.INVALID_TOKEN
      )
    );
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    return next(
      new UnauthorizedError(
        MESSAGES.AUTH.NO_ACCESS_TOKEN,
        ERROR_CODES.INVALID_TOKEN
      )
    );
  }
};

export const restrictTo = (...allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(MESSAGES.USER.UNAUTHORIZED, ERROR_CODES.NO_ACCESS)
      );
    }
    next();
  };
};
