import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongodb from 'config/mongodb';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongodb],
    }),
    UsersModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('mongodb'),
    }),
  ],
})
export class AppModule {}
