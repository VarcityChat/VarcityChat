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

export interface IMessageDocument extends Document {
  _id: string | ObjectId;
  conversationId: string | ObjectId;
  sender: string | ObjectId;
  receiver: string | ObjectId;
  content?: string;
  mediaUrl?: string | string[];
  mediaType?: MEDIA_TYPE.image | MEDIA_TYPE.audio | MEDIA_TYPE.video;
  seenAt: Date;
  reply?: {
    messageId: ObjectId;
    content: string;
    sender: ObjectId;
    receiver: ObjectId;
    mediaType: MEDIA_TYPE;
    mediaUrl: string;
  };
  readAt?: Date;
  createdAt: Date;
}

export interface IMessageData {
  conversationId: string | ObjectId;
  sender: string | ObjectId;
  receiver: string | ObjectId;
  content?: string;
  mediaUrl?: string[];
  mediaType?: MEDIA_TYPE.image | MEDIA_TYPE.audio | MEDIA_TYPE.video;
  reply?: {
    messageId: ObjectId;
    content: string;
    sender: ObjectId;
    receiver: ObjectId;
    mediaType: MEDIA_TYPE;
    mediaUrl: string;
  };
}

export interface IMessageJob {
  value: string | IMessageData | IMessageDocument;
}

export enum MEDIA_TYPE {
  image = 'image',
  audio = 'audio',
  video = 'video'
}
