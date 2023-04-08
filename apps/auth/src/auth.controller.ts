import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';

@Controller('auth/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async createUser(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }

    @Get()
    async getAllUsers() {
        return this.usersService.getAllUsers();
    }
}
