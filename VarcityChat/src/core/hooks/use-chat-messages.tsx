import { ExtendedMessage, IChatAck } from "@/api/chats/types";
import { useChats } from "./use-chats";
import { useSocket } from "@/context/SocketContext";
import { useRealm } from "@realm/react";
import { BSON } from "realm";
import { useCallback, useState } from "react";
import { MessageSchema } from "../models/message-model";
import { axiosApiClient } from "@/api/api";
import { RealmObject } from "realm/dist/public-types/namespace";

export const useChatMessages = () => {
  const [isSyncing, setIsSyncing] = useState(false);
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
      // const lastServerMessageTimestamp =
      //   realm
      //     .objects<MessageSchema>("Message")
      //     .filtered("conversationId = $0", conversationId)
      //     .max("lastSyncTimestamp") ?? 0;

      const lastMessageServerSequence =
        realm
          .objects<MessageSchema>("Message")
          .filtered("conversationId = $0", conversationId)
          .max("serverSequence") ?? 1;

      // Get messages from server since last sync
      try {
        setIsSyncing(true);
        // const lastMessageDate = new Date(lastServerMessageTimestamp);

        // const apiUrl = `/chat/${conversationId}/messages/since?date=${lastMessageDate}`;
        const apiUrl = `/chat/${conversationId}/messages/sequence?sequence=${lastMessageServerSequence}`;

        const response = await axiosApiClient.get<{
          messages: ExtendedMessage[];
        }>(apiUrl);

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
              realm.write(() => {
                localMessage.serverSequence = Number(message.sequence);
                localMessage.localSequence = Number(message.sequence);
                localMessage.lastSyncTimestamp = new Date(message.createdAt);
              });
            } else {
              realm.write(() => {
                realm.create<MessageSchema>("Message", {
                  _id: new BSON.ObjectID(message.localId),
                  conversationId: message.conversationId,
                  deliveryStatus: "sent",
                  content: message.content,
                  sender: message.sender,
                  receiver: message.receiver,
                  serverId: message._id,
                  serverSequence: Number(message.sequence),
                  localSequence: Number(message.sequence),
                  createdAt: message.createdAt,
                  lastSyncTimestamp: new Date(message.createdAt),
                });
              });
            }
          }
        }
      } catch (error) {
        console.log("ERROR OCCURRED FETCHING MESSAGES:", error);
      } finally {
        setIsSyncing(false);
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
        realm.write(() => {
          realm.create("Message", {
            _id: new BSON.ObjectID(message.localId),
            content: message.content,
            createdAt: new Date(message.createdAt),
            sender: message.sender,
            receiver: message.receiver,
            conversationId: message.conversationId,
            deliveryStatus: "sent",
            serverId: message._id,
            localSequence: Number(message.sequence),
          });
        });
      }
    },
    [realm]
  );

  const sendMessage = useCallback(
    async (message: ExtendedMessage, chatId: string) => {
      // Generate a new local id for realm
      const localId = new BSON.ObjectID();

      // Get the highest local sequence
      let lastMessageCounter =
        realm
          .objects<MessageSchema>("Message")
          .filtered("conversationId == $0", chatId)
          .max("localSequence") ?? 0;

      const localSequence = Number(lastMessageCounter) + 1;

      // optimistic update
      realm.write(() => {
        realm.create("Message", {
          ...message,
          _id: localId,
          conversationId: chatId,
          deliveryStatus: "pending",
          createdAt: new Date(),
          isQueued: !isConnected || socket === null,
          localSequence,
        });
      });

      // update the chats order on the chats screen
      updateChatOrder({
        conversationId: chatId,
        content: message.content,
        createdAt: new Date(),
      });

      if (isConnected && socket) {
        // send the message content and local id to the server
        socket.emit(
          "new-message",
          { ...message, localId, localSequence },
          (ack: IChatAck) => {
            if (ack.success) {
              updateChatMessage(
                localId,
                "sent",
                ack.serverId,
                ack.serverSequence,
                ack.messageCreatedAt
              );
            }
          }
        );
      } else {
        // TODO: queue message if there is no internet connection
        console.log("QUEUING MESSAGE:", message);
      }
    },
    [realm, socket, isConnected, updateChatOrder]
  );

  const updateChatMessage = useCallback(
    (
      messageLocalId: BSON.ObjectID,
      status: "pending" | "sent" | "delivered",
      serverId: string,
      serverSequence: number,
      messageCreatedAt: Date
    ) => {
      const message = realm.objectForPrimaryKey<MessageSchema>(
        "Message",
        messageLocalId
      );
      if (!message || message.deliveryStatus === "sent") return;
      realm.write(() => {
        message.serverId = serverId;
        message.deliveryStatus = status;
        message.localSequence = Number(serverSequence);
        message.createdAt = new Date(messageCreatedAt);
      });
    },
    [realm]
  );

  return {
    sendMessage,
    addMessageToLocalRealm,
    deleteAllMessages,
    syncMessagesFromBackend,
    isSyncing,
  };
};
