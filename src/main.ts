import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { UserEntity } from './entities/user.entity.js';
import { PostEntity } from './entities/post.entity.js';
import { AccessTokenDto } from './dtos/accessToken.dto.js';
import { WsAdapter } from '@nestjs/platform-ws';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  const config = new DocumentBuilder()
    .setTitle('Knight')
    .addServer('https://api.chesscord.wiki/knight', 'Main server')
    .addTag('auth')
    .addTag('users')
    .addTag('posts')
    .addTag('mod')
    .addTag('gateway')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [UserEntity, PostEntity, AccessTokenDto],
  });
  SwaggerModule.setup('api', app, document);

  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(3000);
}

console.log(`
                        Starting
 __  __     __   __     __     ______     __  __     ______  
/\\ \\/ /    /\\ "-.\\ \\   /\\ \\   /\\  ___\\   /\\ \\_\\ \\   /\\__  _\\ 
\\ \\  _"-.  \\ \\ \\-.  \\  \\ \\ \\  \\ \\ \\__ \\  \\ \\  __ \\  \\/_/\\ \\/ 
 \\ \\_\\ \\_\\  \\ \\_\\\\"\\_\\  \\ \\_\\  \\ \\_____\\  \\ \\_\\ \\_\\    \\ \\_\\ 
  \\/_/\\/_/   \\/_/ \\/_/   \\/_/   \\/_____/   \\/_/\\/_/     \\/_/ 
                                                             

`);

// noinspection JSIgnoredPromiseFromCall
bootstrap();
