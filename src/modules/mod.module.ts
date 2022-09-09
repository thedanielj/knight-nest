import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ModController } from '../controllers/mod.controller.js';
import { ModService } from '../services/mod.service.js';
import { UsersService } from '../services/users.service.js';

@Module({
  imports: [HttpModule],
  controllers: [ModController],
  providers: [ModService, UsersService],
})
export class ModModule {}
