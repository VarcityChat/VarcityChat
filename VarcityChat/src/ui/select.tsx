import React from "react";
import {
  BottomSheetFlatList,
  BottomSheetTextInput,
  type BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { useColorScheme } from "nativewind";
import type { FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";
import {
  View,
  Platform,
  TouchableOpacity,
  Pressable,
  type PressableProps,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import type { SvgProps } from "react-native-svg";
import Svg, { Path } from "react-native-svg";
import { tv } from "tailwind-variants";

import colors from "./colors";
import { CaretDown } from "./icons/caret-down";

import type { InputControllerType } from "./input";
import { forwardRef, memo, useCallback, useMemo, useState } from "react";
import { Modal, useModal } from "./modal";
import { Text } from "./text";

const selectTv = tv({
  slots: {
    container: "mb-4",
    label: "text-black mb-1 text-base dark:text-white font-sans-regular",
    input:
      "border-grey-50 mt-0 bg-grey-50 flex-row items-center justify-center rounded-xl border-[0.5px] h-[44px] px-2 py-2 dark:border-neutral-500 dark:bg-neutral-800 font-sans-regular",
    inputValue: "text-black",
  },

  variants: {
    focused: {
      true: {
        input: "border-neutral-600",
      },
    },
    error: {
      true: {
        input: "border-danger-600 dark:border-danger-600",
        label: "text-danger-600 dark:text-danger-600",
        inputValue: "text-danger-600",
      },
    },
    disabled: {
      true: {
        input: "bg-neutral-200",
      },
    },
  },
  defaultVariants: {
    error: false,
    disabled: false,
  },
});

const List = Platform.OS === "web" ? FlashList : BottomSheetFlatList;

export type Option = { label: string; value: string | number };

type OptionProps = {
  options: Option[];
  onSelect: (option: Option) => void;
  value?: string | number;
  showSearch?: boolean;
  loading?: boolean;
};

function keyExtractor(item: Option) {
  return `select-item-${item.value}`;
}

export const Options = forwardRef<BottomSheetModal, OptionProps>(
  ({ options, onSelect, value, showSearch, loading }, ref) => {
    const { height: screenHeight } = useWindowDimensions();
    const [searchTerm, setSearchTerm] = useState("");
    const { colorScheme } = useColorScheme();
    const height = Math.min(options.length * 70 + 150, screenHeight * 0.8);
    const snapPoints = useMemo(() => [height], [height]);
    const isDark = colorScheme === "dark";

    const renderSelectItem = useCallback(
      ({ item }: { item: Option }) => (
        <Option
          key={`select-item-${item.value}`}
          label={item.label}
          selected={value === item.value}
          onPress={() => onSelect(item)}
        />
      ),
      [onSelect, value]
    );

    return (
      <Modal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: isDark ? colors.neutral[800] : colors.white,
        }}
      >
        <List
          ListHeaderComponent={
            showSearch ? (
              <View className="mb-4 mt-2 h-[44px] w-full">
                <BottomSheetTextInput
                  className="h-[44px] bg-grey-50 mx-6 rounded-md px-4 dark:bg-grey-800 dark:text-white font-sans"
                  placeholder="Search list of universities"
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
              </View>
            ) : null
          }
          ListEmptyComponent={() => {
            if (loading) {
              return (
                <View>
                  <ActivityIndicator size={30} />
                </View>
              );
            }
            return null;
          }}
          data={options.filter((option) => option.label.startsWith(searchTerm))}
          keyExtractor={keyExtractor}
          renderItem={renderSelectItem}
          estimatedItemSize={52}
        />
      </Modal>
    );
  }
);

export const Option = memo(
  ({
    label,
    selected = false,
    ...props
  }: PressableProps & { label: string; selected?: boolean }) => {
    return (
      <Pressable
        className="flex-row items-center border-b border-grey-50 bg-white px-3 py-4 mx-4 dark:border-neutral-700 dark:bg-neutral-800"
        {...props}
      >
        <Text className="flex-1 dark:text-neutral-100 ">{label}</Text>
        {selected && <Check />}
      </Pressable>
    );
  }
);

export interface SelectProps {
  value?: string | number;
  label?: string;
  disabled?: boolean;
  error?: string;
  options?: Option[];
  onSelect: (value: string | number) => void;
  placeholder?: string;
  showSearch?: boolean;
  loading?: boolean;
}

interface ControlledSelectProps<T extends FieldValues>
  extends SelectProps,
    InputControllerType<T> {}

export const Select = (props: SelectProps) => {
  const {
    label,
    value,
    error,
    options = [],
    placeholder = "select...",
    disabled = false,
    showSearch = false,
    loading = false,
    onSelect,
  } = props;

  const modal = useModal();

  const onSelectOption = useCallback(
    (option: Option) => {
      onSelect?.(option.value);
      modal.dismiss();
    },
    [modal, onSelect]
  );

  const styles = useMemo(
    () => selectTv({ error: Boolean(error), disabled }),
    [error, disabled]
  );

  const textValue = useMemo(
    () =>
      value !== undefined
        ? options?.filter((t) => t.value === value)?.[0]?.label ?? placeholder
        : placeholder,
    [value, options, placeholder]
  );

  return (
    <>
      <View className={styles.container()}>
        {label && <Text className={styles.label()}>{label}</Text>}
        <TouchableOpacity
          className={styles.input()}
          disabled={disabled}
          onPress={modal.present}
        >
          <View className="flex-1">
            <Text className={styles.inputValue()}>{textValue}</Text>
          </View>
          <CaretDown error={!!error} />
        </TouchableOpacity>
      </View>
      <Options
        ref={modal.ref}
        options={options}
        onSelect={onSelectOption}
        showSearch={showSearch}
        loading={loading}
      />
    </>
  );
};

export function ControlledSelect<T extends FieldValues>(
  props: ControlledSelectProps<T>
) {
  const {
    name,
    control,
    rules,
    onSelect: onNSelect,
    loading,
    ...selectProps
  } = props;

  const { field, fieldState } = useController({ name, control, rules });
  const onSelect = useCallback(
    (value: string | number) => {
      field.onChange(value);
      onNSelect?.(value);
    },
    [field, onNSelect]
  );

  return (
    <Select
      onSelect={onSelect}
      value={field.value}
      error={fieldState.error?.message}
      loading={loading}
      {...selectProps}
    />
  );
}

const Check = ({ ...props }: SvgProps) => (
  <Svg
    width={25}
    height={24}
    fill="none"
    viewBox="0 0 25 24"
    {...props}
    className="stroke-black dark:stroke-white"
  >
    <Path
      d="m20.256 6.75-10.5 10.5L4.506 12"
      strokeWidth={2.438}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
