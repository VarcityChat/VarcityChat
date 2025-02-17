import { ExtendedMessage, IChatAck } from "@/api/chats/types";
import { useChats } from "./use-chats";
import { useSocket } from "@/context/SocketContext";
import { useRealm } from "@realm/react";
import { BSON } from "realm";
import { useCallback } from "react";
import { MessageSchema } from "../models/message-model";
import { axiosApiClient } from "@/api/api";

export const useChatMessages = () => {
  const { updateChatOrder } = useChats();
  const { socket, isConnected } = useSocket();
  const realm = useRealm();

  const deleteAllMessages = useCallback(() => {
    realm.write(() => {
      realm.delete(realm.objects("Message"));
    });
  }, [realm]);

  const syncMessagesFromBackend = useCallback(
    async (conversationId: string) => {
      const lastServerMessageSequence = realm
        .objects<MessageSchema>("Message")
        .filtered("conversationId = $0", conversationId)
        .max("serverSequence");

      // Get messages from server since last sync
      try {
        const response = await axiosApiClient.get<{
          messages: ExtendedMessage[];
        }>(
          `/chat/${conversationId}/messages/sequence?sequence=${lastServerMessageSequence}`
        );
        console.log("SYNC MESSAGES FROM BACKEND:", response.data);

        if (
          response.data &&
          response.data?.messages &&
          response.data?.messages?.length
        ) {
          const serverMessages = response.data?.messages;

          // sort messages in ascending sequence
          serverMessages.sort((a, b) => a.sequence - b.sequence);

          for (const message of serverMessages) {
            const localMessage = realm.objectForPrimaryKey<MessageSchema>(
              "Message",
              new BSON.ObjectId(message.localId)
            );

            if (localMessage) {
              localMessage.serverSequence = Number(message.sequence);
              localMessage.localSequence = Number(message.sequence);
              localMessage.lastSyncTimestamp = new Date();
            } else {
              realm.write(() => {
                realm.create<MessageSchema>("Message", {
                  _id: new BSON.ObjectID(),
                  conversationId: message.conversationId,
                  deliveryStatus: "sent",
                  content: message.content,
                  sender: message.sender,
                  receiver: message.receiver,
                  serverId: message._id,
                  serverSequence: message.sequence,
                  localSequence: message.sequence,
                  createdAt: message.createdAt,
                });
              });
            }
          }
        }
      } catch (error) {
        console.log("ERROR OCCURRED FETCHING MESSAGES:", error);
      }
    },
    [realm]
  );

  const addMessageToLocalRealm = useCallback(
    (message: ExtendedMessage) => {
      // Check if message with the same localId exists
      const messageExists = realm
        .objects("Message")
        .filtered(`serverId == $0`, message._id);

      if (!messageExists.length) {
        // Get the highest local sequence
        const lastMessage = realm
          .objects<MessageSchema>("Message")
          .filtered("conversationId == $0", message.conversationId)
          .sorted("localSequence", true)[0];

        const localSequence = (lastMessage?.localSequence || 0) + 1;

        realm.write(() => {
          realm.create("Message", {
            _id: new BSON.ObjectID(),
            content: message.content,
            createdAt: message.createdAt,
            sender: message.sender,
            receiver: message.receiver,
            conversationId: message.conversationId,
            deliveryStatus: "sent",
            serverId: message._id,
            serverSequence: message.sequence,
            localSequence,
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
      serverId: string,
      serverSequence: number,
      messageCreatedAt: Date
    ) => {
      realm.write(() => {
        const message = realm
          .objects<MessageSchema>("Message")
          .filtered("_id == $0", messageLocalId)[0];
        if (message) {
          message.deliveryStatus = status;
          message.serverId = serverId;
          message.serverSequence = Number(serverSequence);
          message.lastSyncTimestamp = new Date();
        }
      });
    },
    [realm]
  );

  const syncMessage = async (localId: BSON.ObjectID) => {
    const message = realm.objectForPrimaryKey<MessageSchema>(
      "Message",
      localId
    );
    if (!message || message.deliveryStatus === "sent") return;

    try {
      await socket?.emit(
        "new-message",
        {
          conversationId: message.conversationId,
          content: message.content,
          sender: message.sender,
          receiver: message.receiver,
          localId,
          localSequence: message.localSequence,
        },
        (ack: IChatAck) => {
          if (ack.success) {
            realm.write(() => {
              message.deliveryStatus = "sent";
              message.serverId = ack.messageId;
              message.serverSequence = Number(ack.messageSequence);
              message.lastSyncTimestamp = new Date();
            });
          }
        }
      );
    } catch (error) {}
  };

  const sendMessage = useCallback(
    async (message: ExtendedMessage, chatId: string) => {
      // generate a new local id for realm
      const localId = new BSON.ObjectID();
      const createdAt = new Date();

      // Get the highest local sequence
      const lastMessage = realm
        .objects<MessageSchema>("Message")
        .filtered("conversationId == $0", chatId)
        .sorted("localSequence", true)[0];

      const localSequence = (lastMessage?.localSequence || 0) + 1;

      // optimistic update
      realm.write(() => {
        realm.create<MessageSchema>("Message", {
          ...message,
          _id: localId,
          conversationId: chatId,
          deliveryStatus: "pending",
          createdAt,
          isQueued: !isConnected,
          localSequence,
        });
      });

      updateChatOrder({
        conversationId: chatId,
        content: message.content,
        createdAt,
      });

      if (isConnected && socket) {
        // send the message content and local id to the server
        syncMessage(localId);
      } else {
        // TODO: queue message if there is no internet connection
        console.log("QUEUING MESSAGE:", message);
        // MessageService.queueMessage(newMessage);
      }
    },
    [realm, socket, isConnected, updateChatOrder]
  );

  return {
    sendMessage,
    addMessageToLocalRealm,
    deleteAllMessages,
    syncMessagesFromBackend,
  };
};
