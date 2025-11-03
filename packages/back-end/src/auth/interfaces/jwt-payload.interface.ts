import { Request } from 'express';

export interface JwtPayload {
  id: number;
  email: string;
}

export interface JwtRefreshPayload {
  id: number;
}

export interface AccessRequest extends Request {
  user: JwtPayload;
}

export interface RefreshRequest extends Request {
  user: JwtRefreshPayload & { refreshToken: string };
}
