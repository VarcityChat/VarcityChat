import { IMessage } from "react-native-gifted-chat";
import { EntityId } from "@reduxjs/toolkit";

// Extend GiftedChat's IMessage with our custom field
export interface ExtendedMessage extends IMessage {
  _id: string;
  chatId: string;
  conversationId: string;
  deliveryStatus: "sent" | "delivered" | "read" | "failed";
  localId?: string; // For optimistic updates
  deliveredAt?: number;
  reatAt?: number;
  createdAt: Date;
  sender: string;
  receiver: string;
  content?: string;
  mediaUrl?: string[];
  mediaType?: "audio" | "video" | "image";
  reply?: {
    messageId: string;
    content: string;
    sender: string;
    receiver: string;
    mediaUrl: string;
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
}
export interface IChat {
  _id: string;
  user1: IChatUser;
  user2: IChatUser;
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCountUser1: number;
  unreadCountUser2: number;
  status: "pending" | "rejected" | "accepted";
}

export interface IUpdateChatRequest {
  conversationId: string;
}
