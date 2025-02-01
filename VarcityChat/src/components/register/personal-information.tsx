import { zodResolver } from "@hookform/resolvers/zod";
import { View, Text, ControlledInput, Button, ControlledSelect } from "@/ui";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { useAppDispatch } from "@/core/store/store";
import { setSignupData } from "@/core/auth/auth-slice";
import { useGetUniversitiesQuery } from "@/api/universities/university-api";
import { useToast } from "@/core/hooks/use-toast";
import { capitalize } from "@/core/utils";

const schema = z
  .object({
    firstname: z.string({ required_error: "First name is required" }),
    lastname: z.string({ required_error: "Last name is required" }),
    university: z.string({ required_error: "Select a university" }),
    course: z.string().optional(),
    phoneNumber: z.string().optional(),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must contain at least 6 character(s)" }),
    confirmPassword: z.string({
      required_error: "Confirm Password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type FormType = z.infer<typeof schema>;

interface PersonalInformationFormProps {
  onSubmit?: SubmitHandler<FormType>;
  onNextPress?: () => void;
}

export default function PersonalInformationForm({
  onSubmit = () => {},
  onNextPress,
}: PersonalInformationFormProps) {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { control, handleSubmit } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const {
    data: universities,
    isLoading,
    isError,
  } = useGetUniversitiesQuery(null);

  const handleNext = (data: FormType) => {
    if (!isError) {
      dispatch(setSignupData({ ...data }));
      onNextPress?.();
    }
  };

  if (isError) {
    showToast({
      type: "error",
      text1: "Error",
      text2:
        "Could not get universities at the moment, check your internet connection and try again",
    });
  }

  return (
    <View className="flex flex-1 justify-center items-center mt-6">
      <Text className="font-sans-semibold text-2xl">Personal information</Text>
      <Text className="text-grey-500 dark:text-grey-200 font-sans-regular">
        We need your information to setup your account
      </Text>

      <View className="flex flex-1 w-full pt-10">
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

        <ControlledSelect
          label="University"
          name="university"
          placeholder="Select your university"
          control={control}
          showSearch
          loading={isLoading}
          options={universities?.map((university) => ({
            label: capitalize(university.name),
            value: university._id,
          }))}
          onSelect={() => {}}
        />

        <ControlledInput
          control={control}
          name="course"
          label="Course of Study"
          placeholder="E.g Computer science"
        />
        <ControlledInput
          control={control}
          name="password"
          label="Password"
          placeholder="Create password"
          isPassword
        />
        <ControlledInput
          control={control}
          name="confirmPassword"
          label="Confirm password"
          placeholder="Re-enter password"
          isPassword
        />
        <View className="mt-2">
          <Button label="Next" onPress={handleSubmit(handleNext)} />
        </View>
      </View>
    </View>
  );
}
