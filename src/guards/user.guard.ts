import { User } from './../schemas/user.schema';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from '../user/constant';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/user.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export type Payload = {
  sub: string;
  username: string;
  role: string;
  extraPermissions: string[];
  denyPermissions: string[];
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @InjectModel(User.name) private User: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      let payload: Payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      const existingUser = await this.User.findById(payload.sub);
      if (!existingUser) {
        throw new UnauthorizedException();
      }

      payload = { ...payload, role: existingUser.role || 'Guest' };

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
