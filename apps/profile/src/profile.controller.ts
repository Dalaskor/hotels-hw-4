import { JwtAuthGuard, RmqService } from '@app/common';
import { Body, Controller, Get, Inject, Param, Put, UseGuards } from '@nestjs/common';
import {
    Ctx,
    EventPattern,
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

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getOneByUserId(@Param('id') id: number) {
        return await this.profileService.getOneByUserId(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:user_id')
    async updateByUserId(
        @Param('user_id') userId: number,
        @Body() dto: CreateProfileDto,
    ) {
        return await this.profileService.updateByUserId(userId, dto);
    }

    @EventPattern('user-created')
    async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
        console.log('CHECK THIS PROFILE')
        await this.profileService.handleCreateUser(data);
        this.rmqService.ack(context);
    }
}
