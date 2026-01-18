import { env } from '@/config/env.config';
import { Role } from '@/constants/roles';
import jwt from 'jsonwebtoken';

export interface AccessPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface RefreshPayload {
  userId: string;
}

export const generateAccessToken = (payload: AccessPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload: RefreshPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });
};

export const verifyAccessToken = (token: string): AccessPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
};

export const verifyRefreshToken = (token: string): RefreshPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload;
};
