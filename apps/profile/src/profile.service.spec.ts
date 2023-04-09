import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { async } from 'rxjs';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.model';
import { ProfileService } from './profile.service';

const testProfile = {
    name: 'Ivan',
    surname: 'Ivanov',
    middlename: 'Ivanovich',
    user_id: 1,
};

const testCreateProfile: CreateProfileDto = {
    name: 'Ivan',
    surname: 'Ivanov',
    middlename: 'Ivanovich',
    user_id: 1,
};

describe('profileService', () => {
    let service: ProfileService;
    let model: typeof Profile;

    beforeEach(async () => {
        const modRef = await Test.createTestingModule({
            providers: [
                ProfileService,
                {
                    provide: getModelToken(Profile),
                    useValue: {
                        findAll: jest.fn(() => [testProfile]),
                        findOne: jest.fn(),
                        create: jest.fn(() => testProfile),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = modRef.get(ProfileService);
        model = modRef.get<typeof Profile>(getModelToken(Profile));
    });

    it('should get the profiles', async () => {
        expect(await service.getAll()).toEqual([testProfile]);
    });

    it('should add a profile', async () => {
        expect(await service.create(testCreateProfile)).toEqual(testProfile);
    });

    it('should get a single profile', async () => {
        const findSpy = jest.spyOn(model, 'findOne');
        expect(await service.getOneByPk(1));
        expect(findSpy).toBeCalledWith({ where: { id: 1 } });
    });

    it('update a profile', async () => {
        const saveStub = jest.fn();
        const findSpy = jest.spyOn(model, 'findOne').mockReturnValue({
            save: saveStub,
        } as any);
        const retVal = await service.updateByUserId(1, testCreateProfile);

        expect(findSpy).toBeCalledWith({ where: { user_id: 1 } });
        expect(saveStub).toBeCalledTimes(1);
    });

    it('should remove a profile', async () => {
        const destroyStub = jest.fn();
        const findSpy = jest.spyOn(model, 'findOne').mockReturnValue({
            destroy: destroyStub,
        } as any);

        const retVal = await service.deleteById(1);

        expect(findSpy).toBeCalledWith({ where: { id: 1 } });
        expect(destroyStub).toBeCalledTimes(1);
        expect(retVal).toBeUndefined();
    });
});
