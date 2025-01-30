import Header from "@/components/header";
import { View, Text, List, TouchableOpacity, HEIGHT } from "@/ui";
import CallsActive from "@/ui/icons/calls-active";
import ThreeDotsSvg from "@/ui/icons/three-dots";

const calls = [
  { id: 1, name: "Ebuka Varcity", timestamp: "Yesterday at 7:00 pm" },
];

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
        <List
          data={[]}
          renderItem={() => <></>}
          estimatedItemSize={50}
          ListEmptyComponent={<EmptyStaste />}
        />
      </Header>
    </View>
  );
}

function EmptyStaste() {
  return (
    <View
      className="flex flex-1 items-center justify-center"
      style={{ height: HEIGHT / 1.5 }}
    >
      <CallsActive fill={"rgba(107, 114, 128, 1)"} />
      <Text className="text-grey-500 dark:text-grey-200 mt-4">
        Your call log is empty
      </Text>
    </View>
  );
}
