import { Module } from '@nestjs/common';
import { PostsController } from '../controllers/posts.controller.js';
import { PostsService } from '../services/posts.service.js';
import { UsersService } from '../services/users.service.js';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PostsController],
  providers: [PostsService, UsersService],
})
export class PostsModule {}
