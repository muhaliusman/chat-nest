import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from 'conversations/services/conversations.service';
import { UsersService } from 'users/services/users.service';
import { CreateConversationDTO } from 'conversations/dto/create-conversation.dto';
import { NotFoundException } from '@nestjs/common';
import { ResponseHelper } from 'helpers/response.helper';
import { Model, Types } from 'mongoose';
import { Conversation } from 'conversations/schemas/conversation.schema';
import { User } from 'users/schemas/user.schema';
import { Message } from 'conversations/schemas/message.schema';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ProducersService } from 'event-handlers/services/producers.service';
import { ConversationConsumersService } from 'event-handlers/services/conversation-consumers.service';

describe('ConversationsController', () => {
  let controller: ConversationsController;
  let conversationService: ConversationsService;
  let usersService: UsersService;
  let producersService: ProducersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationsController],
      providers: [
        ConversationsService,
        UsersService,
        {
          provide: getModelToken(Conversation.name),
          useValue: {} as Model<Conversation>,
        },
        {
          provide: getModelToken(Message.name),
          useValue: {} as Model<Message>,
        },
        {
          provide: getModelToken(User.name),
          useValue: {} as Model<User>,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ProducersService,
          useValue: {
            sendMessageToBroker: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ConversationsController>(ConversationsController);
    conversationService =
      module.get<ConversationsService>(ConversationsService);
    usersService = module.get<UsersService>(UsersService);
    producersService = module.get<ProducersService>(ProducersService);
  });

  describe('createConversation', () => {
    it('should create conversation, return success response and send message to broker', async () => {
      const toUserId = new Types.ObjectId();
      const currentUserId = new Types.ObjectId();
      const createConversationDTO: CreateConversationDTO = {
        userId: toUserId.toString(),
        message: 'Hello, this is a test message',
      };

      const req = {
        user: { sub: currentUserId.toString() },
      };
      const res = {} as any;

      const findOrCreateConversationSpy = jest
        .spyOn(conversationService, 'findOrCreateConversation')
        .mockResolvedValue({
          _id: new Types.ObjectId(),
          messages: [],
          total_messages: 0,
        } as unknown as Conversation);

      const findOneByIdSpy = jest
        .spyOn(usersService, 'findOneById')
        .mockResolvedValue({ _id: toUserId, username: 'toUser' } as User);

      const message = {
        _id: new Types.ObjectId(),
        message: 'Hello, this is a test message',
        sender: currentUserId,
        receiver: toUserId,
      };

      const addMessageSpy = jest
        .spyOn(conversationService, 'addMessage')
        .mockResolvedValue(message);

      const result = await controller.createConversation(
        createConversationDTO,
        req,
        res,
      );

      expect(findOrCreateConversationSpy).toHaveBeenCalledWith([
        currentUserId.toString(),
        toUserId.toString(),
      ]);
      expect(producersService.sendMessageToBroker).toHaveBeenCalledWith(
        ConversationConsumersService.ROUTING_KEY,
        message,
      );
      expect(findOneByIdSpy).toHaveBeenCalledWith(toUserId.toString());
      expect(addMessageSpy).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: 'Message sent successfully',
        data: {
          _id: expect.any(Types.ObjectId),
          message: 'Hello, this is a test message',
          sender: expect.any(Types.ObjectId),
          receiver: expect.any(Types.ObjectId),
        },
      });
    });

    it('should throw NotFoundException if toUser is not found', async () => {
      const createConversationDTO: CreateConversationDTO = {
        userId: 'nonexistentUserId',
        message: 'Hello, this is a test message',
      };

      const req = {
        user: { sub: new Types.ObjectId().toString() },
      };

      const res: Partial<Response> = { status: jest.fn() };

      jest.spyOn(usersService, 'findOneById').mockResolvedValue(null);

      const result = await controller.createConversation(
        createConversationDTO,
        req,
        res as Response,
      );

      expect(result).toEqual(
        ResponseHelper.error(
          res as Response,
          new NotFoundException('User not found'),
        ),
      );
    });

    it('should return error response on exception', async () => {
      const toUserId = new Types.ObjectId();
      const createConversationDTO: CreateConversationDTO = {
        userId: toUserId.toString(),
        message: 'Hello, this is a test message',
      };
      const req = {
        user: { sub: new Types.ObjectId().toString() },
      };

      const res: Partial<Response> = { status: jest.fn() };

      jest
        .spyOn(usersService, 'findOneById')
        .mockResolvedValue({ _id: toUserId, username: 'toUser' } as User);
      jest
        .spyOn(conversationService, 'findOrCreateConversation')
        .mockRejectedValue(new Error('Test error'));

      const result = await controller.createConversation(
        createConversationDTO,
        req,
        res as Response,
      );

      expect(result).toEqual(
        ResponseHelper.error(res as Response, new Error('Test error')),
      );
    });
  });
});
