import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProducersService } from './services/producers.service';
import { ConversationConsumersService } from './services/conversation-consumers.service';
import { WebsocketsModule } from 'websockets/websockets.module';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get('rabbitmq'),
      inject: [ConfigService],
    }),
    WebsocketsModule,
  ],
  providers: [ConversationConsumersService, ProducersService],
  exports: [ProducersService],
})
export class EventHandlersModule {}
