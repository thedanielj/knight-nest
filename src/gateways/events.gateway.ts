import {
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { UsersService } from '../services/users.service.js';
import { WebSocket } from 'ws';
import { NotificationEntity } from '../entities/notification.entity.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventDto } from '../dtos/event.dto.js';

@WebSocketGateway({
  path: '/gateway',
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(
    private readonly usersService: UsersService,
    private eventEmitter: EventEmitter2,
  ) {}

  @SubscribeMessage('events')
  async handleEvents(client: WebSocket, data: string): Promise<any> {
    const user = await this.usersService.getMe(data);

    if (!user) throw new WsException('Token invalid');

    this.eventEmitter.on('gateway.notifications', (event: EventDto) => {
      if (user.id !== event.id) return;

      client.send(JSON.stringify(event.value as NotificationEntity));
    });
  }
}
