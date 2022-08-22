import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/comments/dto/update-comment.dto';
import { Comment } from 'src/comments/entities/comment.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';

@Injectable()
export class NewsService {
  private news: News[] = [];

  create(createNewsDto: CreateNewsDto) {
    const news: News = {
      ...createNewsDto,
      id: this.news.length + 1,
      author: 'Nik',
      date: new Date(),
      comments: [],
    };
    this.news.push(news);

    return news;
  }

  createComment(newsId: number, createCommentDto: CreateCommentDto) {
    console.log(createCommentDto);

    const news: News = this.findOne(newsId);
    const newsIndex = this.news.findIndex((news) => news.id === newsId);
    const commentId = +createCommentDto.commentId;

    if (!news) {
      throw new NotFoundException();
    }
    if (commentId) {
      const newsCommentIndex = this.news[newsIndex].comments.findIndex(
        (comment) => comment.id === commentId,
      );

      if (newsCommentIndex === -1) {
        throw new NotFoundException();
      }

      const commentForComment: Comment = {
        id: news.comments[newsCommentIndex].comments.length + 1,
        author: 'Nadi',
        text: createCommentDto.text,
        date: new Date(),
        attachments: createCommentDto.attachments,
      };

      this.news[newsIndex].comments[newsCommentIndex].comments.push(
        commentForComment,
      );

      return `This action adds a new comment for #${commentId} comment`;
    }
    const comment: Comment = {
      id: news.comments.length + 1,
      author: 'Nadi',
      text: createCommentDto.text,
      date: new Date(),
      comments: [],
      attachments: createCommentDto.attachments,
    };
    this.news[newsIndex].comments.push(comment);
  }

  findAll() {
    return this.news;
  }

  findOne(id: number) {
    const news: News = this.news.find((news) => news.id === id);
    if (!news) {
      throw new NotFoundException();
    }
    return news;
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    const indexToUpdate: number = this.news.findIndex((news) => news.id === id);
    const oldNews: News = this.news.find((news) => news.id === id);
    if (!oldNews) {
      throw new NotFoundException({ error_msg: 'News not found' });
    }
    const newNews: News = {
      ...updateNewsDto,
      id: id,
      author: oldNews.author,
      date: new Date(),
      comments: oldNews.comments,
      attachments: oldNews.attachments,
    };

    this.news.splice(indexToUpdate, 1, newNews);

    return { oldNews, newNews };
  }

  updateComment(
    newsId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    const newsIndex: number = this.news.findIndex((news) => news.id === newsId);

    if (newsIndex === -1) {
      throw new NotFoundException({ error_msg: 'News not found' });
    }

    const commentIndexToUpdate: number = this.news[
      newsIndex
    ].comments.findIndex((comment) => comment.id === commentId);

    if (commentIndexToUpdate === -1) {
      throw new NotFoundException({
        error_msg: 'Comment not found',
      });
    }

    const commentForCommentId = updateCommentDto.commentId;

    if (updateCommentDto.commentId) {
      const commentForCommentIndexToUpdate: number = this.news[
        newsIndex
      ].comments[commentIndexToUpdate].comments.findIndex(
        (comment) => comment.id === commentForCommentId,
      );

      if (commentForCommentIndexToUpdate === -1) {
        throw new NotFoundException({
          error_msg: 'Comment not found',
        });
      }

      const commentForCommentToUpdate: Comment =
        this.news[newsIndex].comments[commentIndexToUpdate].comments[
          commentForCommentIndexToUpdate
        ];
      const commentForComment: Comment = {
        id: commentForCommentId,
        text: updateCommentDto.text,
        author: commentForCommentToUpdate.author,
        date: new Date(),
        attachments: commentForCommentToUpdate.attachments,
      };

      this.news[newsIndex].comments[commentIndexToUpdate].comments.splice(
        commentForCommentIndexToUpdate,
        1,
        commentForComment,
      );

      return `This action updates a comment #${commentId} of #${newsId} news`;
    }

    const commentToUpdate: Comment =
      this.news[newsIndex].comments[commentIndexToUpdate];
    const comment: Comment = {
      id: commentId,
      text: updateCommentDto.text,
      author: commentToUpdate.author,
      date: new Date(),
      comments: commentToUpdate.comments,
      attachments: commentToUpdate.attachments,
    };

    this.news[newsIndex].comments.splice(commentIndexToUpdate, 1, comment);

    return `This action updates a comment #${commentId} of #${newsId} news`;
  }

  remove(id: number) {
    const indexToRemove = this.news.findIndex((news) => news.id === id);
    this.news.splice(indexToRemove, 1);
    return `This action removes a #${id} news`;
  }

  removeComment(newsId: number, commentId: number) {
    const newsIndex: number = this.news.findIndex((news) => news.id === newsId);

    if (newsIndex === -1) {
      throw new NotFoundException({ error_msg: 'News not found' });
    }

    const commentIndexToRemove: number = this.news[
      newsIndex
    ].comments.findIndex((comment) => comment.id === commentId);

    if (commentIndexToRemove === -1) {
      throw new NotFoundException({
        error_msg: 'Comment not found',
      });
    }

    this.news[newsIndex].comments.splice(commentIndexToRemove, 1);
    return `This action removes a #${commentId} of #${newsId} news`;
  }
}
