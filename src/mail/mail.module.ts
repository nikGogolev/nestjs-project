import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { password } from './password';
import { MailController } from './mail.controller';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: `smtps://nv_gogolev:${password}@smtp.mail.ru`,
      defaults: {
        from: '"NestJS робот" <nv_gogolev@mail.ru>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
