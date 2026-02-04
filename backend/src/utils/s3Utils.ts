import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '@/utils/s3';
import { env } from '@/config/env.config';

const BUCKET_NAME = env.S3_BUCKET_NAME!;

export async function getSignedImageUrl(
  key: string,
  expiresInSeconds = 3600 * 2 // 2 hours
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
    console.error(`Failed to sign URL for key ${key}:`, err);
    return '';
  }
}

export async function getSignedImageUrls(
  keys: string[],
  expiresInSeconds = 3600 * 2
): Promise<string[]> {
  if (!keys?.length) return [];

  const promises = keys.map((key) => getSignedImageUrl(key, expiresInSeconds));
  return Promise.all(promises);
}
