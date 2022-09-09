import { Role } from '../enums/role.enum.js';
import { Federation } from '../enums/federation.enum.js';
import { Sex } from '../enums/sex.enum.js';
import { Title } from '../enums/title.enum.js';
import { Badge } from '../enums/badge.enum.js';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationEntity } from './notification.entity.js';

export class UserEntity {
  @ApiProperty() avatar = '';
  @ApiProperty({ enum: Badge }) badges: Badge[] = [];
  @ApiProperty() bio = "Look at me, I'm new!";
  @ApiProperty() birthday = 0;
  @ApiProperty() country: string | null = null;
  @ApiProperty() email?: string | null = null;
  @ApiProperty({ enum: Federation }) federation: Federation | null = null;
  @ApiProperty() fide_id: number | null = null;
  @ApiProperty() id = '';
  @ApiProperty() name = '';
  @ApiProperty() notifications?: NotificationEntity[] = [];
  @ApiProperty() rating = 1000;
  @ApiProperty() references: string[] = [];
  @ApiProperty()
  registered_at: number = Math.round(new Date().getTime() / 1000);
  @ApiProperty({ enum: Role })
  roles: Role[] = [Role.User];
  @ApiProperty({ enum: Sex })
  sex: Sex | null = null;
  @ApiProperty({ enum: Title })
  title: Title | null = null;
  @ApiProperty() likes: string[] = [];
  @ApiProperty() posts: string[] = [];

  constructor(init: Partial<UserEntity>) {
    Object.assign(this, init);
  }
}
