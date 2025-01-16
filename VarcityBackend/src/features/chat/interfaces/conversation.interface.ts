import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface IConversationDocument extends Document {
  _id: string | ObjectId;
  user1: string | ObjectId;
  user2: string | ObjectId;
  lastMessage: string | null;
  lastMessageTimestamp: Date | null;
  unreadCountUser1: number;
  unreadCountUser2: number;
}
