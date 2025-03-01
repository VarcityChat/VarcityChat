import { IMessage } from "react-native-gifted-chat";
import { AudioPlayer } from "./audio-player";

interface AudioMessageBubbleProps {
  message: IMessage & { audio?: string };
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
    />
  );
};
