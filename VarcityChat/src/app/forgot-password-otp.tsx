import OtpInput from "@/components/otp-input";
import { View, Text, Image, ControlledInput, Button } from "@/ui";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const logo = require("../../assets/icon.png");

export default function ForgotPasswordOtp() {
  const router = useRouter();
  const { control } = useForm();

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView contentContainerClassName="flex flex-1 items-center justify-center px-8">
        <Image source={logo} className="w-[50px] h-[50px] rounded-md mt-10" />
        <View className="flex flex-1 w-full items-center justify-center -mt-16">
          <Text className="font-bold text-2xl">Forgot password</Text>
          <View className="flex max-w-[90%]">
            <Text className="text-grey-500 text-sm mt-2 text-center text-wrap font-sans">
              We have sent a 4-digit code to{" "}
            </Text>
            <Text className="text-black font-bold text-sm text-center text-wrap font-sans">
              promisesheggs@gmail.com
            </Text>
          </View>
          <View className="mt-3 flex flex-row items-center">
            <Text className="text-grey-500 font-sans">Resend code in </Text>
            <Text className="text-primary-500 font-sans-bold">00:59</Text>
          </View>

          <View className="flex w-full mt-10">
            <OtpInput numOfInputs={4} onChange={(e) => console.log(e)} />

            <View className="mt-10">
              <Button
                label="Continue"
                onPress={() => router.navigate("/reset-password")}
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
