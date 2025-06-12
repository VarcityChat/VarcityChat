import { useEffect, useState, useRef } from "react";
import { Text, View, TouchableOpacity } from "@/ui";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolate,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/ui";
import { useColorScheme } from "nativewind";
import { StyleSheet } from "react-native";
import { formatDuration } from "@/core/utils";
import SendSvg from "@/ui/icons/chat/send-svg";
import { useToast } from "@/core/hooks/use-toast";

const VOICE_RECORDER_HEIGHT = 45;

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
  const { showToast } = useToast();
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const recording = useRef<Audio.Recording | null>(null);
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
      height: withTiming(containerHeight.value, {
        duration: 50,
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

  // Pause/resume recording
  const togglePause = async () => {
    if (!recording.current) return;
    try {
      if (isPaused) {
        // Resume recording
        await recording.current.startAsync();
        timerRef.current = setInterval(() => {
          setDuration((prev) => prev + 1);
          audioLevels.value = Math.random();
        }, 1000) as unknown as NodeJS.Timeout;
      } else {
        // Pause recording
        await recording.current.pauseAsync();
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

  // Check and request permissions
  const checkPermissions = async () => {
    try {
      const permissionResponse = await Audio.requestPermissionsAsync();
      if (permissionResponse.granted) {
        setPermissionGranted(true);
        return true;
      } else {
        showToast({
          type: "error",
          text1: "Permission Denied",
          text2:
            "Open the settings app to grant recording permissions to VarcityChat",
        });
        return false;
      }
    } catch (error) {
      console.error("Error checking permissions:", error);
      return false;
    }
  };

  // Start recording function
  const startRecording = async () => {
    try {
      // Check permissions first
      const hasPermission = await checkPermissions();
      if (!hasPermission) {
        resetRecorder();
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        staysActiveInBackground: false,
        playThroughEarpieceAndroid: false,
      });
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setDuration(0);
      setIsPaused(false);
      setIsRecording(true);
      containerHeight.value = VOICE_RECORDER_HEIGHT;
      waveOpacity.value = withTiming(1, { duration: 300 });
      recording.current = newRecording;

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
        // Simulate audio levels - in a real app you would use actual audio levels
        audioLevels.value = Math.random();
      }, 1000) as unknown as NodeJS.Timeout;
    } catch (error) {
      console.log("Failed to start recording:", error);
    }
  };

  // Stop recording and get the file
  const stopRecording = async () => {
    if (!recording.current) return;
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      await recording.current.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.current.getURI();
      waveOpacity.value = withTiming(0, { duration: 300 });
      recording.current = null;
      setIsRecording(false);

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

  const handleCancel = async () => {
    resetRecorder();
    onCancel?.();
  };

  // Reset the recorder state
  const resetRecorder = async () => {
    try {
      if (recording.current) {
        await recording.current.stopAndUnloadAsync();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      recording.current = null;
      setAudioUri(null);
      setIsRecording(false);
      setIsPaused(false);
      setDuration(0);
      containerHeight.value = 0;
      audioLevels.value = 0;
      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: false,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {}
  };

  const handleSend = async () => {
    const uri = await stopRecording();
    if (uri) {
      onSend(uri);
      resetRecorder();
    }
  };

  useEffect(() => {
    startRecording();
    return () => {
      resetRecorder();
    };
  }, []);

  return (
    <Animated.View
      className="w-full flex-row items-center py-2 px-4 bg-white dark:bg-black"
      style={{ height: VOICE_RECORDER_HEIGHT }}
    >
      {isRecording && (
        <TouchableOpacity
          className="w-7 h-7 flex flex-row items-center justify-center rounded-full mr-6"
          onPress={handleCancel}
        >
          <Ionicons name="close" size={18} color={isDark ? "white" : "black"} />
        </TouchableOpacity>
      )}

      {(isRecording || audioUri) && (
        <>
          <View className="flex-row flex-1 items-center">
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
  wave: {
    width: 2,
    height: 5,
    borderRadius: 2,
    marginHorizontal: 1,
  },
});
