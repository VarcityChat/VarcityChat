import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast, { ToastShowParams } from "react-native-toast-message";

export const useToast = () => {
  const insets = useSafeAreaInsets();
  const showToast = (toastShowParams: ToastShowParams) => {
    Toast.show({
      ...toastShowParams,
      position: "top",
      topOffset: insets.top + 5,
      text1Style: { fontFamily: "PlusJakartaSans_400Regular", fontSize: 14 },
      text2Style: { fontFamily: "PlusJakartaSans_400Regular", fontSize: 12 },
    });
  };

  return { showToast };
};
