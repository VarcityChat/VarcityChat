import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { colors, Image, View } from "@/ui";
import { UploadingImage } from "@/types/chat";
import { CircularProgressWithIcon } from "./circular-progress";
import { useColorScheme } from "nativewind";

interface ChatFooterProps {
  uploadingImages: UploadingImage[];
  onRemoveImage: (uri: string) => void;
}

export const ChatFooter = ({
  uploadingImages,
  onRemoveImage,
}: ChatFooterProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const boxHeight = useSharedValue(0);

  const boxAnimation = useAnimatedStyle(() => {
    return {
      height: withTiming(boxHeight.value, { duration: 270 }),
    };
  });

  useEffect(() => {
    boxHeight.value = uploadingImages.length > 0 ? 90 : 0;
  }, [uploadingImages.length]);

  if (uploadingImages.length === 0) return null;

  return (
    <Animated.View
      style={[
        boxAnimation,
        {
          backgroundColor: isDark ? colors.black : colors.white,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          borderColor: colors.black,
          // shadow styles
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        },
      ]}
    >
      <View className="flex-row flex-wrap pt-2 px-2 rounded-lg bg-white dark:bg-black">
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
  );
};
