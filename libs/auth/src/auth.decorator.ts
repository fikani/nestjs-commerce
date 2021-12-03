import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { Permission } from './domain/access/premission';

export function Auth(...roles: Permission[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    ApiBearerAuth(),
    UseGuards(AuthGuard),
  );
}
