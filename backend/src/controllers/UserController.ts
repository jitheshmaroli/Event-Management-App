import { inject, injectable } from 'inversify';
import { Response, NextFunction } from 'express';
import { TYPES } from '@/inversify/types';
import { IUserService } from '@/interfaces/services/IUserService';
import { successResponse } from '@/utils/response';
import { HTTP_STATUS } from '@/constants/httpStatusCode';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { UpdateProfileInput } from '@/dtos/user/user.dto';

@injectable()
export class UserController {
  constructor(@inject(TYPES.UserService) private _userService: IUserService) {}

  async updateProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.userId;
      const data = req.body as UpdateProfileInput;

      const updated = await this._userService.updateProfile(userId, data);

      return successResponse(
        res,
        'Profile updated successfully',
        updated,
        HTTP_STATUS.OK
      );
    } catch (err) {
      next(err);
    }
  }
}
