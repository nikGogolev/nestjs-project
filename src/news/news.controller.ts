import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/comments/dto/update-comment.dto';
import { Admin } from 'src/decorators/admin.decorator';
import { Public } from 'src/decorators/public.decorator';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @SetMetadata('authorized', true)
  @Admin()
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Post(':id/comment')
  @Public()
  createComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.newsService.createComment(+id, createCommentDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Patch(':id')
  @Public()
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Patch(':newsId/comment/:commentId')
  @Public()
  updateComment(@Param() params, @Body() updateCommentDto: UpdateCommentDto) {
    return this.newsService.updateComment(
      +params.newsId,
      +params.commentId,
      updateCommentDto,
    );
  }

  @Delete(':id')
  @SetMetadata('authorized', false)
  @Admin()
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }

  @Delete(':newsId/comment/:commentId')
  @Public()
  removeComment(@Param() params) {
    return this.newsService.removeComment(+params.newsId, +params.commentId);
  }
}
