import { View, Text, Image, ControlledInput, Button } from "@/ui";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const logo = require("../../assets/icon.png");

export default function ForgotPassword() {
  const router = useRouter();
  const { control } = useForm();

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView contentContainerClassName="flex flex-1 items-center justify-center px-8">
        <Image source={logo} className="w-[50px] h-[50px] rounded-md mt-10" />
        <View className="flex flex-1 w-full items-center justify-center -mt-16">
          <Text className="font-sans-bold text-2xl">Forgot password</Text>
          <Text className="text-grey-500 text-sm mt-2 text-center font-sans">
            We would help you get your account back! An otp would be sent to the
            phone number
          </Text>

          <View className="flex w-full mt-10">
            <ControlledInput
              control={control}
              label="Email"
              keyboardType="email-address"
              name="email"
              placeholder="Enter your email"
            />

            <View className="mt-10">
              <Button
                label="Continue"
                onPress={() => router.navigate("/forgot-password-otp")}
              />
              <Link
                href="/login"
                className="font-sans-bold text-primary-500 text-center my-3"
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
