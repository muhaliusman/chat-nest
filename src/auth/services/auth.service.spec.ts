import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import mongoose from 'mongoose';

describe('AuthService', () => {
  let authService: AuthService;
  let usersServiceMock: jest.Mocked<UsersService>;
  let jwtServiceMock: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersServiceMock = module.get(UsersService);
    jwtServiceMock = module.get(JwtService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should throw UnauthorizedException if user is not found', async () => {
      jest
        .spyOn(usersServiceMock, 'findOneByUsername')
        .mockResolvedValue(undefined);

      await expect(
        authService.signIn({
          username: 'test',
          password: 'password',
        } as LoginDto),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const user = {
        _id: new mongoose.Types.ObjectId(),
        username: 'test',
        password: await bcrypt.hash('password', 10),
      };
      jest.spyOn(usersServiceMock, 'findOneByUsername').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        authService.signIn({
          username: 'test',
          password: 'wrongpassword',
        } as LoginDto),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should return access_token if login is successful', async () => {
      const user = {
        _id: new mongoose.Types.ObjectId(),
        username: 'test',
        password: await bcrypt.hash('password', 10),
      };
      jest.spyOn(usersServiceMock, 'findOneByUsername').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest
        .spyOn(jwtServiceMock, 'signAsync')
        .mockResolvedValue('mockedAccessToken');

      const result = await authService.signIn({
        username: 'test',
        password: 'password',
      } as LoginDto);

      expect(result).toEqual({
        access_token: 'mockedAccessToken',
        user: { _id: user._id, username: user.username },
      });
    });
  });
});
