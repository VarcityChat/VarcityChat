import { Animated, StyleSheet } from "react-native";
import { View, Text, colors } from "@/ui";
import {
  IMessage,
  Message,
  MessageProps,
  isSameDay,
  isSameUser,
} from "react-native-gifted-chat";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

type ChatMessageBoxProps = {
  setReplyOnSwipe: (message: IMessage) => void;
  updateRowRef: (ref: any) => void;
} & MessageProps<IMessage>;

export default function ChatMessageBox({
  setReplyOnSwipe,
  updateRowRef,
  ...props
}: ChatMessageBoxProps) {
  const isNextMyMessage =
    props.currentMessage &&
    props.nextMessage &&
    isSameUser(props.currentMessage, props.nextMessage) &&
    isSameDay(props.currentMessage, props.nextMessage);

  const renderRightAction = (
    progressAnimatedValue: Animated.AnimatedInterpolation<any>
  ) => {
    const size = progressAnimatedValue.interpolate({
      inputRange: [0, 1, 100],
      outputRange: [0, 1, 1],
    });
    const trans = progressAnimatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, -12, -30],
    });

    return (
      <Animated.View
        style={[
          styles.container,
          { transform: [{ scale: size }, { translateX: trans }] },
          isNextMyMessage
            ? styles.defaultBottomOffset
            : styles.bottomOffsetNext,
          props.position === "right" && styles.leftOffsetValue,
        ]}
      >
        <View style={styles.replyImageWrapper}>
          <MaterialCommunityIcons
            name="reply-circle"
            size={26}
            color={colors.grey[300]}
          />
        </View>
      </Animated.View>
    );
  };

  const onSwipeOpenAction = () => {
    if (props.currentMessage) {
      setReplyOnSwipe({ ...props.currentMessage });
    }
  };

  return (
    <Swipeable
      ref={updateRowRef}
      friction={2}
      rightThreshold={40}
      renderLeftActions={renderRightAction}
      onSwipeableWillOpen={onSwipeOpenAction}
    >
      <Message {...props} />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
  },
  replyImageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  replyImage: {
    width: 20,
    height: 20,
  },
  defaultBottomOffset: {
    marginBottom: 2,
  },
  bottomOffsetNext: {
    marginBottom: 10,
  },
  leftOffsetValue: {
    marginLeft: 16,
  },
});
