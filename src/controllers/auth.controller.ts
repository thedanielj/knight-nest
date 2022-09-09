import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service.js';
import { AccessTokenDto } from '../dtos/accessToken.dto.js';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/users.service.js';
import { AuthDto } from '../dtos/auth.dto.js';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('authorize')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: AccessTokenDto })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ description: 'Form parameter "code"' })
  async authorize(
    @Body() form: Pick<AuthDto, 'code'>,
  ): Promise<AccessTokenDto> {
    const data = await this.authService.authorize(form.code);

    if (!data) {
      throw new BadRequestException('Code invalid');
    }

    await this.usersService.initializeUser(data);

    return data;
  }

  @Post('refresh')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: AccessTokenDto })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ description: 'Form parameter "token"' })
  async refresh(@Body() form: Pick<AuthDto, 'token'>): Promise<AccessTokenDto> {
    const data = await this.authService.refreshToken(form.token);

    if (!data) {
      throw new BadRequestException('Token invalid');
    }

    return data;
  }

  @Post('revoke')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Token revoked' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ description: 'Form parameter "token"' })
  async revoke(@Body() form: Pick<AuthDto, 'token'>) {
    await this.authService.revokeToken(form.token);
  }
}
