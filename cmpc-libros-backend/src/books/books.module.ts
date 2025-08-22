import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './book.model';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [SequelizeModule.forFeature([Book]), AuditModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
