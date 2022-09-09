import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module.js';
import { UsersModule } from './users.module.js';
import { PostsModule } from './posts.module.js';
import { ModModule } from './mod.module.js';
import { EventsModule } from './events.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    PostsModule,
    ModModule,
    EventsModule,
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
  ],
})
export class AppModule {}
