import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginDTO: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByUsername(
      loginDTO.username,
      true,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(loginDTO.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
