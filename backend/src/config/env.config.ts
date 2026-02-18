import dotenv from 'dotenv';
dotenv.config({
  path: '.env',
});

function requiredEnv(variableName: string): string {
  const value = process.env[variableName];
  if (!value) {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }
  return value;
}

export const env = {
  PORT: Number(requiredEnv('PORT')),
  CLIENT_URL: requiredEnv('CLIENT_URL'),
  NODE_ENV: requiredEnv('NODE_ENV'),
  MONGO_URI: requiredEnv('MONGO_URI'),
  JWT_ACCESS_SECRET: requiredEnv('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: requiredEnv('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRATION: requiredEnv('JWT_ACCESS_EXPIRATION'),
  JWT_REFRESH_EXPIRATION: requiredEnv('JWT_REFRESH_EXPIRATION'),
  EMAIL_SERVICE: requiredEnv('EMAIL_SERVICE'),
  EMAIL_USER: requiredEnv('EMAIL_USER'),
  EMAIL_PASS: requiredEnv('EMAIL_PASS'),
  EMAIL_FROM: requiredEnv('EMAIL_FROM'),
  S3_BUCKET_NAME: requiredEnv('S3_BUCKET_NAME'),
  AWS_REGION: requiredEnv('AWS_REGION'),
};
