import { useLoginMutation } from "@/api/auth/auth-api";
import { useApi } from "@/core/hooks/use-api";
import { View, Text, Image, ControlledInput, Button } from "@/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Platform, Pressable, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { z } from "zod";
const logo = require("../../assets/icon.png");

const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 character(s)" }),
});

type FormType = z.infer<typeof schema>;

export default function Login() {
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const { callMutationWithErrorHandler } = useApi();
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: FormType) => {
    try {
      const { isError } = await callMutationWithErrorHandler(() =>
        login(data).unwrap()
      );
      if (!isError) {
        router.replace("/");
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView
        contentContainerClassName="flex-1 flex-grow items-center px-8 gap-24"
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === "ios"}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="items-center">
          <Image
            source={logo}
            className={`w-[50px] h-[50px] rounded-md ${Platform.select({
              android: "mt-12",
              ios: "mt-6",
            })}`}
          />
        </View>
        <View className="w-full items-center justify-center pb-20">
          <Text className="font-sans-bold text-2xl">Login</Text>
          <Text className="text-grey-500 text-sm mt-2 font-sans">
            Fill in the information below to access your account
          </Text>

          <View className="flex w-full mt-10">
            <ControlledInput
              control={control}
              label="Email"
              keyboardType="email-address"
              name="email"
              placeholder="Enter your email"
            />
            <ControlledInput
              control={control}
              label="Password"
              name="password"
              placeholder="Enter your password"
              isPassword
            />

            <View className="flex items-end mt-2">
              {/* <Link
                href="/forgot-password"
                className="text-primary-500 font-sans-semibold text-sm"
              >
                Forgot password?
              </Link> */}
            </View>

            <View className="mt-10">
              <Button
                label="Login"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
              />
              <Pressable
                onPress={() => {
                  router.push("/register");
                }}
              >
                <Text className="font-sans-bold text-primary-500 text-center my-3">
                  Create Account
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
