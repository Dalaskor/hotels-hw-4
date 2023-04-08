import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from './users/users.model';
import { lastValueFrom } from 'rxjs';
import { PROFILES_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';

export interface TokenPayload {
    id: number;
    email: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        @Inject(PROFILES_SERVICE) private profileClient: ClientProxy,
    ) {}

    async login(dto: CreateUserDto) {
        const user = await this.validateUser(dto);
        return await this.generateToken(user);
    }

    async registration(dto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(dto.email);

        if (candidate) {
            throw new HttpException(
                'Пользователь с такой электронной почтой уже существует',
                HttpStatus.BAD_REQUEST,
            );
        }

        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.userService.createUser({
            email: dto.email,
            password: hashPassword,
        });

        await lastValueFrom(
            this.profileClient.emit('user-created', { user_id: user.id }),
        );

        return await this.generateToken(user);
    }

    private async validateUser(dto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(dto.email);
        const passwordEquals = await bcrypt.compare(
            dto.password,
            user.password,
        );

        if (user && passwordEquals) {
            return user;
        }

        throw new UnauthorizedException({
            message: 'Неккоректные электронная почта или пароль',
        });
    }

    private async generateToken(user: User) {
        const payload: TokenPayload = { id: user.id, email: user.email };

        return {
            token: this.jwtService.sign(payload),
        };
    }
}
