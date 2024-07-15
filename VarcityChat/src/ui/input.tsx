import { forwardRef, useCallback, useMemo, useState } from "react";
import type { TextInput, TextInputProps } from "react-native";
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { View, Pressable, TextInput as NTextInput } from "react-native";
import { useController } from "react-hook-form";
import { tv } from "tailwind-variants";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "./text";

const inputTv = tv({
  slots: {
    container: "mb-3",
    label: "text-black mb-1 text-base dark:text-white",
    input:
      "mt-0 rounded-xl border-[0.5px] border-grey-50 bg-grey-50 px-2 py-2 h-[44px] font-inter text-base leading-5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white",
    passwordButton: "w-[40px] h-[40px] flex items-center justify-center",
  },

  variants: {
    focused: {
      true: {
        input: "border-neutral-400 dark:border-neutral-300",
      },
    },
    error: {
      true: {
        input: "border-danger-600",
        label: "text-danger-600 dark:text-danger-600",
      },
    },
    disabled: {
      true: {
        input: "bg-neutral-200",
      },
    },
  },
  defaultVariants: {
    focused: false,
    error: false,
    disabled: false,
  },
});

export interface NInputProps extends TextInputProps {
  label?: string;
  disabled?: boolean;
  error?: string;
  isPassword?: boolean;
}

type TRule = Omit<
  RegisterOptions,
  "valueAsNumber" | "valueAsDate" | "setValueAs"
>;

export type RuleType<T> = { [name in keyof T]: TRule };
export type InputControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
};

interface ControlledInputProps<T extends FieldValues>
  extends NInputProps,
    InputControllerType<T> {}

export const Input = forwardRef<TextInput, NInputProps>((props, ref) => {
  const { label, error, isPassword = false, ...inputProps } = props;

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const onBlur = useCallback(() => {
    setIsFocused(false);
  }, []);
  const onFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const styles = useMemo(
    () =>
      inputTv({
        error: Boolean(error),
        focused: isFocused,
        disabled: Boolean(props.disabled),
      }),
    [error, isFocused, props.disabled]
  );

  return (
    <View className={styles.container()}>
      {label && <Text className={styles.label()}>{label}</Text>}
      {!isPassword ? (
        <NTextInput
          ref={ref}
          placeholderTextColor={"#9CA1AA"}
          className={styles.input()}
          onBlur={onBlur}
          onFocus={onFocus}
          {...inputProps}
        />
      ) : (
        <View className={`${styles.input()} justify-center`}>
          <View className="flex flex-row w-full">
            <NTextInput
              ref={ref}
              placeholderTextColor={"#9CA1AA"}
              className={`h-full flex-1 dark:text-white`}
              onBlur={onBlur}
              onFocus={onFocus}
              secureTextEntry={showPassword}
              {...inputProps}
            />
            <Pressable
              className={styles.passwordButton()}
              onPress={() => setShowPassword((prev) => !prev)}
            >
              <Ionicons name="eye" size={20} color="#898E99" />
            </Pressable>
          </View>
        </View>
      )}
      {error && (
        <Text className="text-sm text-danger-400 dark:text-danger-600">
          {error}
        </Text>
      )}
    </View>
  );
});

// only used with react-hook-form
export function ControlledInput<T extends FieldValues>(
  props: ControlledInputProps<T>
) {
  const { name, control, rules, ...inputProps } = props;
  const { field, fieldState } = useController({ name, control, rules });

  return (
    <Input
      ref={field.ref}
      autoCapitalize="none"
      onChangeText={field.onChange}
      value={(field.value as string) || ""}
      error={fieldState.error?.message}
      {...inputProps}
    />
  );
}
