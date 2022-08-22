import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { CommentsModule } from './comments/comments.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessGuard } from './guards/access/access.guard';
import { MulterModule } from '@nestjs/platform-express';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    NewsModule,
    MailModule,
    CommentsModule,
    MulterModule.register({
      dest: './upload',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
})
export class AppModule {}
