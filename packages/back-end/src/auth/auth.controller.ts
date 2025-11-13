import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Res,
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
      sameSite: 'lax',
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

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshTokens(@Request() request: RefreshRequest) {
    const userId = request.user.id;
    // const requestRefreshToken = request.user.refreshToken;
    const requestRefreshToken = request.cookies['refreshToken'] as string;
    const { accessToken } = await this.authService.refreshTokens(
      userId,
      requestRefreshToken,
    );
    return ResponseDto.success('Refresh tokens successful', {
      accessToken: accessToken,
    });
  }
}
