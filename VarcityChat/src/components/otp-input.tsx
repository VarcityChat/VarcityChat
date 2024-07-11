import { View, Text, Input } from "@/ui";
import { useState, useRef, useEffect } from "react";
import { TextInput } from "react-native";

interface OtpInputProps {
  numOfInputs?: number;
  value?: string;
  onChange: (otp: string) => void;
}

export default function OtpInput({
  numOfInputs = 6,
  value = "",
  onChange,
}: OtpInputProps) {
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<TextInput[] | null[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, numOfInputs);
  }, [numOfInputs]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const getOtpValue = () => (value ? value.toString().split("") : []);

  const handleOtpChange = (otp: string[]) => {
    const otpValue = otp.join("");
    onChange(otpValue);
  };

  const changeCodeAtFocus = (value: string) => {
    const otp = getOtpValue();
    otp[activeInput] = value[0];
    handleOtpChange(otp);
  };

  const isInputValueValid = (value: string) =>
    !isNaN(Number(value)) && value.trim().length === 1;

  const focusInput = (index: number) => {
    const activeInput = Math.max(Math.min(numOfInputs - 1, index), 0);

    if (inputRefs.current[activeInput]) {
      inputRefs.current[activeInput]?.focus();
      setActiveInput(activeInput);
    }
  };

  const handleChange = (value: string) => {
    console.log(value);
    if (value === "") {
      changeCodeAtFocus("");
      focusInput(activeInput - 1);
      return;
    }

    if (isInputValueValid(value)) {
      changeCodeAtFocus(value);
      focusInput(activeInput + 1);
    }
  };

  return (
    <View className="w-full flex flex-row gap-4">
      {Array.from({ length: numOfInputs }).map((_, index) => {
        return (
          <View
            className="flex flex-1 h-[70px] rounded-md bg-grey-50 dark:bg-grey-800"
            key={`field-${index}`}
          >
            <TextInput
              ref={(element) => (inputRefs.current[index] = element)}
              maxLength={1}
              keyboardType="number-pad"
              className="w-full h-full flex text-center text-2xl dark:text-white"
              onChangeText={handleChange}
            />
          </View>
        );
      })}
    </View>
  );
}
