import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [NewsModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
