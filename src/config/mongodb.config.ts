import { registerAs } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config: MongooseModuleFactoryOptions = {
  uri: process.env.MONGODB_URI,
};

export default registerAs('mongodb', () => config);
