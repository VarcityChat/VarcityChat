import { ExtendedMessage } from "@/api/chats/types";
import { IMessage } from "react-native-gifted-chat";

export const trimText = (text: string, maxLength: number = 20) => {
  if (typeof text !== "string") return;
  return text.length > maxLength
    ? text.slice(0, maxLength - 3) + "..."
    : text.slice(0, maxLength);
};

export const formatChatLastMessage = (text: any) => {
  if (typeof text !== "string") return "Send a message 👋";
  if (text.length === 0) return "Send a message 👋";
  return trimText(text, 70);
};

export const capitalize = (text: string): string => {
  if (!text) return "";
  if (typeof text !== "string") return "";
  if (text.length === 0) return "";
  if (text.length === 1) return text[0].toUpperCase();
  return text[0].toUpperCase() + text.substring(1);
};

export const formatLastMessageTime = (timestamp: Date | string | undefined) => {
  if (!timestamp) return "";

  const messageDate = new Date(timestamp);
  if (isNaN(messageDate.getTime())) return "";

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // if Message is from today, return time
  if (messageDate >= today) {
    return messageDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      // hour12: true,
    });
  }

  // if Message is from yesterday
  if (messageDate >= yesterday && messageDate < today) {
    return "Yesterday";
  }

  // if Message is from this week
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  if (messageDate >= weekStart) {
    return messageDate.toLocaleDateString("en-US", { weekday: "long" });
  }

  // If Message is older than a week
  return messageDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const convertToGiftedChatMessage = (
  message: ExtendedMessage
): IMessage & { mediaUrls: string[] } => {
  return {
    _id: message._id.toString(),
    text: message.content || "",
    createdAt: message.createdAt,
    user: {
      _id: message.sender,
    },
    mediaUrls: message.mediaUrls || [],
    sent: message.deliveryStatus === "sent",
    received: message.deliveryStatus === "delivered",
    pending: message.deliveryStatus === "pending",
  };
};

export const convertGiftedMessages = (
  messages: ExtendedMessage[]
): IMessage[] => {
  return messages.map(convertToGiftedChatMessage);
};
