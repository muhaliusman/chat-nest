import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongodb from 'config/mongodb';
import { AuthModule } from 'auth/auth.module';
import jwt from 'config/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongodb, jwt],
    }),
    UsersModule,
    AuthModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('mongodb'),
    }),
  ],
})
export class AppModule {}
