import { ExtendedMessage } from "@/api/chats/types";
import { BSON } from "realm";

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
  lastSyncTimestamp?: Date;

  static schema: Realm.ObjectSchema = {
    name: "Message",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      conversationId: "string",
      content: "string",
      createdAt: "date",
      deliveryStatus: { type: "string", default: "pending" },
      sender: "string",
      receiver: "string",
      isQueued: { type: "bool", default: false },
      messageId: "string?",
      lastSyncTimestamp: "date?",
    },
  };
}
