import cloudinary from '@/utils/cloudinary';
import logger from './logger';

export function getSignedImageUrl(
  publicId: string,
  expiresInSeconds = 7200
): string {
  if (!publicId) return '';

  try {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

    return cloudinary.url(publicId, {
      type: 'authenticated',
      sign_url: true,
      expires_at: expiresAt,
      resource_type: 'image',
      secure: true,
    });
  } catch (err) {
    logger.error(`Failed to sign Cloudinary URL for ${publicId}:`, err);
    return '';
  }
}

export function getSignedImageUrls(
  publicIds: string[],
  expiresInSeconds = 7200
): string[] {
  if (!publicIds?.length) return [];
  return publicIds.map((id) => getSignedImageUrl(id, expiresInSeconds));
}

export async function deleteCloudinaryObject(
  publicId: string
): Promise<boolean> {
  if (!publicId) return false;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      type: 'authenticated',
      resource_type: 'image',
      invalidate: true,
    });
    return result.result === 'ok';
  } catch (err) {
    logger.error(`Failed to delete Cloudinary asset ${publicId}:`, err);
    return false;
  }
}

export async function deleteCloudinaryObjects(
  publicIds: string[]
): Promise<number> {
  if (!publicIds?.length) return 0;

  let deletedCount = 0;
  for (const id of publicIds) {
    const success = await deleteCloudinaryObject(id);
    if (success) deletedCount++;
  }
  return deletedCount;
}
