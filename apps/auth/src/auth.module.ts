import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { RmqModule } from '@app/common';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        RmqModule,
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRATION: Joi.string().required(),
                RABBIT_MQ_URI: Joi.string().required(),
                RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
                PORT: Joi.number().required(),
            }),
            envFilePath: './apps/auth/.env',
        }),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
