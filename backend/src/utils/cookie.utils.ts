import { env } from '@/config/env.config';
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN,
  REFRESH_TOKEN_MAX_AGE,
} from '@/constants/auth.constants';
import { Response } from 'express';

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie(ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  res.cookie(REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
};
