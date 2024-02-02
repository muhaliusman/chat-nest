import { Test, TestingModule } from '@nestjs/testing';
import { MessageProducersService } from './message-producers.service';

describe('MessageProducersService', () => {
  let service: MessageProducersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageProducersService,
        {
          provide: 'CONVERSATION_SERVICE',
          useValue: {
            connect: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MessageProducersService>(MessageProducersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
