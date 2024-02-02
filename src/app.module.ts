import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongodb from 'config/mongodb.config';
import { AuthModule } from 'auth/auth.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessageProducersModule } from './message-producers/message-producers.module';
import jwt from 'config/jwt.config';
import rabbitmq from 'config/rabbitmq.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongodb, jwt, rabbitmq],
    }),
    UsersModule,
    AuthModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('mongodb'),
    }),
    ConversationsModule,
    MessageProducersModule,
  ],
})
export class AppModule {}
