import { View, Text, SafeAreaView } from "react-native";
import React from "react";

export default function ChatMessage() {
  return (
    <SafeAreaView className="flex flex-1">
      <Text className="text-xl text-primary-500">Chat Message</Text>
    </SafeAreaView>
  );
}
