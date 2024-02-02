import {
  AmqpConnection,
  RabbitSubscribe,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import {
  ConversationMessage,
  RetryConversationMessage,
} from 'event-handlers/interfaces/conversation-message.interface';

@Injectable()
export class ConversationConsumersService implements OnModuleInit {
  static readonly QUEUE_NAME = 'chat.nestjs';
  static readonly QUEUE_RETRY_NAME = 'chat.nestjs.retry';
  static readonly DLX_NAME = 'chat.nestjs.dlx';
  static readonly ROUTING_KEY = 'conversation.created';

  readonly MAX_RETRY = 5;
  readonly RETRY_DELAY_MULTIPLIER = 120000;

  constructor(protected amqpConnection: AmqpConnection) {}

  async onModuleInit(): Promise<void> {
    // delete existing queue if empty to avoid error when assert new queue
    await this.amqpConnection.channel.deleteQueue(
      ConversationConsumersService.QUEUE_NAME,
      {
        isEmpty: true,
      },
    );
    await this.amqpConnection.channel.deleteQueue(
      ConversationConsumersService.QUEUE_RETRY_NAME,
      {
        isEmpty: true,
      },
    );

    // create dlx queue
    await this.amqpConnection.channel.assertQueue(
      ConversationConsumersService.DLX_NAME,
    );
  }

  @RabbitSubscribe({
    exchange: 'events',
    routingKey: ConversationConsumersService.ROUTING_KEY,
    queue: ConversationConsumersService.QUEUE_NAME,
    queueOptions: {
      deadLetterExchange: '',
      deadLetterRoutingKey: ConversationConsumersService.DLX_NAME,
    },
    errorHandler: defaultNackErrorHandler,
  })
  public async process(payload: ConversationMessage): Promise<void> {
    try {
      if (!payload.message || !payload.sender || !payload.receiver) {
        return;
      }
      await this.processHandler(payload);
    } catch (error: unknown) {
      this.sendToRetryQueue({ ...payload, ...{ retry: 0 } });
    }
  }

  @RabbitSubscribe({
    queue: ConversationConsumersService.QUEUE_RETRY_NAME,
    queueOptions: {
      deadLetterExchange: '',
      deadLetterRoutingKey: ConversationConsumersService.DLX_NAME,
    },
    errorHandler: defaultNackErrorHandler,
  })
  public async processRetry(payload: RetryConversationMessage): Promise<void> {
    try {
      await this.processHandler(payload);
    } catch (error) {
      this.sendToRetryQueue(payload);
    }
  }

  private async processHandler(payload: ConversationMessage): Promise<void> {
    console.log('Message received', payload);
  }

  private sendToRetryQueue(data: RetryConversationMessage): void | never {
    const retryData = data;
    const message = `Error after retrying ${this.MAX_RETRY} times`;

    if (retryData.retry >= this.MAX_RETRY) {
      throw new BadRequestException(data, message);
    }

    retryData.retry++;

    setTimeout(() => {
      return this.amqpConnection.channel.sendToQueue(
        ConversationConsumersService.QUEUE_RETRY_NAME,
        Buffer.from(JSON.stringify(retryData)),
      );
    }, this.RETRY_DELAY_MULTIPLIER * retryData.retry);
  }
}
