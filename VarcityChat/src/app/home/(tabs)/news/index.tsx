import { View, Text, Image } from "@/ui";
import ParallaxScrollView from "../../../../../components/ParallaxScrollView";
import { femaleImg } from "@/ui/images";

export default function NewsScreen() {
  return (
    <View className="flex flex-1">
      <Text>News</Text>
      <ParallaxScrollView
        headerImage={<Image source={femaleImg} />}
        headerBackgroundColor={{ dark: "red", light: "red" }}
      />
    </View>
  );
}
