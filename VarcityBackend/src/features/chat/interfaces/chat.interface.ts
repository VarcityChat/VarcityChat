import { IUserDocument } from '@user/interfaces/user.interface';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface IConversationDocument extends Document {
  _id: string | ObjectId;
  user1: string | ObjectId | IUserDocument;
  user2: string | ObjectId | IUserDocument;
  lastMessage: string | ObjectId | IMessageDocument | null;
  lastMessageTimestamp: Date | null;
  unreadCountUser1: number;
  unreadCountUser2: number;
  status: CONVERSATION_STATUS.pending | CONVERSATION_STATUS.accepted | CONVERSATION_STATUS.rejected;
  messageSequence: number;
}

export type PopulatedConversation = Omit<
  IConversationDocument,
  'user1' | 'user2' | 'lastMessage'
> & {
  user1: IUserDocument;
  user2: IUserDocument;
  lastMessage: IMessageDocument | null;
};

export interface ILeanConversation {
  _id: string;
  user1: string;
  user2: string;
  status: CONVERSATION_STATUS.pending | CONVERSATION_STATUS.accepted | CONVERSATION_STATUS.rejected;
}

export interface IMessageDocument extends Document {
  _id: string | ObjectId;
  conversationId: string | ObjectId;
  sender: string | ObjectId;
  receiver: string | ObjectId;
  content?: string;
  audio?: string;
  mediaUrls?: string[];
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
  updatedAt: Date;
  localId: string;
  sequence: number;
  localSequence: number;
}

export interface IMessageData {
  conversationId: string | ObjectId;
  sender: string | ObjectId;
  receiver: string | ObjectId;
  content?: string;
  mediaUrl?: string[];
  audio?: string;
  mediaType?: MEDIA_TYPE.image | MEDIA_TYPE.audio | MEDIA_TYPE.video;
  reply?: {
    messageId: ObjectId;
    content: string;
    sender: ObjectId;
    receiver: ObjectId;
    mediaType: MEDIA_TYPE;
    mediaUrl: string;
  };
  conversationStatus:
    | CONVERSATION_STATUS.pending
    | CONVERSATION_STATUS.accepted
    | CONVERSATION_STATUS.rejected;
  createdAt?: Date;
  localId: string;
  sequence: number;
  localSequence: number;
}

export interface ISenderReceiver {
  sender: string | ObjectId;
  receiver: string | ObjectId;
}

export interface IUpdateConversation {
  sender: string | ObjectId;
  receiver: string | ObjectId;
  lastMessageTimestamp: Date;
  lastMessage: string;
}

export interface IMarkConversationAsRead {
  conversationId: string | ObjectId;
  userId: string | ObjectId;
  user1Id: string | ObjectId;
  user2Id: string | ObjectId;
}

export interface ITyping {
  conversationId: string;
  userId: string;
  receiverId: string;
}

export interface IMessageJob {
  value: string | IMessageData | IMessageDocument;
}

export interface IConversationJob {
  value: string | ISenderReceiver | IUpdateConversation;
}

export enum MEDIA_TYPE {
  image = 'image',
  audio = 'audio',
  video = 'video'
}

export enum CONVERSATION_STATUS {
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected'
}
