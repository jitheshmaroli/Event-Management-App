import multer from 'multer';
import { cloudinaryStorage } from '@/utils/multer-cloudinary';

const upload = multer({
  storage: cloudinaryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(null, false);
    }
    cb(null, true);
  },
});

export const uploadServiceImages = upload.array('images', 6);
