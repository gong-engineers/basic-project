import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  type AccessRequest,
  type RefreshRequest,
} from './interfaces/jwt-payload.interface';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import type { Response } from 'express';
import { ResponseDto } from '../common/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    // refreshToken은 HttpOnly 쿠키로 저장
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      path: '/',
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 2주
    });

    return response.json({ accessToken });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() request: AccessRequest) {
    await this.authService.logout(request.user.id);
    return { message: 'Logout successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() request: AccessRequest) {
    const userId = request.user.id;
    return this.authService.getUserById(userId);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshTokens(
    @Request() request: RefreshRequest,
    @Res() response: Response,
  ) {
    const userId = request.user.id;

    // 쿠키에 저장된 RefreshToken 가져오기
    const requestRefreshToken = request.cookies['refreshToken'] as string;

    // RefreshToken과 RefreshRequest의 payload에 저장된 회원 ID를 통해 토큰 재발급
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      userId,
      requestRefreshToken,
    );

    // 쿠키에도 새로운 토큰으로 업데이트
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      path: '/',
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 2주
    });

    return response.json(
      ResponseDto.success('Refresh tokens successful', {
        accessToken,
      }),
    );
  }
}
