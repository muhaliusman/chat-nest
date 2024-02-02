import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config: RabbitMQConfig = {
  uri: [process.env.RABBITMQ_URI],
  exchanges: [
    {
      name: 'events',
      type: 'topic',
    },
  ],
};

export default registerAs('rabbitmq', () => config);
