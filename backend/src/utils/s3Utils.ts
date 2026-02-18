import { DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '@/utils/s3';
import { env } from '@/config/env.config';
import logger from './logger';

const BUCKET_NAME = env.S3_BUCKET_NAME!;

export async function getSignedImageUrl(
  key: string,
  expiresInSeconds = 7200
): Promise<string> {
  if (!key) return '';

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    return await getSignedUrl(s3Client, command, {
      expiresIn: expiresInSeconds,
    });
  } catch (err) {
    logger.error(`Failed to sign URL for key ${key}:`, err);
    return '';
  }
}

export async function getSignedImageUrls(
  keys: string[],
  expiresInSeconds = 7200
): Promise<string[]> {
  if (!keys?.length) return [];

  const promises = keys.map((key) => getSignedImageUrl(key, expiresInSeconds));
  return Promise.all(promises);
}

export async function deleteS3Object(key: string): Promise<boolean> {
  if (!key) return false;

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    await s3Client.send(command);
    return true;
  } catch (err) {
    logger.error(`Failed to delete S3 object ${key}:`, err);
    return false;
  }
}

export async function deleteS3Objects(keys: string[]): Promise<number> {
  if (!keys?.length) return 0;

  let deletedCount = 0;

  for (const key of keys) {
    const success = await deleteS3Object(key);
    if (success) deletedCount++;
  }

  return deletedCount;
}
