import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findUsers() {
        return this.usersService.getUsers();
    }

    @Post()
    async createUser(@Body() dto: {email: string, password: string}) {
        return this.usersService.createUser(dto.email, dto.password);
    }

    @Get(':id')
    async getUser(@Param('id') id: string) {
        return this.usersService.getUser(id);
    }

    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() dto: {email?: string, password?: string}) {
        return this.usersService.updateUser(id, dto.email, dto.password);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string ) {
        return this.usersService.deleteUser(id);
    }    
}