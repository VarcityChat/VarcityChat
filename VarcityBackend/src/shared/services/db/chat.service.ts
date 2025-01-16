import { IConversationDocument } from '@chat/interfaces/conversation.interface';
import { IMessageDocument } from '@chat/interfaces/message.interface';

class ChatService {
  public async initializeConversation(): Promise<IConversationDocument> {}

  public async getConversation(): Promise<IConversationDocument | null> {}

  public async getConversationList(): Promise<IConversationDocument[]> {}

  public async getMessages(): Promise<IMessageDocument[]> {}
}

export const chatService: ChatService = new ChatService();
