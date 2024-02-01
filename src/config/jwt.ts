import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config: JwtModuleOptions = {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: process.env.JWT_EXPIRATION,
  },
};

export default registerAs('jwt', () => config);
