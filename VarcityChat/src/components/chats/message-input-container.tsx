import { useCallback, useState, memo } from "react";
import {
  Composer,
  GiftedChat,
  GiftedChatProps,
  IMessage,
} from "react-native-gifted-chat";
import { ChatInput } from "./chat-input";
import { CustomSend } from "./custom-send";
import { UploadingImage } from "@/types/chat";
import { ImagePickerAsset } from "expo-image-picker";

interface MessageInputContainerProps {
  onInputTextChanged?: (text: string) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  uploadingImages: UploadingImage[];
  onImageSelected: (images: ImagePickerAsset[]) => void;
  onAudioSend: (audioUri: string) => void;
}

export const MessageInputContainer = memo(
  ({
    onSend,
    onInputTextChanged,
    isRecording,
    setIsRecording,
    uploadingImages,
    onImageSelected,
    onAudioSend,
    ...restProps
  }: GiftedChatProps & MessageInputContainerProps) => {
    const [text, setText] = useState("");

    const handleTextChange = useCallback(
      (newText: string) => {
        setText(newText);
        onInputTextChanged?.(newText);
      },
      [onInputTextChanged]
    );

    const handleSend = useCallback(
      (messages: IMessage[]) => {
        onSend?.(messages);
        setText("");
      },
      [onSend]
    );

    return (
      <GiftedChat
        {...restProps}
        text={text}
        onSend={handleSend}
        onInputTextChanged={handleTextChange}
        maxComposerHeight={100}
        renderComposer={(props) => (
          <Composer
            {...props}
            composerHeight={"auto"}
            textInputStyle={{ maxHeight: 100 }}
          />
        )}
        renderInputToolbar={(props) => (
          <ChatInput
            {...props}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            onAudioSend={onAudioSend}
          />
        )}
        renderSend={(props) => (
          <CustomSend
            text={text}
            sendProps={props}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            uploadingImages={uploadingImages}
            onImageSelected={onImageSelected}
          />
        )}
        messagesContainerStyle={{
          paddingLeft: 4,
        }}
      />
    );
  }
);
