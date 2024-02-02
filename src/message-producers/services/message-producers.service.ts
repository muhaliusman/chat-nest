import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MessageProducersService {
  constructor(
    @Inject('CONVERSATION_SERVICE') private readonly client: ClientProxy,
  ) {
    this.client.connect();
  }

  async sendMessageToBroker(pattern: any, payload: any) {
    return await lastValueFrom(this.client.send(pattern, payload));
  }
}
