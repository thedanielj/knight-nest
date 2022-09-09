import { ApiProperty } from '@nestjs/swagger';

export class PostEntity {
  @ApiProperty()
  author = '';

  @ApiProperty()
  content = '';

  @ApiProperty()
  created_at: number = Math.round(new Date().getTime() / 1000);

  @ApiProperty()
  edited_at: number | null = null;

  @ApiProperty()
  id = '';

  @ApiProperty()
  likes: string[] = [];
}
