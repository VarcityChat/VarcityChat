import { View, Text, Button, TouchableOpacity } from "@/ui";
import { useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function DiscoverScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex flex-1">
      <ScrollView className="flex flex-1 flex-grow px-4">
        <FlashList
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]}
          keyExtractor={(_, index) => `university-${index}`}
          renderItem={() => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                className="flex flex-1 h-[130px] mb-8 mx-2"
              >
                <View className="w-full h-[90] bg-grey-50 rounded-md dark:bg-grey-800"></View>
                <View className="mt-2">
                  <Text className="font-semibold">Lead City</Text>
                  <View className="flex flex-row items-center">
                    <Text className="text-sm text-grey-500 dark:text-grey-200">
                      Ibadan, Oyo
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          numColumns={3}
          contentContainerClassName="flex flex-1 flex-grow"
          estimatedItemSize={50}
        />
      </ScrollView>
      {/* <Text>Discover Screen</Text>
      <Button
        label="Lead City Unviersity"
        onPress={() => {
          router.navigate("/(tabs)/discover/leadcity");
        }}
      /> */}
    </SafeAreaView>
  );
}
