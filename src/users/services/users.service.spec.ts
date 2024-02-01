import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { CreateUserDTO } from '../dto/create-user.dto';
import { User } from '../schemas/user.schema';
import mongoose, { Document, Model, Query } from 'mongoose';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const users = [
        {
          _id: new mongoose.Types.ObjectId(),
          username: 'user1',
          password: 'hashedPassword1',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          username: 'user2',
          password: 'hashedPassword2',
        },
      ];

      jest.spyOn(userModel, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(users),
      } as unknown as Query<User[], User, object>);

      const result = await service.findAll();

      expect(userModel.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDTO: CreateUserDTO = {
        username: 'testuser',
        password: 'testpassword',
      };

      const salt = 'mockedSalt';
      const hash = 'mockedHash';

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(salt as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hash as never);

      const _id = new mongoose.Types.ObjectId();
      const user = {
        _id,
        username: 'test name',
        password: hash,
      };

      jest.spyOn(userModel, 'create').mockReturnValueOnce({
        toObject: jest.fn().mockReturnValueOnce(user),
      } as unknown as Promise<(Document<unknown, object, User> & User & Required<{ _id: mongoose.Types.ObjectId }>)[]>);

      const result = await service.create(createUserDTO);

      expect(userModel.create).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'mockedHash',
      });
      expect(result).toEqual({ _id, username: 'test name' });
    });
  });

  describe('findOneByUsername', () => {
    it('should find one user by username without password', async () => {
      const _id = new mongoose.Types.ObjectId();
      const user = { _id, username: 'testuser', password: 'testpassword' };

      const spyFindOne = jest.spyOn(userModel, 'findOne');
      const mockQuery: Partial<Query<any, any, any>> = {
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(user),
      };
      spyFindOne.mockImplementationOnce(
        () => mockQuery as Query<any, any, any>,
      );

      const result = await service.findOneByUsername('testuser');
      expect(spyFindOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(mockQuery.select).toHaveBeenCalledWith('-password');
      expect(mockQuery.exec).toHaveBeenCalled();

      expect(result.username).toEqual('testuser');
    });

    it('should find one user by username with password', async () => {
      const _id = new mongoose.Types.ObjectId();
      const user = { _id, username: 'testuser', password: 'testpassword' };

      const spyFindOne = jest.spyOn(userModel, 'findOne');
      const mockQuery: Partial<Query<any, any, any>> = {
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(user),
      };
      spyFindOne.mockImplementationOnce(
        () => mockQuery as Query<any, any, any>,
      );

      const result = await service.findOneByUsername('testuser', true);
      expect(spyFindOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(mockQuery.select).toHaveBeenCalledWith('+password');
      expect(mockQuery.exec).toHaveBeenCalled();

      expect(result.username).toEqual('testuser');
    });
  });
});
