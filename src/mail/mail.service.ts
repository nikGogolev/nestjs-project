import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { News } from 'src/news/entities/news.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTest() {
    console.log('Отправляется тестовое письмо');
    try {
      return await this.mailerService.sendMail({
        to: 'nv_gogolev@mail.ru',
        subject: 'Первое тестовое письмо',
        template: './test',
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendNewNewsForAdmins(emails: string[], news: News): Promise<void> {
    console.log('Отправляются письма о новой новости администрации ресурса');
    for (const email of emails) {
      try {
        const sentMessageInfo = await this.mailerService.sendMail({
          to: email,
          subject: `Создана новая новость: ${news.title}`,
          template: './new-news',
          context: news,
        });
        console.log(sentMessageInfo);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async sendUpdatedNewsForAdmins(
    emails: string[],
    oldNews: News,
    newNews: News,
  ): Promise<void> {
    console.log(
      'Отправляются письма об обновлении новости администрации ресурса',
    );
    for (const email of emails) {
      try {
        const sentMessageInfo = await this.mailerService.sendMail({
          to: email,
          subject: `Обновлена новость: ${oldNews.title}`,
          template: './update-news',
          context: {
            oldNews,
            newNews,
            titleUpdated: oldNews.title !== newNews.title,
            descriptionUpdated: oldNews.description !== newNews.description,
          },
        });
        console.log(sentMessageInfo);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
