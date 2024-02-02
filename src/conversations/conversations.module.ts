import { Module } from '@nestjs/common';
import { ConversationsService } from './services/conversations.service';
import { ConversationsController } from './controllers/conversations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from './schemas/conversation.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { AuthModule } from 'auth/auth.module';
import { UsersModule } from 'users/users.module';
import { MessageProducersModule } from 'message-producers/message-producers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    AuthModule,
    UsersModule,
    MessageProducersModule,
  ],
  providers: [ConversationsService],
  controllers: [ConversationsController],
})
export class ConversationsModule {}
