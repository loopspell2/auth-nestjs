import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Payload } from './user.guard';

export enum Role {
  ADMIN = 'Admin',
  USER = 'User',
  GUEST = 'Guest',
  SUPERADMIN = 'SuperAdmin',
  MANAGER = 'Manager',
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      // return true;
      throw new ForbiddenException('Access denied: Role');
    }
    const request: Request = context.switchToHttp().getRequest();
    // const { user } = context.switchToHttp().getRequest();
    const user = request['user'] as Payload;
    // console.log('user in role guard : ', user);
    return requiredRoles.some((roles) => user.role?.includes(roles));
  }
}
