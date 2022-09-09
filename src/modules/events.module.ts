import { Module } from '@nestjs/common';
import { EventsGateway } from '../gateways/events.gateway.js';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from '../services/users.service.js';

@Module({
  imports: [HttpModule],
  providers: [EventsGateway, UsersService],
})
export class EventsModule {}
