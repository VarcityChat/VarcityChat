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
  localSequence?: number;
  serverId?: string;
  serverSequence?: number;
  isArchived?: boolean;
  lastSyncTimestamp?: Date;

  static schema: Realm.ObjectSchema = {
    name: "Message",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      conversationId: { type: "string", indexed: true },
      content: "string",
      createdAt: { type: "date" },
      deliveryStatus: { type: "string", default: "pending" },
      sender: "string",
      receiver: "string",
      isQueued: { type: "bool", default: false },
      localSequence: { type: "int", optional: true, indexed: true },
      serverSequence: { type: "int", optional: true, indexed: true },
      serverId: { type: "string", optional: true, indexed: true },
      isArchived: { type: "bool", default: false },
      lastSyncTimestamp: { type: "date", optional: true },
    },
  };
}
