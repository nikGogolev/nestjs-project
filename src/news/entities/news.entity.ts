import { Comment } from 'src/comments/entities/comment.entity';

export class News {
  id: number;
  author: string;
  title: string;
  description: string;
  date: Date;
  comments?: Comment[];
}
