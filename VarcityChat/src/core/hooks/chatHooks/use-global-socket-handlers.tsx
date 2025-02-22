import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { useChatMessages } from "../use-chat-messages";
import { ExtendedMessage, IChat, IUpdateChatRequest } from "@/api/chats/types";
import { useChats } from "../use-chats";
import { useAppSelector } from "@/core/store/store";

export const useGlobalSocketHandlers = (
  socket: Socket | null,
  isConnected: boolean
) => {
  const { addMessageToLocalRealm, markUserMessagesInChatAsRead } =
    useChatMessages();
  const {
    updateChatOrder,
    updateUnreadChatCount,
    loadChats,
    updateChatStatus,
  } = useChats();
  const activeChat = useAppSelector((state) => state.chats.activeChat);
  const activeChatRef = useRef<IChat | null>(null);

  /**
   * Socket.io takes a snapshot of the state when the handler is registered.
   * To get the latest values inside the socket handlers, we can use a ref to track the current activeChat state.
   */
  useEffect(() => {
    activeChatRef.current = activeChat?.chat ?? null;
  }, [activeChat]);

  // Handle incoming socket message from server
  const handleNewMessage = (message: ExtendedMessage) => {
    addMessageToLocalRealm(message);
    updateChatOrder(message);
    updateUnreadChatCount(message.conversationId, activeChatRef.current);
  };

  // Refresh chats screen on new conversation request
  const handleNewMessageRequest = () => {
    loadChats();
  };

  const handleMessageRequestAccepted = (data: IUpdateChatRequest) => {
    updateChatStatus(data.conversationId, "accepted");
  };

  const handleMessageRequestRejected = (data: IUpdateChatRequest) => {
    updateChatStatus(data.conversationId, "rejected");
  };

  const handleMarkMessagesInChatAsRead = (data: IUpdateChatRequest) => {
    markUserMessagesInChatAsRead(data.conversationId);
  };

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("new-message", handleNewMessage);
    socket.on("new-message-request", handleNewMessageRequest);
    socket.on("accepted-conversation-request", handleMessageRequestAccepted);
    socket.on("rejected-conversation-request", handleMessageRequestRejected);
    socket.on("user-read-messages", handleMarkMessagesInChatAsRead);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("new-message-request", handleNewMessageRequest);
      socket.off("accepted-conversation-request", handleMessageRequestAccepted);
      socket.off("rejected-conversation-request", handleMessageRequestRejected);
      socket.off("user-read-messages", handleMarkMessagesInChatAsRead);
    };
  }, [socket, isConnected]);
};
