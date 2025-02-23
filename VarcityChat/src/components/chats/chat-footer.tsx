import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { Image, TouchableOpacity, View, Text } from "@/ui";
import { UploadingImage } from "@/types/chat";
import { CircularProgressWithIcon } from "./circular-progress";

interface ChatFooterProps {
  uploadingImages: UploadingImage[];
  onRemoveImage: (uri: string) => void;
}

export const ChatFooter = ({
  uploadingImages,
  onRemoveImage,
}: ChatFooterProps) => {
  const boxHeight = useSharedValue(0);

  const boxAnimation = useAnimatedStyle(() => {
    return {
      height: withTiming(boxHeight.value, { duration: 270 }),
    };
  });

  useEffect(() => {
    boxHeight.value = uploadingImages.length > 0 ? 100 : 0;
  }, [uploadingImages.length]);

  return (
    <>
      <Animated.View style={[boxAnimation]}>
        <View className="flex-row flex-wrap p-2 bg-gray-50">
          {uploadingImages.map((img, index) => (
            <View key={img.uri} className="m-1 relative">
              <Image
                source={{ uri: img.uri }}
                className="w-20 h-20 rounded-lg bg-black/30"
              />
              <CircularProgressWithIcon
                progress={img.progress}
                error={img.error}
                onCancel={() => onRemoveImage(img.uri)}
              />
            </View>
          ))}
        </View>
      </Animated.View>
    </>
  );
};
