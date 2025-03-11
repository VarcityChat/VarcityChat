import Header from "@/components/header";
import { TouchableOpacity, View, Text, Button, colors, useModal } from "@/ui";
import { useRouter } from "expo-router";
import { Share } from "react-native";

export default function TellAFriend() {
  const router = useRouter();
  const deleteModal = useModal();

  const handleShare = async () => {
    await Share.share({
      message: "Check out Varcity.chat",
      url: "https://varcity.chat",
      title: "Varcity Chat",
    });
  };

  return (
    <View className="flex-1">
      <Header title="Tell a friend">
        <View className="flex flex-1 px-6 mt-1">
          <View className="flex my-3 p-6 bg-grey-50 dark:bg-charcoal-800 rounded-2xl">
            <Text>
              Do you enjoy using our application? Kindly refer them to this
              space with your unique link
            </Text>

            <TouchableOpacity className="mt-3 pt-3 items-center border-[1px] border-red-500 rounded-md">
              <View className="flex flex-row gap-3">
                <Text>https://Varcity.chat/@ebukavarcity</Text>
              </View>
              <Text className="text-sm text-gray-700 mt-1 mb-3">
                Tap the link to copy it
              </Text>
            </TouchableOpacity>
          </View>

          <Button label="Share link" onPress={handleShare} />
        </View>
      </Header>
    </View>
  );
}
