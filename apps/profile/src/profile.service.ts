import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.model';

interface userData {
    user_id: number;
}

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(Profile)
        private readonly profilesRepository: typeof Profile,
    ) {}

    async create(dto: CreateProfileDto) {
        const profile = await this.profilesRepository.create(dto);

        return profile;
    }

    async getAll() {
        const profiles = await this.profilesRepository.findAll();

        return profiles;
    }

    async getOneByPk(id: number) {
        // const profile = await this.profilesRepository.findByPk(id);
        const profile = await this.profilesRepository.findOne({
            where: { id },
        });

        return profile;
    }

    async getOneByUserId(user_id: number) {
        const profile = await this.profilesRepository.findOne({
            where: { user_id },
        });

        return profile;
    }

    async updateByUserId(user_id: number, dto: CreateProfileDto) {
        const profile = await this.profilesRepository.findOne({
            where: { user_id },
        });

        if (!profile) {
            throw new HttpException(
                'Пользователь не найден',
                HttpStatus.NOT_FOUND,
            );
        }

        dto.name ? profile.name = dto.name : '';
        dto.surname ? profile.surname = dto.surname : '';
        dto.middlename ? profile.surname = dto.surname : '';

        await profile.save();

        return profile;
    }

    async deleteById(id: number) {
        const profile = await this.profilesRepository.findOne({
            where: { id },
        });

        if(!profile) {
            throw new HttpException(
                'Пользователь не найден',
                HttpStatus.NOT_FOUND,
            );
        }

        profile.destroy();

        return undefined;
    }

    async handleCreateUser(data: userData) {
        const profileDto: CreateProfileDto = {
            name: '',
            surname: '',
            middlename: '',
            user_id: data.user_id,
        };

        await this.create(profileDto);
    }
}
