import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  handleRequest<TUser = unknown>(
    err: Error | null,
    user: TUser,
    info: unknown,
    context: ExecutionContext,
  ): TUser {
    console.log('JwtRefreshGuard ERR:', err);
    console.log('JwtRefreshGuard USER:', user);
    console.log('JwtRefreshGuard INFO:', info);
    return super.handleRequest(err, user, info, context);
  }
}
