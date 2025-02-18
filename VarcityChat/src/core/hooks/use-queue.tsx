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
        .filtered("isQueued == true");

      // group the queued messages by conversation
      const conversationIds = [
        ...new Set(queuedMessages.map((m) => m.conversationId)),
      ];

      // send the queued messages by conversation
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
              // if acknowledged from server, set the local sequence to the server sequence
              if (ack.success) {
                realm.write(() => {
                  message.isQueued = false;
                  message.deliveryStatus = "sent";
                  message.serverId = ack.serverId;
                  message.localSequence = Number(ack.serverSequence);
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
