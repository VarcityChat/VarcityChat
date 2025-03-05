import { IS_IOS } from "@/ui";
import { Audio } from "expo-av";
import { useRef, useState } from "react";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const VOICE_RECORDER_HEIGHT = 55;
export const useVoiceRecorder = (onComplete?: () => void) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [duration, setDuration] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wasUnloadedRef = useRef(false);
  const audioLevels = useSharedValue(0);
  const containerHeight = useSharedValue(0);
  const buttonHeight = useSharedValue(0);
  const waveOpacity = useSharedValue(0);

  // Wave animation for recording visualization
  const waveValues = Array(20)
    .fill(0)
    .map((_, i) => ({
      height: useSharedValue(3 + Math.random() * 5),
      speed: 300 + Math.random() * 500,
    }));

  const containerStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(containerHeight.value, {
        duration: IS_IOS ? 200 : 50,
      }),
      opacity: interpolate(
        containerHeight.value,
        [0, VOICE_RECORDER_HEIGHT],
        [0, 1],
        "clamp"
      ),
    };
  });

  const sendButtonstyle = useAnimatedStyle(() => {
    return {
      height: withTiming(buttonHeight.value, { duration: 200 }),
    };
  });

  return {};
};
