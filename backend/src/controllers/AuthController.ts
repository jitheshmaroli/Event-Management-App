import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { IAuthService } from '@/interfaces/services/IAuthService';
import { setAuthCookies } from '@/utils/cookie.utils';
import { TYPES } from '@/inversify/types';
import { HTTP_STATUS } from '@/constants/httpStatusCode';
import { ERROR_CODES, MESSAGES } from '@/constants/messages';
import { successResponse } from '@/utils/response';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { UnauthorizedError } from '@/utils/errors';

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private _authService: IAuthService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._authService.register(req.body);
      return successResponse(
        res,
        MESSAGES.USER.CREATED,
        result,
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;

      const result = await this._authService.verifyOTP(email, otp);

      if ('accessToken' in result && 'refreshToken' in result) {
        setAuthCookies(res, result.accessToken, result.refreshToken);

        return successResponse(res, MESSAGES.USER.VERIFIED, result.user);
      }

      return successResponse(res, result.message);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._authService.login(req.body);

      setAuthCookies(res, result.accessToken, result.refreshToken);

      return successResponse(res, MESSAGES.AUTH.LOGIN_SUCCESS, result.user);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) throw new UnauthorizedError();

      const result = await this._authService.logout(userId);

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      return successResponse(res, result.message);
    } catch (error) {
      next(error);
    }
  }

  async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, purpose } = req.body;
      const result = await this._authService.sendOtp(email, purpose);

      return successResponse(res, result.message);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, newPassword } = req.body;
      const result = await this._authService.resetPassword(email, newPassword);
      return successResponse(res, result.message);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      const result = await this._authService.refreshToken(refreshToken);

      setAuthCookies(res, result.accessToken, result.refreshToken);

      return successResponse(res, MESSAGES.AUTH.TOKEN_REFRESH_SUCCESS);
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.userId;
      if (!userId)
        throw new UnauthorizedError(
          MESSAGES.USER.UNAUTHORIZED,
          ERROR_CODES.NO_ACCESS
        );

      const result = await this._authService.getCurrentUser(userId);

      return successResponse(res, MESSAGES.USER.FETCHED, result);
    } catch (error) {
      next(error);
    }
  }
}
