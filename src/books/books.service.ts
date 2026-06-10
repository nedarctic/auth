import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';

@Injectable()
export class BooksService {
    constructor(private readonly prisma: PrismaService, private readonly r2: R2Service) { }

    async createBook(image: Express.Multer.File, title: string, description: string) {

        let imageKey, imageUrl;

        if (image.size > 0) {
            const { key, publicUrl } = await this.r2.uploadFile(image, "books");
            imageKey = key;
            imageUrl = publicUrl;
        }

        return await this.prisma.book.create({ data: { title, description, imageKey, imageUrl } });
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

    async updateBook(id: string, image: Express.Multer.File, title?: string, description?: string) {
        const book = await this.prisma.book.findUnique({ where: { id } })

        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }

        let imageKey, imageUrl;
        if (image.size > 0) {
            const { key, publicUrl } = await this.r2.uploadFile(image, "books");
            imageKey = key;
            imageUrl = publicUrl;
        }

        return await this.prisma.book.update({
            where: { id },
            data: {
                title,
                description,
                imageKey: imageKey ?? book.imageKey,
                imageUrl: imageUrl ?? book.imageUrl
            }
        });
    }

    async deleteBook(id: string) {
        const book = await this.prisma.book.findUnique({ where: { id } })

        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }

        await this.r2.deleteFile(book.imageKey!);

        return await this.prisma.book.delete({ where: { id } })
    }
}
