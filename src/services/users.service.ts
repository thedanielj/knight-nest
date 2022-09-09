import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity.js';
import { firestore } from 'firebase-admin';
import QuerySnapshot = firestore.QuerySnapshot;
import { bucket, db } from '../utils/firebase.js';
import { DiscordUserDto } from '../dtos/disordUser.dto.js';
import UpdateData = firestore.UpdateData;
import { AccessTokenDto } from '../dtos/accessToken.dto.js';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

@Injectable()
export class UsersService {
  async getDiscordUser(token: string): Promise<DiscordUserDto | undefined> {
    const res = await fetch(`${process.env['DISCORD_API']}users/@me`, {
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      return undefined;
    }

    return (await res.json()) as DiscordUserDto;
  }

  async get(
    limit: number,
    before: string,
    sort: string,
    reverse: boolean | undefined,
  ): Promise<UserEntity[]> {
    let collection;

    if (!sort) {
      collection = db.users;
    } else {
      collection = db.users.orderBy(sort, reverse ? 'desc' : 'asc');
    }

    let snapshot: QuerySnapshot;

    if (!before) {
      snapshot = await collection.limit(limit).get();
    } else {
      const beforeUser = await db.users.doc(before).get();
      snapshot = await collection.startAfter(beforeUser).limit(limit).get();
    }

    const users: UserEntity[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as UserEntity;

      UsersService.clearUserObject(data);

      users.push(data);
    });

    return users;
  }

  async getUser(id: string, safety = true): Promise<UserEntity | undefined> {
    const promise = await db.users.doc(id).get();
    const user = promise.data() as UserEntity;

    if (!user) return undefined;

    if (safety) UsersService.clearUserObject(user);

    return user;
  }

  async getMe(token: string): Promise<UserEntity | undefined> {
    const discordUser = await this.getDiscordUser(token);

    if (!discordUser) return undefined;

    const user = await this.getUser(discordUser.id, false);

    if (!user) return undefined;

    return user;
  }

  async delete(id: string) {
    await db.users.doc(id).delete();
  }

  async update(id: string, data: UpdateData<UserEntity>) {
    await db.users.doc(id).update(data);
  }

  async initializeUser(accessToken: AccessTokenDto) {
    const discordUser = await this.getDiscordUser(
      `Bearer ${accessToken.access_token}`,
    );

    if (!discordUser) return;

    const document = db.users.doc(discordUser.id);
    const user = await document.get();

    if (user.exists) return;

    const avatarUrl = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`;
    const dir = process.env.BUFFER_PATH;
    const filesRes = await bucket.getFiles({ prefix: 'avatars/' });
    const numberOfFiles = filesRes.length;
    const file = `${numberOfFiles}.png`;
    const absolutePath = path.join(dir, file);
    const writer = fs.createWriteStream(absolutePath);

    const res = await fetch(avatarUrl);

    res.body?.pipe(writer);

    writer.on('finish', async () => {
      const uploadResponse = await bucket.upload(absolutePath, {
        destination: `avatars/${file}`,
      });

      const [url] = await uploadResponse[0].getSignedUrl({
        action: 'read',
        expires: '03-09-2491',
      });

      await document.set(
        JSON.parse(
          JSON.stringify(
            new UserEntity({
              id: discordUser.id,
              avatar: url,
              name: discordUser.username,
            }),
          ),
        ),
      );
    });
  }

  private static clearUserObject(user: UserEntity) {
    delete user.email;
    delete user.notifications;
  }
}
