import { RmqService } from '@app/common';
import { Body, Controller, Post } from '@nestjs/common';
import {
    Ctx,
    MessagePattern,
    Payload,
    RmqContext,
} from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';

@Controller('/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly rmqService: RmqService,
    ) {}

    @Post('/registration')
    async registration(@Body() dto: CreateUserDto) {
        return await this.authService.registration(dto);
    }

    @Post('/login')
    async login(@Body() dto: CreateUserDto) {
        return await this.authService.login(dto);
    }

    @MessagePattern('validate_user')
    async handleValidateUser(@Payload() data: any, @Ctx() context: RmqContext) {
        this.rmqService.ack(context);
        return await this.authService.handleValidateUser(data);
    }
}
