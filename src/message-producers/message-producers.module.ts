import { Module } from '@nestjs/common';
import { MessageProducersService } from './services/message-producers.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'CONVERSATION_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.RMQ,
            options: configService.get('rabbitmq'),
          };
        },
      },
    ]),
  ],
  providers: [MessageProducersService],
  exports: [MessageProducersService],
})
export class MessageProducersModule {}
