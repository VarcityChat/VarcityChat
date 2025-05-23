import { useCallback, useState } from "react";
import { DELIVERY_STATUSES, ExtendedMessage } from "@/api/chats/types";
import { Ionicons, Feather } from "@expo/vector-icons";
import { memo } from "react";
import { View, Image, Text, colors } from "@/ui";
import {
  StyleSheet,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Bubble, IMessage, BubbleProps } from "react-native-gifted-chat";
import { ImageViewer } from "./image-viewer";
import { AudioMessageBubble } from "./audio-message-bubble";
import { formatChatReplyMessage, trimText } from "@/core/utils";
import { useAppSelector } from "@/core/store/store";

const { width } = Dimensions.get("window");
const MAX_IMAGE_WIDTH = width * 0.6;

type CustomMessageBubbleProps = BubbleProps<ExtendedMessage> & {
  onReplyPress?: (messageId: string) => void;
};

const CustomMessageBubble = memo(
  (props: CustomMessageBubbleProps) => {
    const activeChat = useAppSelector((state) => state.chats.activeChat);
    const [isViewerVisible, setIsViewerVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // console.log("RENDERED BUBBLE: ", props.currentMessage?.text);

    const handleImagePress = (urls: string[], index: number) => {
      setSelectedImageIndex(index);
      setIsViewerVisible(true);
    };

    const renderTicks = (message: ExtendedMessage) => {
      if (!message || !message.user) return null;
      if (message.user._id !== props?.user?._id) return null;

      if (message.deliveryStatus === "failed") {
        return (
          <View style={styles.tickView}>
            <Ionicons name="close" size={12} color="red" />
          </View>
        );
      }

      return (
        <View style={styles.tickView}>
          {!!message.sent && (
            <Ionicons name="checkmark" size={12} color="gray" />
          )}
          {!!message.received && (
            <Ionicons name="checkmark-done" size={12} color="green" />
          )}
          {!!message.pending && <Feather name="clock" size={12} color="gray" />}
        </View>
      );
    };

    const renderMessageImages = useCallback(
      (props: BubbleProps<ExtendedMessage>) => {
        const message = props?.currentMessage;
        if (!message?.mediaUrls?.length) return null;

        const mediaLength = message.mediaUrls.length;
        const textIsEmpty = !message.text || message.text.trim().length === 0;

        return (
          <View
            style={[
              mediaLength < 4
                ? styles.imageContainer
                : styles.fourImagesContainer,
              textIsEmpty && styles.noTextContainer,
            ]}
          >
            {message.mediaUrls?.map((url, index) => (
              <Pressable
                key={url}
                onPress={() =>
                  handleImagePress(message.mediaUrls as string[], index)
                }
                style={[
                  mediaLength < 4
                    ? styles.imageWrapper
                    : styles.fourImagesWrapper,
                  mediaLength === 1 && styles.singleImage,
                  mediaLength === 2 && styles.doubleImage,
                  mediaLength === 3 && styles.multiImage,
                ]}
              >
                <Image source={{ uri: url }} style={styles.image} />
              </Pressable>
            ))}
          </View>
        );
      },
      []
    );

    const renderReplyBubble = useCallback((props: CustomMessageBubbleProps) => {
      const message = props?.currentMessage;
      if (!message?.reply) return null;

      const isOwnMessage = message.reply.sender === props.user?._id;
      const senderName = isOwnMessage
        ? "You"
        : trimText(`${activeChat?.receiver?.firstname}`, 20);

      const handlePress = () => {
        if (message?.reply?.messageId) {
          props?.onReplyPress?.(message?.reply?.messageId);
        }
      };

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row overflow-hidden rounded-md mt-1.5 mx-1.5"
          style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
          onPress={handlePress}
        >
          <View className="w-1 bg-primary-400" />
          <View className="flex-1 p-1 pl-2">
            <Text className="mb-0.5 text-primary-500 text-sm font-sans-semibold">
              {senderName}
            </Text>
            <Text className="text-sm text-grey-700" numberOfLines={2}>
              {formatChatReplyMessage(message?.reply as any)}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }, []);

    return (
      <>
        <View shouldRasterizeIOS renderToHardwareTextureAndroid>
          <Bubble
            {...props}
            textStyle={{
              right: {
                color: "#000",
                fontSize: 14,
                fontFamily: "PlusJakartaSans_500Medium",
              },
              left: {
                fontSize: 14,
                fontFamily: "PlusJakartaSans_500Medium",
              },
            }}
            wrapperStyle={{
              left: {
                backgroundColor: colors.grey[50],
                maxWidth: props?.currentMessage?.mediaUrls?.length
                  ? MAX_IMAGE_WIDTH + 8
                  : undefined,
              },
              right: {
                backgroundColor: "#FCEBEB",
                maxWidth: props?.currentMessage?.mediaUrls?.length
                  ? MAX_IMAGE_WIDTH + 8
                  : undefined,
              },
            }}
            renderTicks={renderTicks}
            renderCustomView={(props) => {
              return (
                <>
                  {renderReplyBubble(props)}
                  {renderMessageImages(props)}
                </>
              );
            }}
            renderMessageAudio={(props) => {
              return (
                <AudioMessageBubble
                  message={
                    props.currentMessage as IMessage & {
                      deliveryStatus: DELIVERY_STATUSES;
                    }
                  }
                  isSender={props.position === "right"}
                />
              );
            }}
          />
        </View>

        <ImageViewer
          visible={isViewerVisible}
          imageUrls={props.currentMessage?.mediaUrls as string[]}
          initialIndex={selectedImageIndex}
          onClose={() => setIsViewerVisible(false)}
        />
      </>
    );
  },
  (prev, next) => {
    return (
      prev.currentMessage._id === next.currentMessage._id &&
      prev.currentMessage.text === next.currentMessage.text &&
      JSON.stringify(prev.currentMessage?.mediaUrls) ===
        JSON.stringify(next.currentMessage?.mediaUrls) &&
      prev.currentMessage.deliveryStatus === next.currentMessage.deliveryStatus
    );
  }
);

export default CustomMessageBubble;

const styles = StyleSheet.create({
  tick: {
    fontSize: 10,
    color: "white",
    backgroundColor: "transparent",
  },
  tickView: {
    flexDirection: "row",
    marginRight: 10,
  },
  imageContainer: {
    flexDirection: "row",
    marginBottom: 2,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  noTextContainer: {
    paddingBottom: 4,
  },
  imageWrapper: {
    margin: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  fourImagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: MAX_IMAGE_WIDTH + 8,
    gap: 2,
    paddingHorizontal: 4,
    paddingTop: 4,
    marginBottom: 2,
  },
  fourImagesWrapper: {
    width: (MAX_IMAGE_WIDTH - 2) / 2,
    height: (MAX_IMAGE_WIDTH - 2) / 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  singleImage: {
    width: MAX_IMAGE_WIDTH,
    height: MAX_IMAGE_WIDTH * 0.75,
  },
  doubleImage: {
    flexDirection: "row",
    width: MAX_IMAGE_WIDTH / 2 - 2,
    height: MAX_IMAGE_WIDTH / 2,
  },
  multiImage: {
    width: MAX_IMAGE_WIDTH / 3 - 2,
    height: MAX_IMAGE_WIDTH / 3,
  },
});
