import { IConversationDocument } from '@chat/interfaces/conversation.interface';
import { IMessageDocument } from '@chat/interfaces/message.interface';
import { ConversationModel } from '@chat/models/conversation.model';
import { MessageModel } from '@chat/models/message.model';

class ChatService {
  public async initializeConversation(
    currentUserId: string,
    targetUserId: string
  ): Promise<IConversationDocument> {
    const query = {
      $or: [
        { user1: currentUserId, user2: targetUserId },
        { user1: targetUserId, user2: currentUserId }
      ]
    };
    const conversation = await ConversationModel.findOneAndUpdate(
      query,
      {},
      { upsert: true, new: true }
    );
    return conversation;
  }

  // public async getConversation(): Promise<IConversationDocument | null> {}

  public async getConversationList(userId: string): Promise<IConversationDocument[]> {
    const conversations: IConversationDocument[] = await ConversationModel.find({
      $or: [{ user1: userId }, { user2: userId }]
    })
      .populate('user1 user2 lastMessage.messageId')
      .sort({ lastMessageTimestamp: -1 });
    return conversations;
  }

  public async getMessages(conversationId: string, skip: number = 0): Promise<IMessageDocument[]> {
    const messages = await MessageModel.find({ conversationId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(200);
    return messages;
  }
}

export const chatService: ChatService = new ChatService();
