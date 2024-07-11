import { View, Text, Button, TouchableOpacity, Input } from "@/ui";
import { Svg, Path } from "react-native-svg";

export default function Personality() {
  return (
    <View className="flex flex-1 justify-center items-center mt-6">
      <Text className="font-bold text-2xl">Personality</Text>
      <Text className="text-grey-500 dark:text-grey-200">
        Let's get to find out more about you
      </Text>

      <View className="flex flex-1 w-full pt-8">
        <View>
          <Text className="font-bold text-grey-500">Images</Text>
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
          <Text className="text-grey-500 font-bold">Relationship Status</Text>
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
          <Text className="text-grey-500 font-bold">
            What are you looking for?
          </Text>

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
          <Text className="font-semibold text-sm my-2">Describe yourself</Text>
          <Input
            multiline
            style={{ height: 80 }}
            placeholder="What do you want others to know about you?"
          />
        </View>

        <View className="mt-1">
          <View className="flex flex-row gap-2 items-center">
            <Text className="font-semibold text-sm my-2">Hobbies</Text>
            <Text className="text-grey-300">( Click space to Move )</Text>
          </View>
          <Input
            multiline
            style={{ height: 80 }}
            placeholder="List the things you like"
          />
        </View>

        <View className="mt-4">
          <Button label="Next" disabled />
        </View>

        <View className="h-[40px]" />
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

const PlusSvg = () => {
  return (
    <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <Path
        d="M11 0.5C8.22568 0.533662 5.57448 1.65072 3.6126 3.6126C1.65072 5.57448 0.533662 8.22568 0.5 11C0.533662 13.7743 1.65072 16.4255 3.6126 18.3874C5.57448 20.3493 8.22568 21.4663 11 21.5C13.7743 21.4663 16.4255 20.3493 18.3874 18.3874C20.3493 16.4255 21.4663 13.7743 21.5 11C21.4663 8.22568 20.3493 5.57448 18.3874 3.6126C16.4255 1.65072 13.7743 0.533662 11 0.5ZM17 11.75H11.75V17H10.25V11.75H5V10.25H10.25V5H11.75V10.25H17V11.75Z"
        fill="#E53333"
      />
    </Svg>
  );
};

const SingleSvg = () => {
  return (
    <Svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <Path
        d="M5 4.99998C6.15059 4.99998 7.08333 4.06724 7.08333 2.91665C7.08333 1.76605 6.15059 0.833313 5 0.833313C3.8494 0.833313 2.91666 1.76605 2.91666 2.91665C2.91666 4.06724 3.8494 4.99998 5 4.99998Z"
        fill="#6B7280"
      />
      <Path
        d="M5 6.04169C2.9125 6.04169 1.2125 7.44169 1.2125 9.16669C1.2125 9.28335 1.30417 9.37502 1.42083 9.37502H8.57917C8.69584 9.37502 8.7875 9.28335 8.7875 9.16669C8.7875 7.44169 7.0875 6.04169 5 6.04169Z"
        fill="#6B7280"
      />
    </Svg>
  );
};

const MarriedSvg = () => {
  return (
    <Svg width="8" height="10" viewBox="0 0 8 10" fill="none">
      <Path
        d="M4.00001 4.16665L2.33334 1.83331L3.00001 0.833313H5L5.66667 1.83331L4.00001 4.16665ZM5.45834 2.83331L4.95834 3.54165C5.87501 3.91665 6.5 4.79165 6.5 5.83331C6.5 6.49635 6.23661 7.13224 5.76777 7.60108C5.29893 8.06992 4.66305 8.33331 4.00001 8.33331C3.33696 8.33331 2.70108 8.06992 2.23224 7.60108C1.7634 7.13224 1.50001 6.49635 1.50001 5.83331C1.50001 4.79165 2.12501 3.91665 3.04167 3.54165L2.54167 2.83331C1.41667 3.37498 0.666672 4.49998 0.666672 5.83331C0.666672 6.71737 1.01786 7.56521 1.64298 8.19034C2.2681 8.81546 3.11595 9.16665 4.00001 9.16665C4.88406 9.16665 5.73191 8.81546 6.35703 8.19034C6.98215 7.56521 7.33334 6.71737 7.33334 5.83331C7.33334 4.49998 6.58334 3.37498 5.45834 2.83331Z"
        fill="#6B7280"
      />
    </Svg>
  );
};

const InARelationshipSvg = () => {
  return (
    <Svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <Path
        d="M3.75001 0.833313C2.65834 0.833313 1.77084 1.72081 1.77084 2.81248C1.77084 3.88331 2.60834 4.74998 3.70001 4.78748C3.73334 4.78331 3.76668 4.78331 3.79168 4.78748C3.80001 4.78748 3.80418 4.78748 3.81251 4.78748C3.81668 4.78748 3.81668 4.78748 3.82084 4.78748C4.88751 4.74998 5.72501 3.88331 5.72918 2.81248C5.72918 1.72081 4.84168 0.833313 3.75001 0.833313Z"
        fill="#6B7280"
      />
      <Path
        d="M5.86668 5.89583C4.70418 5.12083 2.80835 5.12083 1.63751 5.89583C1.10835 6.24999 0.816681 6.72916 0.816681 7.24166C0.816681 7.75416 1.10835 8.22916 1.63335 8.57916C2.21668 8.97083 2.98335 9.16666 3.75001 9.16666C4.51668 9.16666 5.28335 8.97083 5.86668 8.57916C6.39168 8.22499 6.68335 7.74999 6.68335 7.23333C6.67918 6.72083 6.39168 6.24583 5.86668 5.89583Z"
        fill="#6B7280"
      />
      <Path
        d="M8.32918 3.05835C8.39585 3.86669 7.82085 4.57502 7.02501 4.67085C7.02085 4.67085 7.02085 4.67085 7.01668 4.67085H7.00418C6.97918 4.67085 6.95418 4.67085 6.93335 4.67919C6.52918 4.70002 6.15835 4.57085 5.87918 4.33335C6.30835 3.95002 6.55418 3.37502 6.50418 2.75002C6.47501 2.41252 6.35835 2.10419 6.18335 1.84169C6.34168 1.76252 6.52501 1.71252 6.71251 1.69585C7.52918 1.62502 8.25835 2.23335 8.32918 3.05835Z"
        fill="#6B7280"
      />
      <Path
        d="M9.1625 6.91252C9.12916 7.31669 8.87083 7.66669 8.4375 7.90419C8.02083 8.13336 7.49583 8.24169 6.975 8.22919C7.275 7.95836 7.45 7.62086 7.48333 7.26252C7.525 6.74586 7.27916 6.25002 6.7875 5.85419C6.50833 5.63336 6.18333 5.45836 5.82916 5.32919C6.75 5.06252 7.90833 5.24169 8.62083 5.81669C9.00416 6.12502 9.2 6.51252 9.1625 6.91252Z"
        fill="#6B7280"
      />
    </Svg>
  );
};
