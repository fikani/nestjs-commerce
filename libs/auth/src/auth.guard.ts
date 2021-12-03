import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { Reflector } from '@nestjs/core';
import { AuthApi } from './api/auth.api';
import { UserApi } from './api/user.api';
import { Permission } from './domain/access/premission';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthApi,
    private readonly userApi: UserApi,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp()?.getRequest();
    const authHeader = request?.headers?.['authorization'];
    if (!authHeader) {
      throw new HttpErrorByCode[HttpStatus.UNAUTHORIZED]();
    }
    const [tipo, token] = authHeader.split(' ');
    if (tipo !== 'Bearer' || !token) {
      throw new HttpErrorByCode[HttpStatus.UNAUTHORIZED]();
    }

    const creds = await this.authService.parseToken(token as string);
    request.user = await this.userApi.getById(creds.userId);
    if (!request.user) {
      throw new HttpErrorByCode[HttpStatus.UNAUTHORIZED]();
    }

    if (!creds.permissions.some((p) => (p = Permission.EMAIL_CONFIRMED))) {
      throw new HttpErrorByCode[HttpStatus.UNAUTHORIZED]();
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    return roles.every((role) => creds.permissions.some((p) => p === role));
  }
}
