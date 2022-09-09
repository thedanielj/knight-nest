import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class GetDto {
  @IsNumber()
  @Max(100)
  @Min(1)
  limit: number = 0;

  before = '';

  sort = '';

  @IsBoolean()
  @IsOptional()
  reverse?: boolean | undefined = false;
}
