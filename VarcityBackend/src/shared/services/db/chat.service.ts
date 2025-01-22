import { IMessageData } from '@chat/interfaces/chat.interface';
import { IMessageDocument, IConversationDocument } from '@chat/interfaces/chat.interface';
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
    let conversation: IConversationDocument | null = await ConversationModel.findOne(query);
    if (!conversation) {
      conversation = await ConversationModel.create({ user1: currentUserId, user2: targetUserId });
    }
    return conversation;
  }

  public async getConversationById(conversationId: string): Promise<IConversationDocument | null> {
    return await ConversationModel.findById(conversationId);
  }

  public async increaseUnreadMessageCount(sender: string, receiver: string): Promise<void> {
    const query = {
      $or: [
        { user1: sender, user2: receiver },
        { user1: receiver, user2: sender }
      ]
    };
    const conversation = await ConversationModel.findOne(query);
    if (conversation) {
      if (sender == conversation.user1) {
        conversation.unreadCountUser2++;
      } else {
        // That means the sender is the second user
        conversation.unreadCountUser1++;
      }
      await conversation.save();
    }
  }

  public async addMessageToDB(message: IMessageData): Promise<void> {
    await MessageModel.create(message);
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
