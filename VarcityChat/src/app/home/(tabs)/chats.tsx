import { View, Text, Button } from "@/ui";
import { useRouter } from "expo-router";

export default function Chats() {
  const router = useRouter();

  return (
    <View>
      <Text>chats</Text>
      <Button
        label="Ebuka University"
        onPress={() => router.push("/home/chat-message")}
      />
    </View>
  );
}
