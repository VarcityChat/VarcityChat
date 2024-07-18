import Header, { HEADER_HEIGHT } from "@/components/header";
import { View, Input, Button } from "@/ui";
import { KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PersonalInformation() {
  return (
    <View className="flex-1">
      <Header title="Personal Information">
        <KeyboardAvoidingView
          className="flex-1 px-6 mt-6"
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT + useSafeAreaInsets().top,
          }}
        >
          <Input label="Full name" />
          <Input label="Phone number" keyboardType="number-pad" />
          <Button label="Save" />
        </KeyboardAvoidingView>
      </Header>
    </View>
  );
}
