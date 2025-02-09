import { ExtendedMessage } from "@/api/chats/types";
import { useChats } from "./use-chats";
import { useSocket } from "@/context/SocketContext";
import { useRealm } from "@realm/react";
import { BSON } from "realm";
import { useCallback } from "react";
import { MessageSchema } from "../models/message-model";

export const useChatMessages = () => {
  const { updateChatOrder } = useChats();
  const { socket, isConnected } = useSocket();
  const realm = useRealm();

  const deleteAllMessages = useCallback(() => {
    realm.write(() => {
      realm.delete(realm.objects("Message"));
    });
  }, [realm]);

  const addMessageToLocalRealm = useCallback(
    (message: ExtendedMessage) => {
      // Check if message with the same localId exists
      const messageExists = realm
        .objects("Message")
        .filtered(`messageId == $0`, message._id);
      console.log("\nMESSAGE EXISTS", messageExists);

      if (!!messageExists) {
        realm.write(() => {
          realm.create("Message", {
            _id: new BSON.ObjectID(),
            content: message.content,
            createdAt: message.createdAt,
            sender: message.sender,
            receiver: message.receiver,
            conversationId: message.conversationId,
            deliveryStatus: "sent",
            messageId: message._id,
          });
        });
      }
    },
    [realm]
  );

  const updateChatMessage = useCallback(
    (
      messageLocalId: BSON.ObjectID,
      status: "pending" | "sent" | "delivered",
      messageId: string
    ) => {
      realm.write(() => {
        const message = realm
          .objects<MessageSchema>("Message")
          .filtered("_id == $0", messageLocalId)[0];
        if (message) {
          message.deliveryStatus = status;
          message.messageId = messageId;
        }
      });
    },
    [realm]
  );

  const sendMessage = useCallback(
    () => async (message: ExtendedMessage, chatId: string) => {
      // generate a new local id for realm
      const localId = new BSON.ObjectID();
      const createdAt = new Date();

      console.log("\nREACHED HERE BEFORE DELAY:");

      // optimistic update
      realm.write(() => {
        realm.create("Message", {
          ...message,
          _id: localId,
          conversationId: chatId,
          deliveryStatus: "pending",
          createdAt,
        });
      });

      updateChatOrder({
        conversationId: chatId,
        content: message.content,
        createdAt,
      });

      if (isConnected && socket) {
        // send the message content and local id to the server
        socket.emit(
          "new-message",
          { ...message, localId },
          (ack: { success: boolean; messageId: string }) => {
            console.log("MESSAGE ACKNOWLEDGEMENT:", ack);
            if (ack.success) {
              updateChatMessage(localId, "sent", ack.messageId);
            }
          }
        );
      } else {
        // TODO: queue message if there is no internet connection
        console.log("QUEUING MESSAGE:", message);
        // MessageService.queueMessage(newMessage);
      }
    },
    [realm, socket, isConnected, updateChatOrder]
  );

  return { sendMessage, addMessageToLocalRealm, deleteAllMessages };
};
