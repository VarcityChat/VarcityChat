import { ExtendedMessage } from "@/api/chats/types";
import Realm, { BSON } from "realm";

export class MessageSchema extends Realm.Object<ExtendedMessage> {
  _id!: BSON.ObjectID;
  conversationId!: string;
  content!: string;
  createdAt!: Date;
  deliveryStatus!: "pending" | "sent" | "delivered" | "read";
  sender!: string;
  receiver!: string;
  isQueued!: boolean;
  messageId?: string;
  isArchived?: boolean;
  lastSyncTimestamp?: Date;

  static schema: Realm.ObjectSchema = {
    name: "Message",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      conversationId: { type: "string", indexed: true },
      content: "string",
      createdAt: { type: "date", indexed: true },
      deliveryStatus: { type: "string", default: "pending" },
      sender: "string",
      receiver: "string",
      isQueued: { type: "bool", default: false },
      messageId: { type: "string", optional: true, indexed: true },
      isArchived: { type: "bool", default: false },
      lastSyncTimestamp: { type: "date", optional: true },
    },
  };
}
