import { ExtendedMessage } from "@/api/chats/types";
import { Socket } from "socket.io-client";
import Realm from "realm";

export class MessageService {
  static realm: Realm | null = null;
  // static async initialize() {
  //   this.realm = await Realm.open({
  //     schema: [MessageSchema],
  //     schemaVersion: 1,
  //   } as Realm.Configuration);
  // }

  static initialize(realmInstance: Realm) {
    this.realm = realmInstance;
  }

  private static getRealm(): Realm {
    console.log(this.realm);
    if (!this.realm) {
      throw new Error(
        "Realm not initialized. Call MessageService.initialize() first."
      );
    }
    return this.realm;
  }

  static saveMessage(chatId: string, message: ExtendedMessage) {
    const realm = this.getRealm();
    realm.write(() => {
      realm.create("Message", {
        ...message,
        conversationId: chatId,
        localId: message.localId || Date.now().toString(),
      });
    });
  }

  static getMessages(chatId: string): ExtendedMessage[] {
    const realm = this.getRealm();
    return Array.from(
      realm
        .objects<ExtendedMessage>("Message")
        .filtered("chatId == $0", chatId)
        .sorted("createdAt", true)
    );
  }

  static updateMessageStatus(
    messageId: string,
    status: "sent" | "delivered" | "read"
  ) {
    const realm = this.getRealm();
    const message = realm.objectForPrimaryKey("Message", messageId);
    if (message) {
      realm.write(() => {
        message.deliveryStatus = status;
      });
    }
  }

  static async syncMessages(chatId: string, lastSyncTimestamp: number) {
    try {
      // Fetch new messages from server since last sync
      // this.realm?.write(() => {
      //   newMessages.forEach(message => {
      //     this.realm?.write('Message')
      //   })
      // })
    } catch (error) {
      console.error("Sync failed:", error);
    }

    // const messages = this.getMessages(chatId);
    // const newMessages = messages.filter(
    //   (message) => message.createdAt.getTime() > lastSyncTimestamp
    // );
  }

  static queueMessage(message: ExtendedMessage) {
    const realm = this.getRealm();
    realm.write(() => {
      this.realm!.create("Message", {
        ...message,
        deliveryStatus: "pending",
        isQueued: true,
      });
    });
  }

  static async processQueueMessages(socket: Socket) {
    const realm = this.getRealm();
    const queuedMessages = realm
      .objects("Message")
      .filtered("isQueued == true");
    for (const message of queuedMessages) {
      try {
        // await this.sendMessage(socket, message);
        realm.write(() => {
          message.isQueued = false;
          message.deliveryStatus = "sent";
        });
      } catch (error) {
        console.error("Failed to send queued messages:", error);
      }
    }
  }
}
