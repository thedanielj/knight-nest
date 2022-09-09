import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Body,
  Delete,
  Put,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../services/users.service.js';
import { UserEntity } from '../entities/user.entity.js';
import { RoleGuard } from '../guards/role.guard.js';
import { Roles } from '../decorators/roles.decorator.js';
import { Role } from '../enums/role.enum.js';
import { UpdateUserDto } from '../dtos/updateUser.dto.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../decorators/user.decorator.js';
import { GetDto } from '../dtos/get.dto.js';

@Controller('users')
@ApiTags('users')
@UseGuards(RoleGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiQuery({ name: 'limit', type: 'string' })
  @ApiQuery({ name: 'before', type: 'string', required: false })
  @ApiQuery({ name: 'sort', type: 'string', required: false })
  @ApiQuery({ name: 'reverse', type: 'boolean', required: false })
  @ApiOkResponse({ type: [UserEntity] })
  @ApiBadRequestResponse({ description: 'Missing required parameter "limit"' })
  async getUsers(@Query() q: GetDto): Promise<UserEntity[]> {
    return await this.usersService.get(q.limit, q.before, q.sort, q.reverse);
  }

  @Get('@me')
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(Role.User)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  @ApiForbiddenResponse({ description: "You don't have access to this route" })
  @ApiBadRequestResponse({ description: 'Authorization header missing' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getMe(@User() user: UserEntity): Promise<UserEntity> {
    return user;
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: UserEntity })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getUser(@Param('id') id: string): Promise<UserEntity> {
    const user = await this.usersService.getUser(id, true);

    if (!user) {
      throw new BadRequestException('User not found by provided id');
    }

    return user;
  }

  @Delete('@me/delete')
  @Roles(Role.User)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Account deleted' })
  @ApiForbiddenResponse({ description: "You don't have access to this route" })
  @ApiBadRequestResponse({ description: 'Authorization header missing' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async deleteMe(@User() user: UserEntity) {
    await this.usersService.delete(user.id);
  }

  @Put('@me/update')
  @Roles(Role.User)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Account deleted' })
  @ApiForbiddenResponse({ description: "You don't have access to this route" })
  @ApiBadRequestResponse({ description: 'Authorization header missing' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async updateMe(@User() user: UserEntity, @Body() body: UpdateUserDto) {
    await this.usersService.update(user.id, {
      name: body.name,
      bio: body.bio,
      references: body.references,
      country: body.country,
      email: body.email,
      federation: body.federation,
      sex: body.sex,
      birthday: body.birthday,
    });
  }
}
