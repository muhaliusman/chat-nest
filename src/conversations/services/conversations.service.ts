import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from '../schemas/conversation.schema';
import { Message } from '../schemas/message.schema';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async findOrCreateConversation(members: string[]): Promise<Conversation> {
    // Sort the members' IDs to ensure consistency
    const sortedMembers = members.sort();

    const existingConversation = await this.conversationModel.findOne({
      members: sortedMembers,
    });

    if (existingConversation) {
      return existingConversation;
    }

    const newConversation = new this.conversationModel({
      members: sortedMembers,
    });

    return newConversation.save();
  }

  async addMessage(
    conversation: Conversation,
    messageData: Partial<Message>,
  ): Promise<Message> {
    const newMessage = new this.messageModel(messageData);
    conversation.messages.push(newMessage);
    conversation.total_messages += 1;

    await conversation.save();

    return newMessage;
  }
}
