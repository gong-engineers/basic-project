import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtRefreshPayload } from './interfaces/jwt-payload.interface';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          console.log('Extractor cookies:', req.cookies);
          console.log('Extractor raw header:', req.headers.cookie as string);
          return (req.cookies?.refreshToken as string | undefined) || null; // 기존의 authorization header에서 추출하는 방식을 쿠키에 있는 refreshToken을 추출하는 방식으로 변경
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET')!,
      passReqToCallback: true,
    });
  }

  // validate(request: Request, payload: JwtRefreshPayload) {
  //   const authorizationHeader = request.get('authorization');

  //   if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
  //     throw new UnauthorizedException('Invalid authorization header');
  //   }
  //   const refreshToken = authorizationHeader.replace('Bearer ', '').trim();
  //   return { ...payload, refreshToken };
  // }

  validate(
    req: Request,
    payload: JwtRefreshPayload,
  ): JwtRefreshPayload & { refreshToken: string } {
    // 쿠키에서 refreshToken 읽게끔 처리
    const refreshToken = req.cookies?.refreshToken as string;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    return { ...payload, refreshToken };
  }
}
