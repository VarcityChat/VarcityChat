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
                className="flex flex-1 h-[130px] bg-red-500 mb-8 mx-1"
              ></TouchableOpacity>
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
