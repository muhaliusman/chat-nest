import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateConversationDTO {
  @IsNotEmpty()
  @MaxLength(500)
  message: string;

  @IsNotEmpty()
  userId: string;
}
