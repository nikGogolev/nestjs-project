import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/comments/dto/update-comment.dto';
import { Admin } from 'src/decorators/admin.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { imageFilter } from 'src/helpers/imageFilter';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @Admin()
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: './upoads/thumbnails',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: imageFilter,
    }),
  )
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createNewsDto: CreateNewsDto,
  ) {
    return this.newsService.create({
      ...createNewsDto,
      attachments: files.reduce(
        (prev, curr) => prev.concat(`thumbnails/${curr.filename}`),
        [],
      ),
    });
  }

  @Post(':id/comment')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: './upoads/thumbnails',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: imageFilter,
    }),
  )
  createComment(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.newsService.createComment(+id, {
      ...createCommentDto,
      attachments: files.reduce(
        (prev, curr) => prev.concat(`thumbnails/${curr.filename}`),
        [],
      ),
    });
  }

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Patch(':newsId/comment/:commentId')
  updateComment(@Param() params, @Body() updateCommentDto: UpdateCommentDto) {
    return this.newsService.updateComment(
      +params.newsId,
      +params.commentId,
      updateCommentDto,
    );
  }

  @Delete(':id')
  @Admin()
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }

  @Delete(':newsId/comment/:commentId')
  removeComment(@Param() params) {
    return this.newsService.removeComment(+params.newsId, +params.commentId);
  }
}
