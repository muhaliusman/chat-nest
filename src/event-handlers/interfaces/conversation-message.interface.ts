export interface ConversationMessage {
  _id: string;
  sender: string;
  receiver: string;
  message: string;
  timestamp: string;
}

export interface RetryConversationMessage extends ConversationMessage {
  retry: number;
}
