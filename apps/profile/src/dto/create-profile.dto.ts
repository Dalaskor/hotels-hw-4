import { IsNumber, IsString } from 'class-validator';

export class CreateProfileDto {
    @IsString({ message: 'Должно быть строкой' })
    readonly name: string;

    @IsString({ message: 'Должно быть строкой' })
    readonly surname: string;

    @IsString({ message: 'Должно быть строкой' })
    readonly middlename: string;

    readonly user_id: number;
}
