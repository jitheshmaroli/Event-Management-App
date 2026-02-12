import { inject, injectable } from 'inversify';
import { Response, NextFunction, Request } from 'express';
import { TYPES } from '@/inversify/types';
import { successResponse } from '@/utils/response';
import { HTTP_STATUS } from '@/constants/httpStatusCode';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { IServiceService } from '@/interfaces/services/IServiceService';
import { getSignedImageUrls } from '@/utils/s3Utils';

@injectable()
export class ServiceController {
  constructor(
    @inject(TYPES.ServiceService) private serviceService: IServiceService
  ) {}

  async createService(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = req.body;
      const files = req.files as Express.Multer.File[] | undefined;
      const imageKeys = files?.map((file) => file.key!).filter(Boolean) ?? [];

      const service = await this.serviceService.create({
        ...data,
        images: imageKeys || [],
      });

      const signedUrls = await getSignedImageUrls(imageKeys, 7200);

      return successResponse(
        res,
        'Service created successfully',
        { ...service, images: signedUrls },
        HTTP_STATUS.CREATED
      );
    } catch (err) {
      next(err);
    }
  }

  async updateService(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const serviceId = req.params.serviceId as string;
      const data = req.body;
      const files = req.files as Express.Multer.File[] | undefined;
      const imageKeys = files?.map((f) => f.key).filter(Boolean) ?? undefined;

      const updated = await this.serviceService.update(serviceId, {
        ...data,
        images: imageKeys,
      });

      const signedUrls = await getSignedImageUrls(updated.images || [], 7200);

      return successResponse(res, 'Service updated successfully', {
        ...updated,
        images: signedUrls,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllServices(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;
      const result = await this.serviceService.findMany(query);
      return successResponse(res, 'Services fetched', result);
    } catch (err) {
      next(err);
    }
  }

  async getServiceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId } = req.params;

      const service = await this.serviceService.findById(serviceId.toString());
      return successResponse(res, 'Service fetched', service);
    } catch (err) {
      next(err);
    }
  }

  async deleteService(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const serviceId = req.params.serviceId as string;
      const userId = req.user?.userId;
      await this.serviceService.delete(serviceId, userId!);
      return successResponse(res, 'Service deleted');
    } catch (err) {
      next(err);
    }
  }

  async getAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const serviceId = req.params.serviceId as string;
      const { year, month } = req.query as { year: string; month: string };

      const result = await this.serviceService.getAvailability(
        serviceId,
        parseInt(year, 10),
        parseInt(month, 10)
      );

      return successResponse(res, 'Availability fetched', result);
    } catch (err) {
      next(err);
    }
  }
}
