import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import {
  JwtPayload,
  JwtRefreshPayload,
} from './interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      this.logger.warn(`Invalid credentials for user with email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`User logged in with email: ${email}`);
    return tokens;
  }

  async logout(userId: number): Promise<void> {
    this.logger.log(`User logged out with ID: ${userId}`);
    await this.userService.update(userId, { hashRefreshToken: null });
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const user = await this.userService.findOne(userId);
      if (!user || !user.hashRefreshToken) {
        this.logger.warn(`Invalid refresh token for user with ID: ${userId}`);
        throw new UnauthorizedException('Access denied');
      }

      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.hashRefreshToken,
      );
      if (!isRefreshTokenMatching) {
        this.logger.warn(`Refresh token mismatch for user with ID: ${userId}`);
        throw new UnauthorizedException('Access denied');
      }

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      this.logger.log(`Refresh tokens issued for user with ID: ${userId}`);
      return tokens;
    } catch (error) {
      this.logger.error(`Error refreshTokens: ${error}`);
      throw new UnauthorizedException('Access denied');
    }
  }

  private async getTokens(userId: number, email: string) {
    const accessPayload: JwtPayload = { id: userId, email };
    const refreshPayload: JwtRefreshPayload = { id: userId };

    const accessTokenOptions = {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET')!,
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION')!,
    };

    const refreshTokenOptions = {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION')!,
    };

    const [accessToken, refreshToken] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this.jwtService.signAsync(accessPayload, accessTokenOptions),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this.jwtService.signAsync(refreshPayload, refreshTokenOptions),
    ]);

    this.logger.log(
      `Access and refresh tokens issued for user with ID: ${userId}`,
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
    this.logger.log(`Updating refresh token for user with ID: ${userId}`);
    await this.userService.update(userId, { hashRefreshToken });
  }
}
