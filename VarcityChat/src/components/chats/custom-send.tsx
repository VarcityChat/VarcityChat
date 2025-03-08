import { memo, useCallback } from "react";
import { SendProps, IMessage } from "react-native-gifted-chat";
import { View, TouchableOpacity } from "@/ui";
import MicrophoneSvg from "@/ui/icons/chat/microphone-svg";
import AttachmentSvg from "@/ui/icons/chat/attachment-svg";
import PictureSvg from "@/ui/icons/chat/picture-svg";
import SendSvg from "@/ui/icons/chat/send-svg";
import { UploadingImage } from "@/types/chat";
import * as ImagePicker from "expo-image-picker";

let renderedCount = 0;

const SEND_ICON = <SendSvg width={30} height={30} />;
const MICROPHONE_ICON = <MicrophoneSvg />;
const ATTACHMENT_ICON = <AttachmentSvg />;
const PICTURE_ICON = <PictureSvg />;

export const CustomSend = memo(
  ({
    text,
    sendProps,
    uploadingImages,
    isRecording,
    setIsRecording,
    onImageSelected,
  }: {
    text: string;
    sendProps: SendProps<IMessage>;
    uploadingImages: UploadingImage[];
    isRecording: boolean;
    setIsRecording: (isRecording: boolean) => void;
    onImageSelected: (images: ImagePicker.ImagePickerAsset[]) => void;
  }) => {
    console.log(`[CustomSend]: ${renderedCount++}`);

    const isUploading = uploadingImages.some(
      (img) => img.progress < 100 && !img.error
    );

    const hasCompletedImages = uploadingImages.some(
      (img) => img?.cloudinaryUrl && !img.error
    );

    const canSend =
      (text.trim().length > 0 || hasCompletedImages) && !isUploading;

    const handleImageSelection = useCallback(async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0.6,
        selectionLimit: 4,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        // call on image selected in the frontend
        onImageSelected(result.assets);
      }
    }, [onImageSelected]);

    const handleSend = () => {
      if (canSend) {
        if (text.trim().length > 0) {
          sendProps.onSend?.({ text }, true);
        } else if (hasCompletedImages) {
          sendProps.onSend?.({ text: "" }, true);
        }
      }
    };

    const handleStartRecording = useCallback(() => {
      setIsRecording(true);
    }, [setIsRecording]);

    if (isRecording) return null;

    return (
      <View className="flex flex-row items-center justify-center gap-2 h-[44px] px-4">
        {(text.length > 0 || uploadingImages.length > 0) && (
          <TouchableOpacity
            className="h-[44px] justify-center items-center"
            onPress={handleSend}
            disabled={!canSend}
            activeOpacity={0.4}
          >
            {SEND_ICON}
          </TouchableOpacity>
        )}
        {text.length === 0 && uploadingImages.length === 0 && (
          <>
            <TouchableOpacity onPress={handleStartRecording}>
              {MICROPHONE_ICON}
            </TouchableOpacity>
            <TouchableOpacity>{ATTACHMENT_ICON}</TouchableOpacity>
            <TouchableOpacity onPress={handleImageSelection}>
              {PICTURE_ICON}
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  },

  (prevProps, nextProps) => {
    // Only re-render if these specific props change
    return (
      prevProps.text === nextProps.text &&
      prevProps.isRecording === nextProps.isRecording &&
      prevProps.uploadingImages.length === nextProps.uploadingImages.length &&
      JSON.stringify(
        prevProps.uploadingImages.map((img) => ({
          progress: img.progress,
          error: img.error,
          cloudinaryUrl: img.cloudinaryUrl,
        }))
      ) ===
        JSON.stringify(
          nextProps.uploadingImages.map((img) => ({
            progress: img.progress,
            error: img.error,
            cloudinaryUrl: img.cloudinaryUrl,
          }))
        )
    );
  }
);
