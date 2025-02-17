import { useCallback } from "react";
import { Socket } from "socket.io-client";
import { useRealm } from "@realm/react";
import { MessageSchema } from "../models/message-model";
import { IChatAck } from "@/api/chats/types";

export const useQueue = () => {
  const realm = useRealm();

  const processQueuedMessages = useCallback(
    async (socket: Socket | null) => {
      const queuedMessages = realm
        .objects<MessageSchema>("Message")
        .filtered("isQueued == true")
        .sorted("createdAt");

      console.log("\nPROCESSING QUEUED MESSAGES:", queuedMessages.length);
      queuedMessages.forEach((message) => console.log(message.content));

      const conversationIds = [
        ...new Set(queuedMessages.map((m) => m.conversationId)),
      ];

      for (const conversation of conversationIds) {
        const messages = queuedMessages
          .filtered("conversationId = $0", conversation)
          .sorted("localSequence");

        for (const message of messages) {
          socket?.emit(
            "new-message",
            {
              content: message.content,
              receiver: message.receiver,
              sender: message.sender,
              conversationId: message.conversationId,
              localId: message._id,
            },
            (ack: IChatAck) => {
              if (ack.success) {
                realm.write(() => {
                  message.isQueued = false;
                  message.deliveryStatus = "sent";
                  message.serverId = ack.messageId;
                  message.serverSequence = Number(ack.messageSequence);
                  message.lastSyncTimestamp = new Date();
                });
              }
            }
          );
        }
      }
    },
    [realm]
  );

  return { processQueuedMessages };
};
