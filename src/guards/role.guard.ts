import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { UsersService } from '../services/users.service.js';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (!token) {
      throw new BadRequestException('Authorization header missing');
    }

    const user = await this.usersService.getMe(token);

    if (!user) {
      throw new NotFoundException('User not found, please check your token');
    }

    if (!user.roles) {
      throw new InternalServerErrorException(
        'Your roles are empty in database',
      );
    }

    request.user = user;

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
