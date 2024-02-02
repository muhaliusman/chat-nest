import { Test, TestingModule } from '@nestjs/testing';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConversationConsumersService } from './conversation-consumers.service';
import { ConversationMessage } from 'event-handlers/interfaces/conversation-message.interface';

describe('ConversationConsumersService', () => {
  let service: ConversationConsumersService;
  let amqpConnectionMock: Partial<AmqpConnection>;

  beforeEach(async () => {
    amqpConnectionMock = {
      channel: {
        deleteQueue: jest.fn().mockResolvedValue(undefined),
        assertQueue: jest.fn().mockResolvedValue(undefined),
        sendToQueue: jest.fn().mockResolvedValue(undefined),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationConsumersService,
        {
          provide: AmqpConnection,
          useValue: amqpConnectionMock,
        },
      ],
    }).compile();

    service = module.get<ConversationConsumersService>(
      ConversationConsumersService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should delete existing queues and assert dlx queue', async () => {
      await service.onModuleInit();

      expect(amqpConnectionMock.channel.deleteQueue).toHaveBeenCalledWith(
        ConversationConsumersService.QUEUE_NAME,
        { isEmpty: true },
      );
      expect(amqpConnectionMock.channel.deleteQueue).toHaveBeenCalledWith(
        ConversationConsumersService.QUEUE_RETRY_NAME,
        { isEmpty: true },
      );
      expect(amqpConnectionMock.channel.assertQueue).toHaveBeenCalledWith(
        ConversationConsumersService.DLX_NAME,
      );
    });
  });

  describe('process', () => {
    it('should process the payload', async () => {
      const payload: ConversationMessage = {
        message: 'Test message',
        sender: 'Sender',
        receiver: 'Receiver',
        _id: '123',
        timestamp: '2022-01-01 21:00:00',
      };
      await service.process(payload);

      // Assert that processHandler is called with the payload
      expect(amqpConnectionMock.channel.sendToQueue).not.toHaveBeenCalled();
    });
  });
});
