import { Body, Controller, Post, UseGuards, Request, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.guard';
import type { Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService ) { }

    private readonly logger = new Logger(AuthController.name)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: ExpressRequest) {
        const user = req.user;
        const { accessToken: access_token, refreshToken: refresh_token } = await this.authService.login(user);

        return { user, access_token, refresh_token };
    }

    @Post('refresh')
    async refreshToken(@Body() dto: { refreshToken: string }) {
        this.logger.log('REFRESH ENDPOINT HIT')
        const { accessToken: access_token, refreshToken: refresh_token } = await this.authService.refreshToken(dto.refreshToken);
        this.logger.log(`Access token at refresh endpoint: ${access_token}`)
        return { access_token, refresh_token }
    }
}
