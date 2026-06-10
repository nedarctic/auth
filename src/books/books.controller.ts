import { Controller, Post, Get, Body, Param, UseGuards, Patch, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { BooksService } from './books.service';
import { title } from 'process';

@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Post()
    async createBook(@Body() dto: {title: string, description: string}){
        return await this.booksService.createBook(dto.title, dto.description)
    }

    @Get()
    async getBooks(){
        return await this.booksService.getBooks();
    }

    @Get(':id')
    async getBook(@Param('id') id: string){
        return await this.booksService.getBook(id);
    }

    @Patch(':id')
    async updateBook(@Param('id') id: string, @Body() dto: {title?: string; description?: string}){
        return await this.booksService.updateBook(id, dto.title, dto.description)
    }

    @Delete(':id')
    async deleteBook(@Param('id') id: string){
        return await this.booksService.deleteBook(id);
    }
}
