import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
    constructor(private readonly prisma: PrismaService) { }

    async createBook(title: string, description: string) {
        return await this.prisma.book.create({ data: { title, description } });
    }

    async getBooks() {
        return await this.prisma.book.findMany();
    }

    async getBook(id: string) {

        const book = await this.prisma.book.findUnique({ where: { id } })

        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }

        return await this.prisma.book.findUnique({ where: { id } })
    }

    async updateBook(id: string, title?: string, description?: string) {
        const book = await this.prisma.book.findUnique({ where: { id } })

        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }

        return await this.prisma.book.update({ where: { id }, data: { title, description } });
    }

    async deleteBook(id: string) {
        const book = await this.prisma.book.findUnique({ where: { id } })

        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }

        return await this.prisma.book.delete({ where: { id } })
    }
}
