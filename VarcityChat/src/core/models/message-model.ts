import { ExtendedMessage } from "@/api/chats/types";
import Realm, { BSON } from "realm";

export class ReplySchema extends Realm.Object {
  messageId!: string;
  content!: string;
  sender?: string;
  receiver?: string;

  static schema: Realm.ObjectSchema = {
    name: "Reply",
    embedded: true,
    properties: {
      messageId: "string",
      content: "string",
      sender: "string",
      receiver: "string",
    },
  };
}

export class MessageSchema extends Realm.Object<ExtendedMessage> {
  _id!: BSON.ObjectID;
  conversationId!: string;
  content!: string;
  createdAt?: Date;
  deliveryStatus!: "pending" | "sent" | "delivered" | "read" | "failed";
  sender!: string;
  receiver!: string;
  isQueued!: boolean;
  mediaUrls?: string[];
  audio?: string;
  localSequence?: number;
  serverId?: string;
  serverSequence?: number;
  isArchived?: boolean;
  lastSyncTimestamp?: Date;
  reply?: ReplySchema;

  static schema: Realm.ObjectSchema = {
    name: "Message",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      conversationId: { type: "string", indexed: true },
      content: "string",
      createdAt: "date?",
      deliveryStatus: { type: "string", default: "pending" },
      sender: "string",
      receiver: "string",
      mediaUrls: { type: "list", objectType: "string", optional: true },
      audio: { type: "string", optional: true },
      isQueued: { type: "bool", default: false },
      localSequence: { type: "int", optional: true, indexed: true },
      serverSequence: { type: "int", optional: true, indexed: true },
      serverId: { type: "string", optional: true, indexed: true },
      isArchived: { type: "bool", default: false },
      lastSyncTimestamp: { type: "date", optional: true },
      reply: "Reply?",
    },
  };
}
