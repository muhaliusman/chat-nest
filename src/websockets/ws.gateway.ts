import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WsGateway {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    const { authorization } = socket.handshake.headers;

    if (!authorization) {
      socket.disconnect();
    }

    const splitToken = authorization.split(' ');
    const token = splitToken[1] || null;

    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });
    } catch {
      socket.disconnect();
    }
  }

  sendMessage(event: string, data: any) {
    this.server.emit(event, data);
  }
}
