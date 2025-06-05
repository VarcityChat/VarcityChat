import { IMessage } from "react-native-gifted-chat";
import { EntityId } from "@reduxjs/toolkit";

export type DELIVERY_STATUSES =
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "pending";

// Extend GiftedChat's IMessage with our custom field
export interface ExtendedMessage extends IMessage {
  _id: string;
  conversationId: string;
  deliveryStatus: DELIVERY_STATUSES;
  localId?: string; // For optimistic updates
  deliveredAt?: number;
  readAt?: number;
  createdAt: Date;
  sender: string;
  receiver: string;
  content?: string;
  mediaUrls?: string[];
  audio?: string;
  localSequence: number;
  sequence: number;
  mediaType?: "audio" | "video" | "image";
  reply?: {
    messageId: string;
    content: string;
    sender: string;
    receiver: string;
  };
}

export interface Message {
  _id: EntityId;
  chatId: string;
  from: string;
  text: string;
  createdAt: Date;
}

export interface IChatUser {
  _id: string;
  firstname: string;
  lastname: string;
  images: string[];
  audio?: string;
}
export interface IChat {
  _id: string;
  user1: IChatUser;
  user2: IChatUser;
  lastMessage: Partial<ExtendedMessage>;
  lastMessageTimestamp: string | Date;
  unreadCountUser1: number;
  unreadCountUser2: number;
  status: "pending" | "rejected" | "accepted";
  isOnline: boolean;
  lastSeen: string;
}

export interface IUpdateChatRequest {
  conversationId: string;
}

export interface IUserStatusChanged {
  userId: string;
  status: "online" | "offline";
  lastSeen: string;
}

export interface IChatAck {
  success: boolean;
  serverId: string;
  localId: string;
  serverSequence: number;
  messageCreatedAt: Date;
}
