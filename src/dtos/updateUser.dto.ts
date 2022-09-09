import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Federation } from '../enums/federation.enum.js';
import { Sex } from '../enums/sex.enum.js';

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name = '';

  @ApiProperty()
  bio = '';

  @ApiProperty()
  references: string[] = [];

  @ApiProperty()
  country = '';

  @ApiProperty()
  email = '';

  @ApiProperty()
  federation: Federation | null = null;

  @ApiProperty()
  sex: Sex | null = null;

  @ApiProperty()
  birthday = 0;
}
