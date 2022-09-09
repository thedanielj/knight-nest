import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty() access_token = '';
  @ApiProperty() token_type = '';
  @ApiProperty() expires_in = 0;
  @ApiProperty() refresh_token = '';
  @ApiProperty() scope = '';
}
