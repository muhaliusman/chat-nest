import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConversationsService } from './conversations.service';
import { Conversation } from '../schemas/conversation.schema';
import { Message } from '../schemas/message.schema';
import { Types } from 'mongoose';

class MockConversationModel {
  static findOne = jest.fn();
  save = jest.fn().mockReturnValue(this);

  constructor(data: any) {
    Object.assign(this, data);
  }
}

class MockMessageModel {
  constructor(data: any) {
    Object.assign(this, data);
  }
}

describe('ConversationsService', () => {
  let service: ConversationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        {
          provide: getModelToken(Conversation.name),
          useValue: MockConversationModel,
        },
        {
          provide: getModelToken(Message.name),
          useValue: MockMessageModel,
        },
      ],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOrCreateConversation', () => {
    it('should find an existing conversation', async () => {
      const mockInstance = new MockConversationModel({ _id: '123' });
      MockConversationModel.findOne.mockResolvedValueOnce(mockInstance);

      const conversation = await service.findOrCreateConversation([
        'member1',
        'member2',
      ]);

      expect(conversation._id).toBe('123');
      expect(MockConversationModel.findOne).toHaveBeenCalledWith({
        members: ['member1', 'member2'],
      });
      expect(mockInstance.save).not.toHaveBeenCalled();
    });

    it(`should create a new conversation if not found`, async () => {
      MockConversationModel.findOne.mockResolvedValueOnce(null);

      const result = await service.findOrCreateConversation([
        'member1',
        'member2',
      ]);

      expect(MockConversationModel.findOne).toHaveBeenCalledWith({
        members: ['member1', 'member2'],
      });
      expect(result.members).toEqual(['member1', 'member2']);
    });
  });

  describe('addMessage', () => {
    it('should add a message to the conversation', async () => {
      const messageData = {
        message: 'Hello, world!',
        sender: new Types.ObjectId(),
      };
      const conversation = new MockConversationModel({
        messages: [],
        total_messages: 0,
      });

      const newMessage = await service.addMessage(
        conversation as unknown as Conversation,
        messageData,
      );

      expect(newMessage).toEqual(expect.objectContaining(messageData));
    });
  });
});
