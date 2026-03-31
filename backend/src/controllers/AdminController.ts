import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '@/inversify/types';
import { IAdminService } from '@/interfaces/services/IAdminService';
import { successResponse } from '@/utils/response';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.AdminService) private _adminService: IAdminService
  ) {}

  async getDashboard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await this._adminService.getDashboardData();
      return successResponse(res, 'Dashboard data fetched', data);
    } catch (err) {
      next(err);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;

      const result = await this._adminService.getUsers(page, limit, search);

      return successResponse(res, 'Users fetched', result);
    } catch (err) {
      next(err);
    }
  }

  async getBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const status = req.query.status as string | undefined;

      const result = await this._adminService.getBookings(page, limit, status);

      return successResponse(res, 'Bookings fetched', result);
    } catch (err) {
      next(err);
    }
  }
}
