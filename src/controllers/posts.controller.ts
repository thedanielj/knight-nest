import {
  BadRequestException,
  ClassSerializerInterceptor,
  ForbiddenException,
  NotFoundException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service.js';
import { RoleGuard } from '../guards/role.guard.js';
import { PostEntity } from '../entities/post.entity.js';
import { Roles } from '../decorators/roles.decorator.js';
import { Role } from '../enums/role.enum.js';
import { PlainBody } from '../decorators/plainBody.decorator.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../decorators/user.decorator.js';
import { UserEntity } from '../entities/user.entity.js';
import { GetDto } from '../dtos/get.dto.js';

@Controller('posts')
@ApiTags('posts')
@UseGuards(RoleGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiQuery({ name: 'limit', type: 'string' })
  @ApiQuery({ name: 'before', type: 'string', required: false })
  @ApiQuery({ name: 'sort', type: 'string', required: false })
  @ApiQuery({ name: 'reverse', type: 'boolean', required: false })
  @ApiOkResponse({ type: [PostEntity] })
  @ApiBadRequestResponse({ description: 'Missing required parameter "limit"' })
  async get(@Query() q: GetDto): Promise<PostEntity[]> {
    return await this.postsService.get(q.limit, q.before, q.sort, q.reverse);
  }

  @Put('create')
  @HttpCode(201)
  @Roles(Role.User)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Post created' })
  @ApiForbiddenResponse({ description: "You don't have access to this route" })
  @ApiBadRequestResponse({
    description: 'Authorization header missing or wrong content length',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBody({ description: 'Content of post' })
  async create(@User() user: UserEntity, @PlainBody() content: string) {
    if (content.length <= 12) {
      throw new BadRequestException('Content length must be more than 12');
    }

    await this.postsService.create(user.id, content);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: PostEntity })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async getById(@Param('id') id: string): Promise<PostEntity> {
    const post = await this.postsService.getById(id);

    if (!post) {
      throw new NotFoundException(`Post "${id}" not found`);
    }

    return post;
  }

  @Put(':id/like')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Post liked' })
  @ApiForbiddenResponse({ description: "You don't have access to this route" })
  @ApiBadRequestResponse({ description: 'Authorization header missing' })
  @ApiNotFoundResponse({ description: 'User/Post not found' })
  @Roles(Role.User)
  async like(@User() user: UserEntity, @Param('id') id: string) {
    const post = await this.postsService.getById(id);

    if (!post) {
      throw new NotFoundException(`Post "${id}" not found`);
    }

    await this.postsService.like(user, post);
  }

  @Put(':id/unlike')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Post votes decremented' })
  @ApiForbiddenResponse({ description: "You don't have access to this route" })
  @ApiBadRequestResponse({ description: 'Authorization header missing' })
  @ApiNotFoundResponse({ description: 'User/Post not found' })
  @Roles(Role.User)
  async unlike(@User() user: UserEntity, @Param('id') id: string) {
    const post = await this.postsService.getById(id);

    if (!post) {
      throw new NotFoundException(`Post "${id}" not found`);
    }

    await this.postsService.unlike(user, post);
  }

  @Delete(':id/delete')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Post deleted' })
  @ApiForbiddenResponse({ description: "You don't have access to this route" })
  @ApiBadRequestResponse({ description: 'Authorization header missing' })
  @ApiNotFoundResponse({ description: 'User/Post not found' })
  @Roles(Role.User, Role.Mod, Role.Admin)
  async delete(@User() user: UserEntity, @Param('id') id: string) {
    const post = await this.postsService.getById(id);

    if (!post) {
      throw new NotFoundException(`Post "${id}" not found`);
    }

    if (user.id !== post.author) {
      throw new ForbiddenException("You don't have access to this post");
    }

    await this.postsService.delete(user.id, post.id);
  }

  @Put(':id/edit')
  @ApiBearerAuth()
  @Roles(Role.User)
  @ApiNotFoundResponse({ description: 'User/Post not found' })
  @ApiForbiddenResponse({ description: "You don't have access to this route" })
  @ApiBadRequestResponse({
    description: 'Authorization header missing or wrong content length',
  })
  @ApiBody({ description: 'Content of post' })
  async edit(
    @User() user: UserEntity,
    @Param('id') id: string,
    @PlainBody() content: string,
  ) {
    const post = await this.postsService.getById(id);

    if (!post) {
      throw new NotFoundException(`Post "${id}" not found`);
    }

    if (user.id !== post.author) {
      throw new ForbiddenException("You don't have access to this post");
    }

    if (content.length <= 12) {
      throw new BadRequestException('Content length must be more than 12');
    }

    await this.postsService.edit(post.id, content);
  }
}
