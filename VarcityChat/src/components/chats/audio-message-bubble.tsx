import { IMessage } from "react-native-gifted-chat";
import { AudioPlayer } from "./audio-player";
import { DELIVERY_STATUSES } from "@/api/chats/types";

interface AudioMessageBubbleProps {
  message: IMessage & {
    audio?: string;
    deliveryStatus: DELIVERY_STATUSES;
  };
  isSender: boolean;
}

export const AudioMessageBubble = ({
  message,
  isSender,
}: AudioMessageBubbleProps) => {
  if (!message.audio) return null;
  return (
    <AudioPlayer
      audioUrl={message.audio}
      isSender={isSender}
      messageId={`${message._id}`}
      deliveryStatus={message.deliveryStatus}
    />
  );
};
