import { memo } from "react";
import { SendProps, IMessage } from "react-native-gifted-chat";
import { View, TouchableOpacity } from "@/ui";
import MicrophoneSvg from "@/ui/icons/chat/microphone-svg";
import AttachmentSvg from "@/ui/icons/chat/attachment-svg";
import PictureSvg from "@/ui/icons/chat/picture-svg";
import SendSvg from "@/ui/icons/chat/send-svg";
import { UploadingImage } from "@/types/chat";
import * as ImagePicker from "expo-image-picker";

export const ChatInput = memo(
  ({
    text,
    sendProps,
    uploadingImages,
    onImageSelected,
  }: {
    text: string;
    sendProps: SendProps<IMessage>;
    uploadingImages: UploadingImage[];
    onImageSelected: (images: ImagePicker.ImagePickerAsset[]) => void;
  }) => {
    const isUploading = uploadingImages.some(
      (img) => img.progress < 100 && !img.error
    );

    const hasCompletedImages = uploadingImages.some(
      (img) => img?.cloudinaryUrl && !img.error
    );

    const canSend =
      (text.trim().length > 0 || hasCompletedImages) && !isUploading;

    const handleImageSelection = async () => {
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
    };

    const handleSend = () => {
      if (canSend) {
        if (text.trim().length > 0) {
          sendProps.onSend?.({ text }, true);
        } else if (hasCompletedImages) {
          sendProps.onSend?.({ text: "" }, true);
        }
      }
    };

    return (
      <View className="flex flex-row items-center justify-center gap-2 h-[44px] px-4">
        {(text.length > 0 ||
          (uploadingImages.length > 0 && hasCompletedImages)) && (
          <TouchableOpacity
            className="h-[44px] justify-end items-center"
            onPress={handleSend}
            disabled={!canSend}
            activeOpacity={0.4}
          >
            <SendSvg width={30} height={30} />
          </TouchableOpacity>
        )}
        {text.length === 0 && uploadingImages.length === 0 && (
          <>
            <TouchableOpacity>
              <MicrophoneSvg />
            </TouchableOpacity>
            <TouchableOpacity>
              <AttachmentSvg />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleImageSelection}>
              <PictureSvg />
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }
);
