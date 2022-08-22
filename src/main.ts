import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as expressHbs from 'express-handlebars';
import { join } from 'path';
import * as hbs from 'hbs';
import { AppModule } from './app.module';
import { LoggingTimeInterceptor } from './interceptors/logging-time/logging-time.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(process.cwd(), 'public'), { fallthrough: true });
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.engine(
    'hbs',
    expressHbs.engine({
      layoutsDir: join(process.cwd(), 'views/layouts'),
      defaultLayout: 'layout',
      extname: 'hbs',
      helpers: {
        isTitleUpdated: function () {
          console.log();
          return this.newNews.title !== this.oldNews.title;
        },
        isDescriptionUpdated: function () {
          return this.newNews.description !== this.oldNews.description;
        },
      },
    }),
  );
  hbs.registerPartials(join(process.cwd(), 'views/partials'));

  app.setViewEngine('hbs');
  app.useGlobalInterceptors(new LoggingTimeInterceptor());
  await app.listen(3000);
}
bootstrap();
