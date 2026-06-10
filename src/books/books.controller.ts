import { Controller, Post, Get, Body, Param, UseGuards, Patch, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { BooksService } from './books.service';

@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @UseInterceptors(FileInterceptor('image'))
    @Post()
    async createBook(@UploadedFile() image: Express.Multer.File, @Body() dto: {title: string, description: string}){
        return await this.booksService.createBook(image, dto.title, dto.description)
    }

    @Get()
    async getBooks(){
        return await this.booksService.getBooks();
    }

    @Get(':id')
    async getBook(@Param('id') id: string){
        return await this.booksService.getBook(id);
    }

    @UseInterceptors(FileInterceptor('image'))
    @Patch(':id')
    async updateBook(@UploadedFile() image: Express.Multer.File, @Param('id') id: string, @Body() dto: {title?: string; description?: string}){
        return await this.booksService.updateBook(id, image, dto.title, dto.description)
    }

    @Delete(':id')
    async deleteBook(@Param('id') id: string){
        return await this.booksService.deleteBook(id);
    }
}
