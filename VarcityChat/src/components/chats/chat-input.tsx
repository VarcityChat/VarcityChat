import { useColorScheme } from "nativewind";
import {
  IMessage,
  InputToolbar,
  InputToolbarProps,
} from "react-native-gifted-chat";
import { VoiceRecorder } from "./voice-recorder";
import { colors } from "@/ui";

type ChatInputProps = {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  onAudioSend: (audioUri: string) => void;
};

export const ChatInput = (
  props: InputToolbarProps<IMessage> & ChatInputProps
) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  if (!props.isRecording)
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: isDark ? colors.black : colors.white,
        }}
      />
    );

  return (
    <VoiceRecorder
      isRecording={props.isRecording}
      setIsRecording={props.setIsRecording}
      onSend={props.onAudioSend}
    />
  );
};
