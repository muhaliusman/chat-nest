import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Request,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'auth/guards/auth.guard';
import { CreateConversationDTO } from 'conversations/dto/create-conversation.dto';
import { ConversationsService } from 'conversations/services/conversations.service';
import { Response } from 'express';
import { ResponseHelper, ResponseObject } from 'helpers/response.helper';
import { Types } from 'mongoose';
import { UsersService } from 'users/services/users.service';

@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly conversationService: ConversationsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async createConversation(
    @Body() createConversation: CreateConversationDTO,
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseObject> {
    try {
      const toUserId = createConversation.userId;
      const currentUserId: string = req.user.sub;
      const currentUserObjectId = new Types.ObjectId(currentUserId);
      const toUser = await this.usersService.findOneById(toUserId);

      if (!toUser) {
        throw new NotFoundException('User not found');
      }

      const conversation =
        await this.conversationService.findOrCreateConversation([
          currentUserId,
          toUserId,
        ]);
      const messageData = {
        message: createConversation.message,
        sender: currentUserObjectId,
        receiver: new Types.ObjectId(toUserId)
      };

      const message = await this.conversationService.addMessage(
        conversation,
        messageData,
      );

      return ResponseHelper.success('Message sent successfully', message);
    } catch (error: unknown) {
      return ResponseHelper.error(res, error);
    }
  }
}
