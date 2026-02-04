import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3Client } from '@/utils/s3';
import { Request } from 'express';
import { env } from '@/config/env.config';

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: env.S3_BUCKET_NAME!,
    metadata: (req: Request, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req: Request, file, cb) => {
      const ext = file.originalname.split('.').pop();
      const fileName = `services/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
      cb(null, fileName);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(null, false);
    }
    cb(null, true);
  },
});

export const uploadServiceImages = upload.array('images', 6);
