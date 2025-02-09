import Header, { HEADER_HEIGHT } from "@/components/header";
import { View, Button, ControlledInput } from "@/ui";
import { KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/core/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateUserMutation } from "@/api/auth/auth-api";
import { useToast } from "@/core/hooks/use-toast";
import { useApi } from "@/core/hooks/use-api";

const schema = z.object({
  firstname: z
    .string({ required_error: "First name is required" })
    .min(2, { message: "First name must contain at least 2 character(s)." }),
  lastname: z
    .string({ required_error: "Last name is required" })
    .min(2, { message: "Last name must contain at least 2 character(s)." }),
  mobileNumber: z
    .string()
    .regex(/^\d{11}$/, { message: "Phone number must be exactly 11 digits" })
    .optional(),
  course: z.string().optional(),
});

type FormType = z.infer<typeof schema>;

export default function PersonalInformation() {
  const { user } = useAuth();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { showToast } = useToast();
  const { callMutationWithErrorHandler } = useApi();
  const { control, handleSubmit } = useForm<FormType>({
    defaultValues: {
      firstname: user?.firstname,
      lastname: user?.lastname,
      course: user?.course,
      mobileNumber: user?.mobileNumber,
    },
    resolver: zodResolver(schema),
  });

  const handleSave = async (data: FormType) => {
    const dataToUpdate = {
      firstname: data.firstname,
      lastname: data.lastname,
      course: data.course,
      mobileNumber: data.mobileNumber,
    };

    const { isError } = await callMutationWithErrorHandler(() =>
      updateUser(dataToUpdate).unwrap()
    );
    if (!isError) {
      showToast({
        type: "success",
        text1: "Success",
        text2: "Your personal information has been updated",
      });
    }
  };

  return (
    <View className="flex flex-1">
      <Header title="Personal Information">
        <KeyboardAvoidingView
          className="flex-1 px-6 mt-6"
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT + useSafeAreaInsets().top,
          }}
        >
          <View className="flex flex-1 w-full">
            <ControlledInput
              control={control}
              name="firstname"
              label="First name"
              placeholder="First name"
            />
            <ControlledInput
              control={control}
              name="lastname"
              label="Last name"
              placeholder="Last name"
            />

            <ControlledInput
              control={control}
              name="course"
              label="Course of Study"
              placeholder="E.g Computer science"
            />

            <ControlledInput
              control={control}
              name="mobileNumber"
              label="Phone Number"
              placeholder="E.g 08012345678"
            />
          </View>

          <View className="mt-2">
            <Button
              label="Save"
              onPress={handleSubmit(handleSave)}
              loading={isLoading}
            />
          </View>
        </KeyboardAvoidingView>
      </Header>
    </View>
  );
}
