import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserNotFoundException } from '../auth/exceptions/user-not-found.exceptions';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10)
        
        return this.prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        })
    }

    async getUser(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return await this.prisma.user.findUnique({
            where: {
                id
            }
        })
    }

    async getUsers() {
        return await this.prisma.user.findMany();
    }

    async deleteUser(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return await this.prisma.user.delete({ where: { id } })
    }

    async updateUser(id: string, email?: string, password?: string) {
        const user = await this.prisma.user.findUnique({ where: { id } })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return await this.prisma.user.update({
            where: { id },
            data: {
                email,
                password
            }
        })

    }
}
