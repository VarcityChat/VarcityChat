import { useState } from "react";
import { colors } from "@/ui";
import { ExtendedMessage } from "@/api/chats/types";
import { Ionicons, Feather } from "@expo/vector-icons";
import { memo } from "react";
import { View, Image } from "@/ui";
import { StyleSheet, Dimensions, Pressable } from "react-native";
import { Bubble, IMessage, BubbleProps } from "react-native-gifted-chat";
import { ImageViewer } from "./image-viewer";
import { AudioMessageBubble } from "./audio-message-bubble";

const { width } = Dimensions.get("window");
const MAX_IMAGE_WIDTH = width * 0.6;

const CustomMessageBubble = memo(
  (props: BubbleProps<IMessage & { mediaUrls: string[] }>) => {
    const [isViewerVisible, setIsViewerVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleImagePress = (urls: string[], index: number) => {
      setSelectedImageIndex(index);
      setIsViewerVisible(true);
    };

    const renderTicks = (message: ExtendedMessage) => {
      if (!message || !message.user) return null;
      if (message.user._id !== props?.user?._id) return null;
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

    const renderMessageImages = (props: BubbleProps<IMessage>) => {
      const message = props?.currentMessage as ExtendedMessage;
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
    };

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
              return renderMessageImages(props);
            }}
            renderMessageAudio={(props) => {
              return (
                <AudioMessageBubble
                  message={props.currentMessage}
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
