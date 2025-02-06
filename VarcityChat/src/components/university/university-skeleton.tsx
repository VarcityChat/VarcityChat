import React from "react";
import { View } from "react-native";
import { Skeleton } from "moti/skeleton";
import { useColorScheme } from "nativewind";

const UniversitySkeleton = () => {
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex-1">
      <View className="mb-4">
        <Skeleton width={150} height={24} radius={4} colorMode={colorScheme} />
      </View>
      <View className="flex-row flex-wrap">
        {Array(9)
          .fill(0)
          .map((_, index) => (
            <View
              key={index}
              style={{ width: "31%" }}
              className={`h-[130px] mb-8 
              ${index % 3 === 2 ? "ml-[3.5%]" : ""}
              ${index % 3 === 0 ? "mr-[3.5%]" : ""}
              ${index % 3 === 1 ? "mx-0" : ""}`}
            >
              <View className="w-full h-[90px]">
                <Skeleton
                  colorMode={colorScheme}
                  width="100%"
                  height={90}
                  //   height={"100%"}
                  radius={6}
                />
              </View>
              <View className="mt-2">
                <Skeleton
                  colorMode={colorScheme}
                  width="80%"
                  height={16}
                  radius={4}
                />
              </View>
            </View>
          ))}
      </View>
    </View>
  );
};

export default UniversitySkeleton;
