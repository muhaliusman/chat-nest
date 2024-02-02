import { Test, TestingModule } from '@nestjs/testing';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ProducersService } from './producers.service';

describe('ProducersService', () => {
  let service: ProducersService;
  let amqpConnectionMock: Partial<AmqpConnection>;

  beforeEach(async () => {
    amqpConnectionMock = {
      publish: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        {
          provide: AmqpConnection,
          useValue: amqpConnectionMock,
        },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessageToBroker', () => {
    it('should publish message to the specified routing key', async () => {
      const routingKey = 'test.routing.key';
      const payload = { key: 'value' };

      await service.sendMessageToBroker(routingKey, payload);

      // Assert that publish is called with the correct arguments
      expect(amqpConnectionMock.publish).toHaveBeenCalledWith(
        'events',
        routingKey,
        payload,
      );
    });
  });
});
