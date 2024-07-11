import { View, Text, Image, Button } from "@/ui";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native";
const onboardingImage = require("../../../assets/images/onboarding/onboarding.png");

export default function OnboardingOne() {
  const router = useRouter();

  return (
    <View className="flex h-full">
      <Image source={onboardingImage} className="w-full h-[55%]" />

      <View className="px-8 mt-16 flex flex-1">
        <View className="my-4 flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-full bg-primary-600"></View>
          <View className="w-3 h-3 rounded-full bg-gray-300"></View>
        </View>
        <Text className="text-base text-primary-500 font-bold">
          Connection 🌍
        </Text>
        <Text className="text-2xl font-semibold mt-1">
          Connect easily with students around the globe
        </Text>

        <SafeAreaView className="mt-16">
          <Button
            label="Next"
            onPress={() => {
              router.push("onboarding/onboarding-two");
            }}
          />
        </SafeAreaView>
      </View>
    </View>
  );
}
