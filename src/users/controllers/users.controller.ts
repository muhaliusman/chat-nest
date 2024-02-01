import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service';
import { ResponseHelper } from 'helpers/response.helper';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createUserDTO: CreateUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = await this.usersService.create(createUserDTO);

      return ResponseHelper.success('User created successfully', user);
    } catch (error: unknown) {
      return ResponseHelper.error(res, error);
    }
  }

  @Get()
  async findAll(@Res({ passthrough: true }) res: Response) {
    try {
      const users = await this.usersService.findAll();
      return ResponseHelper.success('Users retrieved successfully', users);
    } catch (error: unknown) {
      return ResponseHelper.error(res, error);
    }
  }
}
