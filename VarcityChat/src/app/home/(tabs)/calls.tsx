import Header from "@/components/header";
import { View, Text, List, TouchableOpacity } from "@/ui";
import ThreeDotsSvg from "@/ui/icons/three-dots";

export default function CallsScreen() {
  return (
    <View className="flex-1">
      <Header
        title="Calls"
        showHeaderLeft={false}
        headerRight={
          <TouchableOpacity
            activeOpacity={0.7}
            className="w-[25px] h-[25px] items-center justify-center"
          >
            <ThreeDotsSvg />
          </TouchableOpacity>
        }
      >
        <List data={[]} renderItem={() => <></>} estimatedItemSize={50} />
      </Header>
    </View>
  );
}
