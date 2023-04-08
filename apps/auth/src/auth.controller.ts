import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/registration')
    async registration(@Body() dto: CreateUserDto) {
        return await this.authService.registration(dto);
    }

    @Post('/login')
    async login(@Body() dto: CreateUserDto) {
        return await this.authService.login(dto);
    }
}
