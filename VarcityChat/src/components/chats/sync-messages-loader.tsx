import { memo } from "react";
import { View, Text } from "@/ui";
import { ActivityIndicator } from "@/ui";

const SyncingMessagesComponent = memo(() => {
  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 z-10">
      <View className="flex flex-1 items-center justify-center">
        <Text className="text-white mb-4 -mt-20">Syncing messages...</Text>
        <ActivityIndicator color="white" size="small" />
      </View>
    </View>
  );
});

export default SyncingMessagesComponent;
