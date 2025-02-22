import { CONVERSATION_STATUS, IMessageData } from '@chat/interfaces/chat.interface';
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
      conversation = await ConversationModel.create({
        user1: currentUserId,
        user2: targetUserId,
        lastMessageTimestamp: new Date()
      });
    }
    return conversation;
  }

  public async acceptConversationRequest(conversationId: string): Promise<void> {
    await ConversationModel.findByIdAndUpdate(conversationId, {
      $set: { status: CONVERSATION_STATUS.accepted }
    });
  }

  public async rejectConversationRequest(conversationId: string): Promise<void> {
    await ConversationModel.findByIdAndUpdate(conversationId, {
      $set: { status: CONVERSATION_STATUS.rejected }
    });
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

  public async updateConversationForNewMessage(
    sender: string,
    receiver: string,
    lastMessageTimestamp: Date,
    lastMessage: string
  ): Promise<void> {
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
      conversation.lastMessageTimestamp = lastMessageTimestamp;
      conversation.lastMessage = lastMessage;
      await conversation.save();
    }
  }

  public async markConversationAsReadForUser(
    conversationId: string,
    user: 'user1' | 'user2',
    user1Id: string,
    user2Id: string
  ): Promise<void> {
    if (user === 'user1') {
      await ConversationModel.findByIdAndUpdate(conversationId, {
        $set: {
          unreadCountUser1: 0
        }
      });

      // user1, then user2 should see that user1 has read his messages
      await MessageModel.updateMany(
        { conversationId, receiver: user2Id, readAt: { $exists: false } },
        { $set: { readAt: new Date() } }
      );
    } else {
      await ConversationModel.findByIdAndUpdate(conversationId, {
        $set: {
          unreadCountUser2: 0
        }
      });

      // user2, then user1 should see that user2 has read his messages
      await MessageModel.updateMany(
        { conversationId, receiver: user1Id, readAt: { $exists: false } },
        { $set: { readAt: new Date() } }
      );
    }
  }

  public async addMessageToDB(message: IMessageData): Promise<void> {
    await MessageModel.create(message);
  }

  public async getNextSequence(conversationId: string): Promise<number> {
    const result = await ConversationModel.findOneAndUpdate(
      { _id: conversationId },
      { $inc: { messageSequence: 1 } },
      { returnDocument: 'after' }
    );
    return result?.messageSequence || 0;
  }

  // public async getConversation(): Promise<IConversationDocument | null> {}

  public async getConversationList(userId: string): Promise<IConversationDocument[]> {
    const conversations: IConversationDocument[] = await ConversationModel.find({
      $or: [{ user1: userId }, { user2: userId }]
    })
      .populate('user1 user2 lastMessage')
      .sort({ lastMessageTimestamp: -1, createdAt: -1 });
    return conversations;
  }

  public async getMessages(conversationId: string, skip: number = 0): Promise<IMessageDocument[]> {
    const messages = await MessageModel.find({ conversationId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(200);
    return messages;
  }

  public async getMessagesSinceSequence(
    conversationId: string,
    sequence: number,
    skip: number = 0
  ): Promise<IMessageDocument[]> {
    const messages = await MessageModel.find({ conversationId, sequence: { $gt: sequence } })
      .sort({ sequence: 1 })
      .skip(skip)
      .limit(500);
    return messages;
  }

  public async getMessagesSince(
    conversationId: string,
    date: Date,
    skip: number = 0
  ): Promise<IMessageDocument[]> {
    const messages = await MessageModel.find({ conversationId, createdAt: { $gte: date } })
      .sort({ sequence: 1 })
      .skip(skip)
      .limit(500);
    return messages;
  }
}

export const chatService: ChatService = new ChatService();
