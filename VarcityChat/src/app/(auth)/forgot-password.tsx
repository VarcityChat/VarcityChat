import { View, Text, Image, ControlledInput, Button } from "@/ui";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Platform, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApi } from "@/core/hooks/use-api";
import { useForgotPasswordMutation } from "@/api/auth/auth-api";
const logo = require("../../../assets/icon.png");

const schema = z.object({
  email: z.string().email(),
});

type FormType = z.infer<typeof schema>;

export default function ForgotPassword() {
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const { callMutationWithErrorHandler } = useApi();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = async (data: FormType) => {
    const { isError } = await callMutationWithErrorHandler(() =>
      forgotPassword(data).unwrap()
    );
    if (!isError) {
      router.push({
        pathname: "/forgot-password-otp",
        params: { email: data.email },
      });
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
