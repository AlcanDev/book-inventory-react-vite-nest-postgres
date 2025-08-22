import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuditInterceptor } from '../audit/audit.interceptor';
import { Response } from 'express';

@ApiTags('books')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
@Controller('books')
export class BooksController {
  constructor(private readonly books: BooksService) {}

  @Get()
  @ApiOkResponse({ description: 'Listado con filtros, orden y paginación' })
  findAll(@Query() q: QueryBookDto) {
    return this.books.findAll(q);
  }

  @Get('export')
  async export(@Query() q: QueryBookDto, @Res() res: Response) {
    const csv = await this.books.exportCsv(q);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="books.csv"');
    res.send(csv);
  }

  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.books.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.books.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.books.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.books.softDelete(id);
  }
}
