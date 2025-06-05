import { DELIVERY_STATUSES, ExtendedMessage } from "@/api/chats/types";
import { IMessage } from "react-native-gifted-chat";

export const trimText = (text: string, maxLength: number = 20) => {
  if (typeof text !== "string") return "";
  return text.length > maxLength
    ? text.slice(0, maxLength - 3) + "..."
    : text.slice(0, maxLength);
};

export const formatChatLastMessage = (
  message: Partial<ExtendedMessage> | undefined
) => {
  if (!message) return "Send a message 👋";
  if (
    message.content?.trim()?.length === 0 &&
    !message.mediaUrls?.length &&
    !message?.audio
  )
    return "Send a message 👋";

  if (message?.audio) return `🎙️ voice message`;

  if (message?.mediaUrls?.length && !message.content?.trim().length)
    return `🗾 ${message.mediaUrls.length} image${
      message.mediaUrls.length > 1 ? "s" : ""
    }`;

  return trimText(limitNewLines(`${message.content}`, 2) || "", 70);
};

export const formatChatReplyMessage = (
  message: IMessage & ExtendedMessage,
  linesLimit: number = 1
) => {
  if (!message) return "";
  if (message?.audio) return `🎙️ voice message`;
  if (message?.mediaUrls?.length && !message.content?.trim().length)
    return `🗾 ${message.mediaUrls.length} image${
      message.mediaUrls.length > 1 ? "s" : ""
    }`;
  return trimText(
    limitNewLines(`${message?.text || message?.content}`, linesLimit) || "",
    50
  );
};

export const limitNewLines = (text: string, maxLines: number): string => {
  if (!text || typeof text !== "string") return "";
  const lines = text.split("\n");
  if (lines.length <= maxLines) return text;
  return lines.slice(0, maxLines).join("\n") + "...";
};

export const removeNewLinesAndTabs = (text: string): string => {
  if (!text || typeof text !== "string") return "";
  return text.replace(/[\n\r\t]/g, " ");
};

export const capitalize = (text: string): string => {
  if (!text) return "";
  if (typeof text !== "string") return "";
  if (text.length === 0) return "";
  if (text.length === 1) return text[0].toUpperCase();
  return text[0].toUpperCase() + text.substring(1);
};

export const formatLastMessageTime = (
  timestamp: Date | string | number | undefined
) => {
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

// Format the duration as MM:SS
export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const convertToGiftedChatMessage = (
  message: ExtendedMessage
): Partial<ExtendedMessage> => {
  return {
    _id: message._id.toString(),
    text: message.content || "",
    createdAt: message.createdAt,
    user: {
      _id: message.sender,
    },
    audio: message?.audio,
    mediaUrls: message.mediaUrls || [],
    sent: message.deliveryStatus === "sent",
    received: message.deliveryStatus === "delivered",
    pending: message.deliveryStatus === "pending",
    deliveryStatus: message.deliveryStatus,
    reply: message?.reply,
  };
};

export const convertGiftedMessages = (
  messages: ExtendedMessage[]
): Partial<ExtendedMessage>[] => {
  return messages.map(convertToGiftedChatMessage);
};
