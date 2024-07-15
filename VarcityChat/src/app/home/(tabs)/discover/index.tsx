import { View, Text, Button, TouchableOpacity, Image } from "@/ui";
import { useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { universities } from "../../../../../constants/unis";
import LocationSvg from "@/ui/icons/location";
import SearchBar from "@/components/search-bar";

export default function DiscoverScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex flex-1">
      <ScrollView className="flex flex-1 flex-grow px-6">
        <SearchBar placeholder="Discover more people here" />
        <FlashList
          data={[...universities]}
          keyExtractor={(_, index) => `university-${index}`}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                className={`flex flex-1 h-[130px] mb-8 
                  ${(index + 1) % 3 === 0 ? "ml-2" : ""}
                  ${(index + 1) % 3 === 1 ? "mr-2" : ""}
                  ${(index + 1) % 3 === 2 ? "mx-1" : ""}
                `}
              >
                <View className="w-full h-[90] bg-grey-50 rounded-md dark:bg-grey-800 items-center justify-center">
                  {item.image ? (
                    <Image
                      source={item.image}
                      className="w-[60] h-[60] object-contain"
                    />
                  ) : null}
                </View>
                <View className="mt-2">
                  <Text className="font-semibold">{item.name}</Text>
                  <View className="flex flex-row items-center">
                    <LocationSvg className="mr-1" />
                    <Text className="text-sm text-grey-500 dark:text-grey-200">
                      {item.location}
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
    </SafeAreaView>
  );
}
