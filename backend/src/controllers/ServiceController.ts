import { inject, injectable } from 'inversify';
import { Response, NextFunction } from 'express';
import { TYPES } from '@/inversify/types';
import { successResponse } from '@/utils/response';
import { HTTP_STATUS } from '@/constants/httpStatusCode';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { ServiceQueryParams } from '@/dtos/service/service.dto';
import { IServiceService } from '@/interfaces/services/IServiceService';
import { NotFoundError } from '@/utils/errors';
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

      if (typeof data.contactDetails === 'string')
        data.contactDetails = JSON.parse(data.contactDetails);
      if (typeof data.availability === 'string')
        data.availability = JSON.parse(data.availability);

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
      const { id } = req.params;
      const data = req.body;
      const files = req.files as Express.Multer.File[] | undefined;

      if (typeof data.contactDetails === 'string')
        data.contactDetails = JSON.parse(data.contactDetails);
      if (typeof data.availability === 'string')
        data.availability = JSON.parse(data.availability);

      const imageKeys = files?.map((f) => f.key).filter(Boolean) ?? undefined;

      const updated = await this.serviceService.update(id.toString(), {
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

  async getAllServices(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query = req.query as unknown as ServiceQueryParams;
      const result = await this.serviceService.findMany(query);
      return successResponse(res, 'Services fetched', result);
    } catch (err) {
      next(err);
    }
  }

  async getServiceById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const serviceId = req.params.id;
      if (!serviceId) {
        throw new NotFoundError('service id required');
      }
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
      await this.serviceService.delete(
        req.params?.id?.toString(),
        req.user!.userId
      );
      return successResponse(res, 'Service deleted');
    } catch (err) {
      next(err);
    }
  }
}
