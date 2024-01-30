import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config = {
  uri: process.env.MONGODB_URI,
};

export default registerAs('mongodb', () => config);
