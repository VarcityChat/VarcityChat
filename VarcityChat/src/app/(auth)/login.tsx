import { useLoginMutation } from "@/api/auth-api";
import { useApi } from "@/core/hooks/use-api";
import { View, Text, Image, ControlledInput, Button } from "@/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Pressable, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { z } from "zod";
const logo = require("../../../assets/icon.png");

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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
    await callMutationWithErrorHandler(() => login(data).unwrap());
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView contentContainerClassName="flex flex-1 items-center justify-center px-8">
        <Image source={logo} className="w-[50px] h-[50px] rounded-md mt-10" />
        <View className="flex flex-1 w-full items-center justify-center -mt-16">
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
              <Link
                href="/forgot-password"
                className="text-primary-500 font-sans-semibold text-sm"
              >
                Forgot password?
              </Link>
            </View>

            <View className="mt-10">
              <Button
                label="Login"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                // onPress={() => router.replace("/(tabs)/discover")}
              />
              <Pressable
                onPress={() => {
                  router.push("/register");
                }}
              >
                <Text className="font-sans-bold text-primary-500 text-center my-3">
                  I don't have an account!
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
