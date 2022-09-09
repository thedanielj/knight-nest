import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import rawBody from 'raw-body';

export const PlainBody = createParamDecorator(
  async (_, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    if (!req.readable) {
      throw new InternalServerErrorException('Invalid body');
    }

    return (await rawBody(req)).toString().trim();
  },
);
