import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { UserNotFoundException } from './exceptions/user-not-found.exceptions';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new UserNotFoundException(email);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const { password: pass, createdAt, updatedAt, ...safeUser } = user;
        return safeUser;
    }

    async login(user: any) {
        const payload = { id: user.id, email: user.email }
        const accessToken = this.jwtService.sign(payload, { expiresIn: '3m' })
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })

        return {
            accessToken,
            refreshToken
        }
    }

    async refreshToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);

            const user = await this.usersService.getUser(payload.id);

            if(!user){
                throw new UnauthorizedException('Invalid token')
            }

            return this.login(user)
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token')
        }
    }
}
