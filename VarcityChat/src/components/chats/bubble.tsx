import { colors } from "@/ui";
import { ExtendedMessage } from "@/api/chats/types";
import { Ionicons, Feather } from "@expo/vector-icons";
import { memo } from "react";
import { View } from "@/ui";
import { StyleSheet } from "react-native";
import { Bubble } from "react-native-gifted-chat";

const CustomMessageBubble = memo((props: any) => {
  const renderTicks = (message: ExtendedMessage) => {
    if (!message || !message.user) return null;
    if (message.user._id !== props?.user?._id) return null;
    return (
      <View style={styles.tickView}>
        {!!message.sent && <Ionicons name="checkmark" size={12} color="gray" />}
        {!!message.received && (
          <Ionicons name="checkmark-done" size={12} color="green" />
        )}
        {!!message.pending && <Feather name="clock" size={12} color="gray" />}
      </View>
    );
  };

  return (
    <View shouldRasterizeIOS renderToHardwareTextureAndroid>
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: "#000",
            fontSize: 14,
            fontFamily: "PlusJakartaSans_400Regular",
          },
          left: { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular" },
        }}
        wrapperStyle={{
          left: { backgroundColor: colors.grey[50] },
          right: { backgroundColor: colors.primary[50] },
        }}
        renderTicks={renderTicks}
      />
    </View>
  );
});

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
});
