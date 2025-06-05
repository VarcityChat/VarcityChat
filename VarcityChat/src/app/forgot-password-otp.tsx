import OtpInput from "@/components/otp-input";
import { useToast } from "@/core/hooks/use-toast";
import { View, Text, Image, Button } from "@/ui";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const logo = require("../../assets/icon.png");

export default function ForgotPasswordOtp() {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ email: string }>();
  const { showToast } = useToast();

  const [otp, setOtp] = useState("");

  const onSubmit = () => {
    if (otp.length !== 4) {
      showToast({
        type: "info",
        text1: "Error",
        text2: "OTP digits must be four",
      });
      return;
    }
    router.push({
      pathname: "/reset-password",
      params: { otp, email: searchParams.email },
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView contentContainerClassName="flex flex-1 items-center justify-center px-8">
        <Image source={logo} className="w-[50px] h-[50px] rounded-md mt-10" />
        <View className="flex flex-1 w-full items-center justify-center -mt-16">
          <Text className="font-sans-bold text-2xl">Forgot password</Text>
          <View className="flex max-w-[90%]">
            <Text className="text-grey-500 text-sm mt-2 text-center text-wrap font-sans">
              We have sent a 4-digit code to{" "}
            </Text>
            <Text className="text-black text-sm text-center text-wrap font-sans-semibold">
              {searchParams.email}
            </Text>
          </View>
          <View className="mt-3 flex flex-row items-center">
            <Text className="text-grey-500 font-sans">Resend code in </Text>
            <Text className="text-primary-500 font-sans-bold">00:59</Text>
          </View>

          <View className="flex w-full mt-10">
            <OtpInput
              numOfInputs={4}
              value={otp}
              onChange={(value) => {
                setOtp(value);
              }}
            />

            <View className="mt-10">
              <Button label="Continue" onPress={onSubmit} />
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
