import { View, Text, Image, Button } from "@/ui";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native";
const onboardingImage = require("../../../../assets/images/onboarding/onboarding2.png");

export default function OnboardingTwo() {
  const router = useRouter();

  return (
    <View className="flex h-full">
      <Image source={onboardingImage} className="w-full h-[57%]" />

      <View className="px-8 mt-16 flex flex-1">
        <View className="my-4 flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-full bg-gray-300"></View>
          <View className="w-3 h-3 rounded-full bg-primary-600"></View>
        </View>

        <Text className="text-base text-primary-500 font-sans-bold">
          Relationships ❤️
        </Text>
        <Text className="text-2xl font-sans-semibold mt-2 text-black dark:text-white">
          Build long lasting bonds with Varcity Chat
        </Text>

        <SafeAreaView className="mt-10">
          <Button
            label="Next"
            onPress={() => {
              router.push("/register");
            }}
          />
        </SafeAreaView>
      </View>
    </View>
  );
}
