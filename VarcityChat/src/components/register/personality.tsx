import { View, Text, Button, TouchableOpacity, Input } from "@/ui";
import PlusSvg from "@/ui/icons/register/plus-svg";
import MarriedSvg from "@/ui/icons/register/married-svg";
import InARelationshipSvg from "@/ui/icons/register/in-a-relationship-svg";
import SingleSvg from "@/ui/icons/register/single-svg";
import { Platform } from "react-native";

export default function Personality() {
  return (
    <View className="flex flex-1 justify-center items-center mt-6">
      <Text className="font-sans-semibold text-2xl">Personality</Text>
      <Text className="text-grey-500 dark:text-grey-200">
        Let's get to find out more about you
      </Text>

      <View className="flex flex-1 w-full pt-8">
        <View>
          <Text className="font-sans">Images</Text>
          <Text className="text-grey-500 dark:text-grey-200 text-sm font-light">
            Lets put a face to the name, add images of yourself
          </Text>

          <View className="flex flex-row my-4 gap-4">
            <ImageSelectCard />
            <ImageSelectCard />
            <ImageSelectCard />
            <ImageSelectCard />
          </View>
        </View>

        <View className="mt-2">
          <Text className="font-sans">Relationship Status</Text>
          <View className="flex flex-row flex-wrap gap-4 py-3">
            <TouchableOpacity
              activeOpacity={0.7}
              className="px-3 py-2 rounded-full bg-grey-50 flex flex-row items-center gap-2 dark:bg-grey-800"
            >
              <SingleSvg />
              <Text className="text-grey-500 dark:text-grey-300">Single</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              className="px-3 py-2 rounded-full bg-grey-50 flex flex-row items-center gap-2 dark:bg-grey-800"
            >
              <MarriedSvg />
              <Text className="text-grey-500 dark:text-grey-300">Married</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              className="px-3 py-2 rounded-full bg-grey-50 flex flex-row items-center gap-2 dark:bg-grey-800"
            >
              <InARelationshipSvg />
              <Text className="text-grey-500 dark:text-grey-300">
                In a relationship
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-2">
          <Text className="font-sans">What are you looking for?</Text>

          <View className="flex flex-row flex-wrap gap-4 py-3">
            <TouchableOpacity
              activeOpacity={0.7}
              className="px-4 py-2 rounded-full bg-grey-50 dark:bg-grey-800"
            >
              <Text className="text-grey-500 dark:text-grey-300">
                Friendship
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              className="px-4 py-2 rounded-full bg-grey-50 dark:bg-grey-800"
            >
              <Text className="text-grey-500 dark:text-grey-300">
                Relationship
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              className="px-4 py-2 rounded-full bg-grey-50 dark:bg-grey-800"
            >
              <Text className="text-grey-500 dark:text-grey-300">Others</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-2">
          <Text className="font-sans my-2">Describe yourself</Text>
          <Input
            multiline
            style={{ height: 80, textAlignVertical: "top" }}
            placeholder="What do you want others to know about you?"
          />
        </View>

        <View className="mt-1">
          <View className="flex flex-row gap-2 items-center">
            <Text className="font-sans my-2">Hobbies</Text>
            <Text className="text-grey-300">( Click space to Move )</Text>
          </View>
          <Input
            multiline
            style={{ height: 80, textAlignVertical: "top" }}
            placeholder="List the things you like"
          />
        </View>

        <View className="mt-2">
          <Button label="Next" disabled />
        </View>

        <View
          className={Platform.select({ ios: "h-[40px]", android: "h-[100px]" })}
        />
      </View>
    </View>
  );
}

const ImageSelectCard = () => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex flex-1 h-[90px] bg-grey-50 dark:bg-grey-800 rounded-md items-center justify-center"
    >
      <PlusSvg />
    </TouchableOpacity>
  );
};
