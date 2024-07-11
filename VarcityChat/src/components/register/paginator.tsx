import { View } from "@/ui";
import Animated from "react-native-reanimated";

interface PaginatorProps {
  data: JSX.Element[] | number[];
  currentIndex: number;
}

const Paginator = ({ data, currentIndex }: PaginatorProps) => {
  return (
    <View className="flex flex-row items-center justify-center gap-3">
      {data.map((_, index) => {
        return (
          <Animated.View
            className="w-[40px] h-1 bg-gray-300"
            key={index.toString()}
            style={{ backgroundColor: currentIndex >= index ? "red" : "gray" }}
          ></Animated.View>
        );
      })}
    </View>
  );
};

export default Paginator;
