import { v2 as cloudinary } from 'cloudinary';
import { StorageEngine } from 'multer';
import { Request } from 'express';
import { env } from '@/config/env.config';
import logger from '@/utils/logger';
import { CloudinaryFile } from '@/types/multer-cloudinary';

type MulterFile = Express.Multer.File;

class CloudinaryStorage implements StorageEngine {
  _handleFile(
    req: Request,
    file: MulterFile,
    callback: (error?: Error | null, info?: Partial<MulterFile>) => void
  ) {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: env.CLOUDINARY_FOLDER,
        resource_type: 'image',
        type: 'authenticated',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          logger.error('Cloudinary upload error:', error);
          return callback(error ?? new Error('Upload failed'));
        }
        const info: Partial<CloudinaryFile> = {
          cloudinaryPublicId: result.public_id,
          cloudinaryUrl: result.secure_url,
        };
        callback(null, info);
      }
    );

    file.stream.pipe(uploadStream);
  }

  _removeFile(
    _req: Request,
    file: MulterFile,
    callback: (error: Error | null) => void
  ) {
    const cloudinaryFile = file as CloudinaryFile;
    if (cloudinaryFile.cloudinaryPublicId) {
      cloudinary.uploader
        .destroy(cloudinaryFile.cloudinaryPublicId, { type: 'authenticated' })
        .then(() => callback(null))
        .catch(callback);
    } else {
      callback(null);
    }
  }
}

export const cloudinaryStorage = new CloudinaryStorage();
