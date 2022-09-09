import { Injectable } from '@nestjs/common';
import { AccessTokenDto } from '../dtos/accessToken.dto.js';
import fetch from 'node-fetch';

@Injectable()
export class AuthService {
  private apiUrl = `${process.env['DISCORD_API']}/oauth2/token`;

  async authorize(code: string): Promise<AccessTokenDto | undefined> {
    const data = new URLSearchParams({
      client_id: process.env.DISCORD_ID,
      client_secret: process.env.DISCORD_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
    });

    const res = await fetch(this.apiUrl, {
      method: 'POST',
      body: data,
    });

    if (!res.ok) {
      return undefined;
    }

    return (await res.json()) as AccessTokenDto;
  }

  async refreshToken(token: string): Promise<AccessTokenDto | undefined> {
    const data = new URLSearchParams({
      client_id: process.env.DISCORD_ID,
      client_secret: process.env.DISCORD_SECRET,
      grant_type: 'refresh_token',
      refresh_token: token,
    });

    const res = await fetch(this.apiUrl, {
      method: 'POST',
      body: data,
    });

    if (!res.ok) {
      return undefined;
    }

    return (await res.json()) as AccessTokenDto;
  }

  async revokeToken(token: string) {
    const data = new URLSearchParams({
      client_id: process.env.DISCORD_ID,
      client_secret: process.env.DISCORD_SECRET,
      token: token,
    });

    await fetch(`${this.apiUrl}revoke`, {
      method: 'POST',
      body: data,
    });
  }
}
