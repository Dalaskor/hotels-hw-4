import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import * as Joi from 'joi';
import { DatabaseModule, RmqModule } from '@app/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profile } from './profile.model';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                PORT: Joi.number().required(),
                RABBIT_MQ_URI: Joi.string().required(),
                RABBIT_MQ_PROFILES_QUEUE: Joi.string().required(),
                POSTGRES_URI: Joi.string().required(),
            }),
            envFilePath: './apps/profile/.env',
        }),
        RmqModule,
        DatabaseModule,
        SequelizeModule.forFeature([Profile]),
    ],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}
