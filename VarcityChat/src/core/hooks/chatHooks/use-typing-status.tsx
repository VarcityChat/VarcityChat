import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { ITyping } from "@/types/chat";

const TYPING_TIMEOUT = 2000; // 2 seconds

export const useTypingStatus = ({
  conversationId,
  userId,
  receiverId,
}: ITyping) => {
  const { socket, isConnected } = useSocket();
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("typing", (data: ITyping) => {
      if (
        data.conversationId === conversationId &&
        data.userId === receiverId &&
        !isOtherUserTyping
      ) {
        setIsOtherUserTyping(true);
      }
    });

    socket.on("stop-typing", (data: ITyping) => {
      if (
        data.conversationId === conversationId &&
        data.userId === receiverId &&
        isOtherUserTyping
      ) {
        setIsOtherUserTyping(false);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stop-typing");
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, isConnected, conversationId, receiverId, isOtherUserTyping]);

  const handleTyping = useCallback(
    (text: string) => {
      if (!socket || !isConnected || !text.trim()) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        socket?.emit("stop-typing", {
          conversationId,
          userId,
          receiverId,
        });
        return;
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      socket.emit("typing", { conversationId, userId, receiverId });

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", { conversationId, userId, receiverId });
      }, TYPING_TIMEOUT);
    },
    [socket, isConnected, conversationId, userId, receiverId]
  );

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket?.emit("stop-typing", { conversationId, userId, receiverId });
  }, [socket, conversationId, userId, receiverId]);

  return { isOtherUserTyping, handleTyping, stopTyping };
};
