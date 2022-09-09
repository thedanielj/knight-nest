import { IsNotEmpty } from 'class-validator';

export class EditPostDto {
  @IsNotEmpty()
  content = '';
  edited_at = 0;
}
