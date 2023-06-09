import { RmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import { ProfileModule } from './profile.module';

async function bootstrap() {
    const app = await NestFactory.create(ProfileModule);
    const rmqService = app.get<RmqService>(RmqService);

    app.connectMicroservice<RmqOptions>(rmqService.getOptions('PROFILES', true));
    app.useGlobalPipes(new ValidationPipe());

    const configService = app.get(ConfigService);

    await app.startAllMicroservices();
    await app.listen(configService.get('PORT'));
}
bootstrap();
