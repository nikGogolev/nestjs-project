import { IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  commentId: number;
  @IsString()
  @MinLength(10)
  text: string;
  attachments: string[];
}
