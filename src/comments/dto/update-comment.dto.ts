import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsPositive, IsString } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsNumber()
  @IsPositive()
  commentId?: number;
  @IsString()
  text: string;
}
