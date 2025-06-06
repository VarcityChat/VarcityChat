import { useForgotPasswordMutation } from "@/api/auth/auth-api";
import OtpInput from "@/components/otp-input";
import { useApi } from "@/core/hooks/use-api";
import { useCountDownTimer } from "@/core/hooks/use-countdown-timer";
import { useToast } from "@/core/hooks/use-toast";
import { View, Image, Button, Text } from "@/ui";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const logo = require("../../assets/icon.png");

export default function ForgotPasswordOtp() {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ email: string }>();
  const { showToast } = useToast();
  const { callMutationWithErrorHandler } = useApi();
  const [forgotPassword, { isLoading: isOtpSending }] =
    useForgotPasswordMutation();
  const { minutes, seconds, resetTimer } = useCountDownTimer(true, 120);

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

  const resendOtp = async () => {
    const { isError } = await callMutationWithErrorHandler(() =>
      forgotPassword({ email: searchParams?.email }).unwrap()
    );
    if (!isError) {
      showToast({
        type: "success",
        text1: "OTP Resent Successfully",
        text2: "We have sent another OTP to your email.",
      });
      resetTimer();
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView contentContainerClassName="flex flex-1 items-center justify-center px-8">
        <Image source={logo} className="w-[50px] h-[50px] rounded-md mt-10" />
        <View className="flex flex-1 w-full items-center justify-center -mt-20">
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
            {seconds !== "00" ? (
              <>
                <Text className="text-grey-500 font-sans">Resend code in </Text>
                <Text className="text-primary-500 dark:text-primary-500 font-sans-bold">
                  {minutes}:{seconds}
                </Text>
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={resendOtp}
                disabled={isOtpSending}
              >
                <Text className="text-primary-500 dark:text-primary-500 font-sans-bold p-2">
                  Resend Code
                </Text>
              </TouchableOpacity>
            )}
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
              <Button
                label="Continue"
                onPress={onSubmit}
                disabled={otp.length !== 4}
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
