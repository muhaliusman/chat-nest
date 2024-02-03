import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from '../dto/create-user.dto';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDTO: CreateUserDTO) {
    const username = createUserDTO.username;
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDTO.password, salt);

    const user = await this.userModel.create({
      username,
      password: hash,
    });

    const createdUser = user.toObject();
    delete createdUser.password;

    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneByUsername(
    username: string,
    withPassword = false,
  ): Promise<User | null> {
    return this.userModel
      .findOne({ username })
      .select(withPassword ? '+password' : '-password')
      .exec();
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
}
