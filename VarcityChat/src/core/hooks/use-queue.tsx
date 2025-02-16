import { useCallback } from "react";
import { Socket } from "socket.io-client";
import { useRealm } from "@realm/react";
import { MessageSchema } from "../models/message-model";

export const useQueue = () => {
  const realm = useRealm();

  const processQueuedMessages = useCallback(
    (socket: Socket | null) => {
      const queuedMessages = realm
        .objects<MessageSchema>("Message")
        .filtered("isQueued == true")
        .sorted("createdAt");

      console.log("\nPROCESSING QUEUED MESSAGES:", queuedMessages.length);
      queuedMessages.forEach((message) => console.log(message.content));

      queuedMessages.forEach((message) => {
        socket?.emit(
          "new-message",
          {
            content: message.content,
            receiver: message.receiver,
            sender: message.sender,
            conversationId: message.conversationId,
            localId: message._id,
          },
          (ack: { success: boolean; messageId: string }) => {
            if (ack.success) {
              realm.write(() => {
                message.isQueued = false;
                message.deliveryStatus = "sent";
                message.messageId = ack.messageId;
              });
            }
          }
        );
      });
    },
    [realm]
  );

  return { processQueuedMessages };
};
