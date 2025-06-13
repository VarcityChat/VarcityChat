import { ExtendedMessage, IChatAck } from "@/api/chats/types";
import { useChats } from "./use-chats";
import { useSocket } from "@/context/useSocketContext";
import { useRealm } from "@realm/react";
import { BSON } from "realm";
import { useCallback, useState } from "react";
import { MessageSchema } from "../models/message-model";
import { axiosApiClient } from "@/api/api";
import { useAuth } from "./use-auth";
import { isRealmObjectValid } from "../utils";

export const useChatMessages = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { updateChatOrder } = useChats();
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const realm = useRealm();

  const generateLocalId = () => new BSON.ObjectID();

  const getNewMessageSequence = useCallback(
    (chatId: string) => {
      const lastMessageCounter =
        realm
          .objects<MessageSchema>("Message")
          .filtered("conversationId==$0", chatId)
          .max("localSequence") ?? 0;
      return Number(lastMessageCounter) + 1;
    },
    [realm]
  );

  const deleteAllMessages = useCallback(() => {
    try {
      realm.write(() => {
        realm.delete(realm.objects("Message"));
      });
    } catch (error) {
      console.error("Error deleting messages:", error);
    }
  }, [realm]);

  const syncMessagesFromBackend = useCallback(
    async (conversationId: string) => {
      try {
        let lastMessageServerSequence =
          realm
            .objects<MessageSchema>("Message")
            .filtered("conversationId = $0", conversationId)
            .max("serverSequence") ?? 1;
        lastMessageServerSequence = Number(lastMessageServerSequence);

        // Get messages from server since last sync
        setIsSyncing(true);
        const apiUrl = `/chat/${conversationId}/messages/sequence?sequence=${
          lastMessageServerSequence === 1 ? 0 : lastMessageServerSequence
        }`;

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

          const messagesToCreate: Partial<MessageSchema>[] = [];

          for (const message of serverMessages) {
            const localMessage = realm.objectForPrimaryKey<MessageSchema>(
              "Message",
              new BSON.ObjectId(message.localId)
            );

            const replyObject = message?.reply
              ? {
                  messageId: message.reply.messageId,
                  content: message.reply.content,
                  sender: message.reply.sender,
                  receiver: message.reply.receiver,
                }
              : undefined;

            if (localMessage && localMessage.isValid()) {
              realm.write(() => {
                localMessage.serverSequence = Number(message.sequence);
                localMessage.localSequence = Number(message.sequence);
                localMessage.lastSyncTimestamp = new Date(message.createdAt);
                localMessage.deliveryStatus = message?.readAt
                  ? "delivered"
                  : "sent";
                if (replyObject) {
                  localMessage.reply = replyObject as any;
                }
              });
            } else {
              messagesToCreate.push({
                _id: new BSON.ObjectID(message.localId),
                conversationId: message.conversationId,
                deliveryStatus: message?.readAt ? "delivered" : "sent",
                mediaUrls: message?.mediaUrls,
                content: message?.content,
                sender: message.sender,
                receiver: message.receiver,
                serverId: message._id,
                serverSequence: Number(message.sequence),
                localSequence: Number(message.sequence),
                audio: message?.audio,
                createdAt: message.createdAt,
                lastSyncTimestamp: new Date(message.createdAt),
                reply: replyObject as any,
              });
            }
          }

          if (messagesToCreate.length) {
            realm.write(() => {
              for (let i = 0; i < messagesToCreate.length; i++) {
                realm.create<MessageSchema>("Message", messagesToCreate[i]);
              }
            });
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

  const addServerMessageToRealm = useCallback(
    (message: ExtendedMessage) => {
      try {
        // Check if message with the same localId exists
        const messageExists = realm
          .objects("Message")
          .filtered(`serverId == $0`, message._id);

        const replyObject = message?.reply
          ? {
              messageId: message.reply.messageId,
              content: message.reply.content,
              sender: message.reply.sender,
              receiver: message.reply.receiver,
            }
          : undefined;

        if (!messageExists.length) {
          realm.write(() => {
            realm.create("Message", {
              _id: new BSON.ObjectID(message.localId),
              content: message.content,
              createdAt: new Date(message.createdAt),
              sender: message.sender,
              receiver: message.receiver,
              conversationId: message.conversationId,
              mediaUrls: message?.mediaUrls,
              deliveryStatus: "sent",
              audio: message?.audio,
              serverId: message._id,
              localSequence: Number(message.sequence),
              reply: replyObject,
            });
          });
        }
      } catch (error) {}
    },
    [realm]
  );
  const markUserMessagesInChatAsRead = useCallback(
    (conversationId: string) => {
      try {
        const unreadMessagesInConversation = realm
          .objects<MessageSchema>("Message")
          .filtered(
            "conversationId = $0 && deliveryStatus = $1 && sender = $2",
            conversationId,
            "sent",
            user?._id || ""
          );
        if (unreadMessagesInConversation.length) {
          realm.write(() => {
            for (let message of unreadMessagesInConversation) {
              message.deliveryStatus = "delivered";
            }
          });
        }
      } catch (error) {}
    },
    [realm]
  );

  const sendMessage = useCallback(
    async (message: ExtendedMessage, chatId: string) => {
      try {
        // Generate a new local id for realm
        const localId = generateLocalId();
        const localSequence = getNewMessageSequence(chatId);

        // create reply object if message has a reply
        const replyObject = message?.reply
          ? {
              messageId: message.reply.messageId,
              content: message.reply.content,
              sender: message.reply.sender,
              receiver: message.reply.receiver,
            }
          : undefined;

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
            reply: replyObject,
          });
        });

        // update the chats order on the chats screen
        updateChatOrder({
          conversationId: chatId,
          content: message.content,
          mediaUrls: message.mediaUrls,
          audio: message?.audio,
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
      } catch (error) {
        console.error("Error sending message:", error);
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
      try {
        const message = realm.objectForPrimaryKey<MessageSchema>(
          "Message",
          messageLocalId
        );
        if (!message || message?.deliveryStatus === "sent") return;
        if (isRealmObjectValid(message)) {
          realm.write(() => {
            message.serverId = serverId;
            message.deliveryStatus = status;
            message.localSequence = Number(serverSequence);
            message.createdAt = new Date(messageCreatedAt);
          });
        }
      } catch (error) {}
    },
    [realm]
  );

  const addAudioMessageToRealm = useCallback(
    (message: ExtendedMessage, localId: BSON.ObjectID, chatId: string) => {
      try {
        // create reply object if message has a reply
        const replyObject = message?.reply
          ? {
              messageId: message.reply.messageId,
              content: message.reply.content,
              sender: message.reply.sender,
              receiver: message.reply.receiver,
            }
          : undefined;

        const localSequence = getNewMessageSequence(chatId);
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
            reply: replyObject,
          });
        });
      } catch (error) {}
    },
    [realm, socket, isConnected]
  );

  const updateAudioMessage = useCallback(
    (messageId: BSON.ObjectID, cloudinaryUrl: string) => {
      try {
        const message = realm.objectForPrimaryKey<MessageSchema>(
          "Message",
          messageId
        );
        if (!message || message?.deliveryStatus === "sent") return;

        // check if object is still valid
        if (isRealmObjectValid(message)) {
          // update the audio url to the cloud version locally
          realm.write(() => {
            message.audio = cloudinaryUrl;
          });

          const messageCopy = {
            conversationId: message.conversationId,
            content: message.content,
            sender: message.sender,
            receiver: message.receiver,
            audio: message.audio,
            localId: message._id,
            localSequence: message.localSequence,
          };

          // after updating, send the local message to the server
          if (isConnected && socket) {
            socket.emit("new-message", messageCopy, (ack: IChatAck) => {
              if (ack.success) {
                updateChatMessage(
                  message._id,
                  "sent",
                  ack.serverId,
                  ack.serverSequence,
                  ack.messageCreatedAt
                );
              }
            });
          } else {
            markAudioUploadFailed(message._id);
          }
        }
      } catch (error) {}
    },
    [realm, socket, isConnected]
  );

  const markAudioUploadFailed = useCallback(
    (messageId: BSON.ObjectID) => {
      try {
        const message = realm.objectForPrimaryKey<MessageSchema>(
          "Message",
          messageId
        );
        if (!message) return;
        if (isRealmObjectValid(message)) {
          realm.write(() => {
            message.deliveryStatus = "failed";
          });
        }
      } catch (error) {}
    },
    [realm]
  );

  return {
    generateLocalId,
    sendMessage,
    addServerMessageToRealm,
    addAudioMessageToRealm,
    markUserMessagesInChatAsRead,
    deleteAllMessages,
    syncMessagesFromBackend,
    updateAudioMessage,
    markAudioUploadFailed,
    isSyncing,
  };
};
