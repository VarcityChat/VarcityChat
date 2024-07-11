import { View, Text, Image, ControlledInput, Button } from "@/ui";
import { Link } from "expo-router";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const logo = require("../../assets/icon.png");

export default function ResetPassword() {
  const { control } = useForm();

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView contentContainerClassName="flex flex-1 items-center justify-center px-8">
        <Image source={logo} className="w-[50px] h-[50px] rounded-md mt-10" />
        <View className="flex flex-1 w-full items-center justify-center -mt-16">
          <Text className="font-bold text-2xl">Reset password</Text>
          <Text className="text-grey-500 text-sm mt-2">
            Kindly create a new password for your account
          </Text>

          <View className="flex w-full mt-10">
            <ControlledInput
              control={control}
              label="Password"
              name="password"
              placeholder="Create password"
              isPassword
            />
            <ControlledInput
              control={control}
              label="Confirm Password"
              name="confirm-password"
              placeholder="Re-enter password"
              isPassword
            />

            <View className="mt-10">
              <Button label="Done" />
              <Link
                href="login"
                className="font-bold text-primary-500 text-center my-3"
              >
                Back to login
              </Link>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
