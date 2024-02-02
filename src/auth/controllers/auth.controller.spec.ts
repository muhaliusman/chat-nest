import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { ResponseHelper } from 'helpers/response.helper';
import { Response } from 'express';
import { Types } from 'mongoose';

describe('AuthController', () => {
  let authController: AuthController;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authServiceMock = module.get(AuthService);
  });

  describe('signIn', () => {
    it('should call authService.signIn with the correct parameters and return success response', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'password' };
      const expectedUser = {
        _id: new Types.ObjectId(),
        username: 'mockedUsername',
      };
      const authServiceSpy = jest
        .spyOn(authServiceMock, 'signIn')
        .mockResolvedValue({ access_token: 'mockedToken', user: expectedUser });

      const res: Partial<Response> = { status: jest.fn() };
      const result = await authController.signIn(loginDto, res as Response);

      expect(authServiceSpy).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(
        ResponseHelper.success('User logged in successfully', {
          access_token: 'mockedToken',
          user: expectedUser,
        }),
      );
    });

    it('should return error response if authService.signIn throws an error', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'password' };
      const error = new Error('Test error');
      jest.spyOn(authServiceMock, 'signIn').mockRejectedValue(error);

      const res: Partial<Response> = { status: jest.fn() };
      const result = await authController.signIn(loginDto, res as Response);

      expect(result).toEqual(ResponseHelper.error(res as Response, error));
    });
  });
});
