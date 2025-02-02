import { View } from "@/ui";
import { PropsWithChildren } from "react";
import { useWindowDimensions } from "react-native";

export default function RegisterItem({ children }: PropsWithChildren) {
  const { width } = useWindowDimensions();

  return (
    <View className={`flex-1`} style={{ width }}>
      {children}
    </View>
  );
}
