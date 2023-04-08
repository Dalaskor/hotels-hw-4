import { RmqService } from '@app/common';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import {
    Ctx,
    MessagePattern,
    Payload,
    RmqContext,
} from '@nestjs/microservices';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService,
        private readonly rmqService: RmqService,
    ) {}

    @Get()
    async getAll() {
        return await this.profileService.getAll();
    }

    @Get('/:id')
    async getOneByUserId(@Param('id') id: number) {
        return await this.profileService.getOneByUserId(id);
    }

    @Put('/:user_id')
    async updateByUserId(
        @Param('user_id') userId: number,
        @Body() dto: CreateProfileDto,
    ) {
        return await this.profileService.updateByUserId(userId, dto);
    }

    @MessagePattern('user-created')
    async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
        await this.profileService.handleCreateUser(data);
        this.rmqService.ack(context);
    }
}
