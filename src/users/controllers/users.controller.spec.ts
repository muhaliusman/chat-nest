import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserDTO } from '../dto/create-user.dto';
import { ResponseHelper } from 'helpers/response.helper';
import { Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let userModel: Model<User>;

  beforeEach(async () => {
    userModel = {} as Model<User>;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDTO: CreateUserDTO = {
        username: 'test',
        password: 'test',
      };
      const userMock = { _id: new mongoose.Types.ObjectId(), username: 'test', password: 'hashedPassword' };

      jest.spyOn(service, 'create').mockResolvedValue(userMock);

      const response = await controller.create(createUserDTO, {} as Response);

      expect(response).toEqual(
        ResponseHelper.success('User created successfully', userMock),
      );
    });

    it('should handle errors during user creation', async () => {
      const createUserDTO: CreateUserDTO = {
        username: 'test',
        password: 'test',
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Mocked error'));

      const res: Partial<Response> = { status: jest.fn() };
      const response = await controller.create(createUserDTO, res as Response);

      expect(response).toEqual(
        ResponseHelper.error(res as Response, new Error('Mocked error')),
      );
    });
  });

  describe('findAll', () => {
    it('should retrieve all users', async () => {
      const usersMock = [
        {
          _id: new mongoose.Types.ObjectId(),
          username: 'test',
          password: 'test',
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(usersMock);

      const response = await controller.findAll({} as Response);

      expect(response).toEqual(
        ResponseHelper.success('Users retrieved successfully', usersMock),
      );
    });

    it('should handle errors during user retrieval', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(new Error('Mocked error'));

      const res: Partial<Response> = { status: jest.fn() };
      const response = await controller.findAll(res as Response);

      expect(response).toEqual(
        ResponseHelper.error(res as Response, new Error('Mocked error')),
      );
    });
  });
});
