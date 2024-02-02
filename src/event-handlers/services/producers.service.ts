import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProducersService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async sendMessageToBroker(routingKey: string, payload: object) {
    return this.amqpConnection.publish('events', routingKey, payload);
  }
}
