import { useEffect, useState, useRef } from "react";
import { Text, View, TouchableOpacity } from "@/ui";
import { Audio } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolate,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/ui";
import { useColorScheme } from "nativewind";
import { StyleSheet } from "react-native";
import SendSvg from "@/ui/icons/chat/send-svg";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface VoiceRecorderProps {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  onSend: (audioUri: string) => void;
  onCancel?: () => void;
}

export const VoiceRecorder = ({
  isRecording,
  setIsRecording,
  onSend,
  onCancel,
}: VoiceRecorderProps) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
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
      height: withTiming(containerHeight.value, { duration: 300 }),
      opacity: interpolate(containerHeight.value, [0, 44], [0, 1], "clamp"),
    };
  });

  const sendButtonstyle = useAnimatedStyle(() => {
    return {
      height: withTiming(buttonHeight.value, { duration: 300 }),
    };
  });

  const waveContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: waveOpacity.value,
    };
  });

  // Create wave animations
  const waveStyles = waveValues.map(({ height, speed }, index) => {
    return useAnimatedStyle(() => {
      const h = interpolate(
        audioLevels.value,
        [0, 0.5, 1],
        [height.value * 0.5, height.value * 1.5, height.value * 2.5]
      );

      return {
        height: withSequence(
          withTiming(h, { duration: speed }),
          withTiming(height.value, { duration: speed })
        ),
      };
    });
  });

  // Format the duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Start recording function
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      setRecording(newRecording);
      await newRecording.prepareToRecordAsync();
      await newRecording.startAsync();

      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);
      containerHeight.value = 44;
      waveOpacity.value = withTiming(1, { duration: 300 });

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
        // Simulate audio levels - in a real app you would use actual audio levels
        audioLevels.value = Math.random();
      }, 1000);
    } catch (error) {
      console.log("Failed to start recording:", error);
    }
  };

  // Pause/resume recording
  const togglePause = async () => {
    if (!recording) return;
    try {
      if (isPaused) {
        // Resume recording
        await recording.startAsync();
        timerRef.current = setInterval(() => {
          setDuration((prev) => prev + 1);
          audioLevels.value = Math.random();
        }, 1000);
      } else {
        // Pause recording
        await recording.pauseAsync();
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
      setIsPaused(!isPaused);
    } catch (error) {
      console.error("Failed to toggle pause", error);
    }
  };

  // Stop recording and get the file
  const stopRecording = async () => {
    if (!recording) return;
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      waveOpacity.value = withTiming(0, { duration: 300 });
      setRecording(null);

      if (uri) {
        setAudioUri(uri);
        return uri;
      }
      return null;
    } catch (error) {
      console.error("Failed to stop recording", error);
      return null;
    }
  };

  const handleSend = async () => {
    const uri = await stopRecording();
    if (uri) {
      onSend(uri);
      resetRecorder();
    }
  };

  const handleCancel = () => {
    resetRecorder();
    onCancel?.();
  };

  // Reset the recorder state
  const resetRecorder = () => {
    setRecording(null);
    setAudioUri(null);
    setIsRecording(false);
    setIsPaused(false);
    setDuration(0);
    containerHeight.value = 0;
    audioLevels.value = 0;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startRecording();
  }, []);

  // Clean up on unmonut
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  return (
    <Animated.View
      className="w-full flex-row items-center py-2 px-4 bg-white dark:bg-black"
      style={[containerStyle]}
    >
      {isRecording && (
        <TouchableOpacity
          className="w-6 h-6 flex flex-row items-center justify-center rounded-full mr-6"
          onPress={handleCancel}
        >
          <Ionicons name="close" size={18} color={isDark ? "white" : "black"} />
        </TouchableOpacity>
      )}

      {(isRecording || audioUri) && (
        <>
          <View className="flex-row flex-1 items-center">
            {audioUri && (
              <Text className="text-base font-semibold text-black dark:text-white">
                Recording Complete
              </Text>
            )}
            {!audioUri && (
              <Animated.View
                style={[waveContainerStyle]}
                className="flex-row justify-center items-end my-2"
              >
                {waveStyles.map((style, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.wave,
                      style,
                      {
                        backgroundColor: isPaused
                          ? colors.grey[400]
                          : colors.primary[500],
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            )}
            <Text className="text-base text-primary-500 font-semibold ml-4">
              {formatDuration(duration)}
            </Text>
          </View>
        </>
      )}

      {isRecording && (
        <AnimatedTouchableOpacity
          className="justify-center items-center"
          style={[sendButtonstyle]}
          onPress={handleSend}
        >
          <SendSvg width={30} height={30} />
        </AnimatedTouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: colors.grey[200],
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  duration: {
    fontSize: 16,
    color: colors.primary[500],
    fontWeight: "600",
  },
  waveContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    // height: 40,
    // marginVertical: 8,
  },
  wave: {
    width: 2,
    height: 5,
    borderRadius: 2,
    marginHorizontal: 1,
  },
});
