import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { R2Module } from '../r2/r2.module';

@Module({
  imports: [PrismaModule, R2Module],
  providers: [BooksService],
  controllers: [BooksController],
})
export class BooksModule { }
