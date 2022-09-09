import {
  BadRequestException,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ModService } from '../services/mod.service.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleGuard } from '../guards/role.guard.js';
import { Roles } from '../decorators/roles.decorator.js';
import { Role } from '../enums/role.enum.js';
import { UsersService } from '../services/users.service.js';
import { Title } from '../enums/title.enum.js';
import { User } from '../decorators/user.decorator.js';
import { UserEntity } from '../entities/user.entity.js';

@Controller('mod')
@ApiTags('mod')
@UseGuards(RoleGuard)
export class ModController {
  constructor(
    private readonly modService: ModService,
    private readonly usersService: UsersService,
  ) {}

  @Delete(':user/title/clear')
  @Roles(Role.Mod, Role.Admin)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User title cleared' })
  @ApiForbiddenResponse({ description: "You don't have access to this route" })
  @ApiBadRequestResponse({ description: 'Authorization header missing' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async clearTitle(@Param('user') id: string) {
    const user = await this.usersService.getUser(id);

    if (!user) {
      throw new NotFoundException('User not found by provided id');
    }

    await this.modService.clearTitle(user.id);
  }

  @Put(':user/title/:title')
  @Roles(Role.Mod, Role.Admin)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User title updated' })
  @ApiForbiddenResponse({ description: "You don't have access to this route" })
  @ApiBadRequestResponse({ description: 'Authorization header missing' })
  @ApiNotFoundResponse({ description: 'User/Title not found' })
  async updateTitle(@Param('user') id: string, @Param('title') title: Title) {
    const user = await this.usersService.getUser(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!Object.values(Title).includes(title)) {
      throw new NotFoundException(`Title "${title}" not found`);
    }

    await this.modService.updateTitle(user.id, title);
  }

  @Delete(':user/delete')
  @Roles(Role.Mod, Role.Admin)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User deleted' })
  @ApiForbiddenResponse({ description: "You don't have access to this route" })
  @ApiBadRequestResponse({ description: 'Authorization header missing' })
  @ApiNotFoundResponse({
    description: "User not found or you can't delete yourself",
  })
  async deleteUser(@User() moderator: UserEntity, @Param('user') id: string) {
    if (moderator.id === id) {
      throw new BadRequestException("You can't delete yourself");
    }

    await this.usersService.delete(id);
  }
}
