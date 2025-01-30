import { View, Text, Image, HEIGHT } from "@/ui";
import { noNewsImg } from "@/ui/images";
import Header from "@/components/header";

export default function NewsScreen() {
  return (
    <View className="flex flex-1">
      <Header title="News" showHeaderLeft={false}>
        <View
          className="flex flex-1 items-center justify-center"
          style={{ height: HEIGHT * 0.7 }}
        >
          <Image
            source={noNewsImg}
            className="w-[120px] h-[120px] object-contain"
          />

          <Text className="mt-8 text-lg text-grey-500">
            This page is coming soon
          </Text>
          <Text className="text-lg text-grey-500">Aniticpate...</Text>
        </View>
      </Header>
    </View>
  );
}
