import { cssInterop } from "nativewind";
import Svg from "react-native-svg";

export { default as colors } from "./colors";
export * from "./text";
export * from "./image";
export * from "./button";
export * from "./input";
export * from "./select";
export * from "./modal";
export * from "./list";
export * from "./utils";

export {
  ActivityIndicator,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";

//Apply cssInterop to Svg to resolve className string into style
cssInterop(Svg, {
  className: {
    target: "style",
  },
});
