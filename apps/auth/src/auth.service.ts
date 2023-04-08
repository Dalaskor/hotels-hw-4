import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './users/dto/create-user.dto';
import { User } from './users/users.model';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: typeof User) {}

    async createUser(dto: CreateUserDto) {
        let candidate = this.usersRepository.findOne({
            where: { email: dto.email },
        });

        if (candidate) {
            throw new HttpException(
                'Пользователь с такой электронной почтой уже есть',
                HttpStatus.BAD_REQUEST,
            );
        }

        candidate = this.usersRepository.create({
            email: dto.email,
            password: await bcrypt.hash(dto.password, 10),
        });

        return candidate;
    }

    async getAllUsers() {
        const users = this.usersRepository.findAll();

        return users;
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({ where: { email } });
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            throw new UnauthorizedException('Credentials are not valid.');
        }
        return user;
    }

    async getUser(id: number) {
        return this.usersRepository.findByPk(id);
    }
}
