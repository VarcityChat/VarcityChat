import { View, Text, Image, ControlledInput, Button } from "@/ui";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { SafeAreaView, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApi } from "@/core/hooks/use-api";
import { useResetPasswordMutation } from "@/api/auth/auth-api";
import { useToast } from "@/core/hooks/use-toast";
const logo = require("../../../assets/icon.png");

const schema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must contain at least 6 character(s)" })
      .max(20, { message: "Password must not exceed 20 characters" }),
    confirmPassword: z.string().min(6, {
      message: "Confirm Password must contain at least 6 character(s)",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormType = z.infer<typeof schema> & { otp: string; email: string };

export default function ResetPassword() {
  const router = useRouter();

  // Expecting email and otp as route parameters from the 'forgot-password-otp' screen
  const searchParams = useLocalSearchParams<{ otp: string; email: string }>();

  const { control, handleSubmit } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const { callMutationWithErrorHandler } = useApi();
  const { showToast } = useToast();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onSubmit = async (data: FormType) => {
    data.otp = searchParams.otp;
    data.email = searchParams.email;
    const { isError } = await callMutationWithErrorHandler(() =>
      resetPassword({
        otp: data.otp,
        password: data.password,
        email: data.email,
      }).unwrap()
    );
    if (!isError) {
      showToast({
        type: "success",
        text1: "Success",
        text2: "Password reset successfully",
      });
      setTimeout(() => {
        router.navigate("/login");
      }, 1000);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView contentContainerClassName="flex-1 items-center px-8 gap-16">
        <Image
          source={logo}
          className={`w-[50px] h-[50px] rounded-md ${Platform.select({
            android: "mt-12",
            ios: "mt-6",
          })}`}
        />
        <View className="w-full items-center justify-center mt-20">
          <Text className="font-sans-bold text-2xl">Reset password</Text>
          <Text className="text-grey-500 text-sm mt-2 font-sans">
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
              name="confirmPassword"
              placeholder="Re-enter password"
              isPassword
            />

            <View className="mt-10">
              <Button
                label="Done"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
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
