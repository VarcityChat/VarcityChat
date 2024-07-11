import { zodResolver } from "@hookform/resolvers/zod";
import { View, Text, ControlledInput, Button, ControlledSelect } from "@/ui";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

const schema = z
  .object({
    fullName: z.string({ required_error: "Full Name is required" }),
    university: z.string({ required_error: "Select a university" }),
    course: z.string().optional(),
    phoneNumber: z.string().optional(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
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
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  return (
    <View className="flex flex-1 justify-center items-center mt-6">
      <Text className="font-bold text-2xl">Personal information</Text>
      <Text className="text-grey-500 dark:text-grey-200">
        We need your information to setup your account
      </Text>

      <View className="flex flex-1 w-full pt-10">
        <ControlledInput
          control={control}
          name="fullName"
          label="Full name"
          placeholder="What is your full name"
        />

        <ControlledSelect
          label="University"
          name="university"
          placeholder="Select your university"
          control={control}
          showSearch
          options={[
            { label: "Abraham Adesanya University", value: "a" },
            { label: "Adekunle Ajasin University", value: "aj" },
            { label: "University of Lagos", value: "unilag" },
            { label: "University of Ibadan", value: "ui" },
            { label: "Obafemi Awolowo University", value: "OA" },
            { label: "Olabisi Onabannjo University", value: "olabisi" },
            { label: "Lead City Unviersity", value: "lead city" },
            { label: "BackCock Unviersity", value: "babcock" },
            { label: "Convenant Unviersity", value: "convenant" },
            { label: "Abuad University", value: "Abuad" },
            { label: "Madona University", value: "madona" },
            { label: "Nile University", value: "nile" },
          ]}
          onSelect={() => {}}
        />

        <ControlledInput
          control={control}
          name="course"
          label="Course"
          placeholder="E.g Computer science"
        />
        <ControlledInput
          control={control}
          name="phoneNumber"
          label="Phone number"
          placeholder="Enter your phone number"
          keyboardType="number-pad"
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
          <Button label="Next" onPress={onNextPress} />
        </View>
      </View>
    </View>
  );
}
