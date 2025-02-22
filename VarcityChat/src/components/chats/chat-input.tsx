import { SendProps, IMessage, Send } from "react-native-gifted-chat";
import { View, TouchableOpacity } from "@/ui";
import MicrophoneSvg from "@/ui/icons/chat/microphone-svg";
import AttachmentSvg from "@/ui/icons/chat/attachment-svg";
import PictureSvg from "@/ui/icons/chat/picture-svg";
import SendSvg from "@/ui/icons/chat/send-svg";
import { memo } from "react";

export const ChatInput = memo(
  ({ text, sendProps }: { text: string; sendProps: SendProps<IMessage> }) => {
    return (
      <View className="flex flex-row items-center justify-center gap-2 h-[44px] px-4">
        {text.length > 0 && (
          <Send {...sendProps} containerStyle={{ justifyContent: "center" }}>
            <SendSvg width={30} height={30} />
          </Send>
        )}
        {text.length === 0 && (
          <>
            <TouchableOpacity>
              <MicrophoneSvg />
            </TouchableOpacity>
            <TouchableOpacity>
              <AttachmentSvg />
            </TouchableOpacity>
            <TouchableOpacity>
              <PictureSvg />
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }
);
