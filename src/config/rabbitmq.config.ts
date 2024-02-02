import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config = {
  urls: [process.env.RABBITMQ_URL],
  queue: process.env.RABBITMQ_QUEUE_NAME,
  noAck: false,
  queueOptions: {
    durable: true,
  },
};

export default registerAs('rabbitmq', () => config);
