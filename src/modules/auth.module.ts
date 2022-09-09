import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from '../services/auth.service.js';
import { AuthController } from '../controllers/auth.controller.js';
import { UsersService } from '../services/users.service.js';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
