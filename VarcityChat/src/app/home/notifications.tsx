import BackButton from "@/components/back-button";
import { View, Text, TouchableOpacity, List } from "@/ui";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native";

export default function NotificationsScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex flex-1">
      <View className="flex flex-row items-center px-6">
        <BackButton onPress={() => router.back()} />
        <View className="flex flex-1 items-center">
          <Text className="font-bold text-lg">Notification</Text>
        </View>
        <TouchableOpacity>
          <Text className="text-primary-600">mark all as read</Text>
        </TouchableOpacity>
      </View>

      <List
        data={[1, 2, 3, 4, 5, 6]}
        renderItem={({}) => <View></View>}
        estimatedItemSize={50}
      />
    </SafeAreaView>
  );
}
