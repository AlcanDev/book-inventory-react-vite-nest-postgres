import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { UploadController } from './upload.controller';
import { Book } from './book.model';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Book]),
    AuditModule,
  ],
  controllers: [BooksController, UploadController],
  providers: [BooksService],
})
export class BooksModule {}
