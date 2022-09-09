import { IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  code = '';

  @IsNotEmpty()
  token = '';
}
