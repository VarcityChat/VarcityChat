import React from "react";
import type { PressableProps, View } from "react-native";
import { ActivityIndicator, Pressable, Text } from "react-native";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const button = tv({
  slots: {
    container: "my-2 flex flex-row items-center justify-center rounded-md px-4",
    label: "font-inter text-base font-semibold",
    indicator: "h-6 text-white",
  },

  variants: {
    variant: {
      default: {
        container: "bg-primary-600",
        label: "text-white font-sans-bold",
        indicator: "text-white",
      },
      secondary: {
        container: "bg-primary-600",
        label: "text-secondary-600 font-sans-bold",
        indicator: "text-white",
      },
      outline: {
        container: "border border-neutral-400",
        label: "text-black dark:text-neutral-100 font-sans-bold",
        indicator: "text-black dark:text-neutral-100",
      },
      destructive: {
        container: "bg-red-600",
        label: "text-white font-sans-bold",
        indicator: "text-white",
      },
      ghost: {
        container: "bg-transparent",
        label: "text-black underline dark:text-white font-sans-bold",
        indicator: "text-black dark:text-white",
      },
      link: {
        container: "bg-transparent",
        label: "text-black",
        indicator: "text-black",
      },
      tertiary: {
        container: "bg-grey-50 dark:bg-grey-800",
        label: "text-black dark:text-white font-sans-bold",
      },
    },
    size: {
      default: {
        container: "h-14 px-4",
        label: "text-base",
      },
      lg: {
        container: "h-16 px-8",
        label: "text-xl",
      },
      sm: {
        container: "h-8 px-3",
        label: "text-sm",
        indicator: "h-2",
      },
      icon: { container: "h-9 w-9" },
    },
    disabled: {
      true: {
        container: "bg-[#E5333380]",
        label: "text-[#FFFFFFCC]",
        indicator: "text-neutral-400 dark:text-neutral-400",
      },
    },
    fullWidth: {
      true: {
        container: "",
      },
      false: {
        container: "self-center",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    disabled: false,
    fullWidth: true,
    size: "default",
  },
});

type ButtonVariants = VariantProps<typeof button>;
interface Props extends ButtonVariants, Omit<PressableProps, "disabled"> {
  label?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
}

export const Button = React.forwardRef<View, Props>(
  (
    {
      label: text,
      loading = false,
      variant = "default",
      disabled = false,
      size = "default",
      className = "",
      testID,
      textClassName = "",
      ...props
    },
    ref
  ) => {
    const styles = React.useMemo(
      () => button({ variant, disabled, size }),
      [variant, disabled, size]
    );

    return (
      <Pressable
        disabled={disabled || loading}
        className={styles.container({ className })}
        {...props}
        ref={ref}
        testID={testID}
      >
        {props.children ? (
          props.children
        ) : (
          <>
            {loading ? (
              <ActivityIndicator
                size="small"
                className={styles.indicator()}
                testID={testID ? `${testID}-activity-indicator` : undefined}
              />
            ) : (
              <Text
                testID={testID ? `${testID}-label` : undefined}
                className={styles.label({ className: textClassName })}
              >
                {text}
              </Text>
            )}
          </>
        )}
      </Pressable>
    );
  }
);
