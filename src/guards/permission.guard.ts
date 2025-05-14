import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Payload } from './user.guard';
import { Permission, RolePermissions } from './enum';
import { PERMISSIONS_KEY } from 'src/decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      // return true;
      throw new ForbiddenException('Access denied: insufficient Permission');
    }
    const request: Request = context.switchToHttp().getRequest();

    const user = request['user'] as Payload;

    const user_permission = new Set();

    if (user.role === 'SuperAdmin') {
      RolePermissions.SuperAdmin.forEach((p) => user_permission.add(p));
    } else if (user.role === 'Admin') {
      RolePermissions.Admin.forEach((p) => user_permission.add(p));
    } else if (user.role === 'Manager') {
      RolePermissions.Manager.forEach((p) => user_permission.add(p));
    } else if (user.role === 'User') {
      RolePermissions.User.forEach((p) => user_permission.add(p));
    } else if (user.role === 'Guest') {
      RolePermissions.Viewer.forEach((p) => user_permission.add(p));
    }

    if (user.extraPermissions.length > 0) {
      user.extraPermissions.forEach((p) => user_permission.add(p));
    }

    if (user.denyPermissions.length > 0) {
      user.denyPermissions.forEach((p) => user_permission.delete(p));
    }

    return requiredPermissions.some((permission) =>
      user_permission.has(permission),
    );
  }
}
