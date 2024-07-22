import Header from "@/components/header";
import { View, Text, TouchableOpacity, List } from "@/ui";
import { useRouter } from "expo-router";

export default function NotificationsScreen() {
  const router = useRouter();
  return (
    <View className="flex flex-1">
      <Header
        title="Notification"
        headerRight={
          <TouchableOpacity activeOpacity={0.7}>
            <Text className="text-primary-500">mark all as read</Text>
          </TouchableOpacity>
        }
      >
        <List
          data={[1, 2, 3, 4, 5, 6]}
          renderItem={({}) => <View></View>}
          estimatedItemSize={50}
        />
      </Header>
    </View>
  );
}
