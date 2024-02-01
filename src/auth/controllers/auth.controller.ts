import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { ResponseHelper } from 'helpers/response.helper';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async signIn(
    @Body() loginDTO: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const response = await this.authService.signIn(loginDTO);

      return ResponseHelper.success('User logged in successfully', response);
    } catch (error: unknown) {
      return ResponseHelper.error(res, error);
    }
  }
}
