import { StyleSheet } from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useColorScheme } from "nativewind";
import { colors } from "@/ui";
import { View, Text, TouchableOpacity } from "@/ui";
import { FontAwesome } from "@expo/vector-icons";
import { formatDuration } from "@/core/utils";
import { useAudioPlayer } from "@/context/AudioPlayerContext";

interface AudioPlayerProps {
  audioUrl: string;
  isSender: boolean;
  messageId: string;
}

export const AudioPlayer = ({
  audioUrl,
  isSender,
  messageId,
}: AudioPlayerProps) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Get audio context
  const {
    currentPlayingId,
    setCurrentPlayingId,
    stopCurrentPlaying,
    registerPlayer,
    unregisterPlayer,
  } = useAudioPlayer();

  const progressWidth = useSharedValue(0);

  // Progress animation
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  // Load the sound
  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        unregisterPlayer(messageId);
        sound.unloadAsync();
      }
    };
  }, [audioUrl]);

  // Handle global playback coordination
  useEffect(() => {
    if (currentPlayingId && currentPlayingId !== messageId && isPlaying) {
      sound?.pauseAsync().then(() => {
        setIsPlaying(false);
      });
    }
  }, [currentPlayingId, messageId, isPlaying]);

  // Update progress during playback
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(async () => {
        if (sound) {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            setPosition(status.positionMillis / 1000);
            const progress =
              (status.positionMillis / status.durationMillis!) * 100;
            progressWidth.value = withTiming(progress, { duration: 100 });

            if (status.didJustFinish) {
              setIsPlaying(false);
              setCurrentPlayingId(null);
              setPosition(0);
              progressWidth.value = withTiming(0, { duration: 300 });
              await sound.setPositionAsync(0);
            }
          }
        }
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, sound]);

  // Load the audio file
  const loadSound = async () => {
    setIsLoading(true);
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        updateSoundStatus
      );
      setSound(newSound);

      // Register this player
      registerPlayer(messageId, newSound);

      // Get and set initial duration
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis! / 1000);
      }
    } catch (error) {
      console.error("Error loading audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update sound status callback
  const updateSoundStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setCurrentPlayingId(null);
        setPosition(0);
        progressWidth.value = withTiming(0, { duration: 300 });
      }
    }
  };

  // Play/pause toggle
  const togglePlayback = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
      setCurrentPlayingId(null);
      // setIsPlaying(false);
    } else {
      if (currentPlayingId !== messageId) {
        await stopCurrentPlaying();
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      await sound.playAsync();
      setCurrentPlayingId(messageId);
      // setIsPlaying(true);
    }
  };

  // Ui colors based on sender/receiver
  const getColors = () => {
    if (isSender) {
      return {
        text: colors.black,
        progress: colors.primary[400],
        progressTrack: `rgba(0, 0, 0, 0.1)`,
        icon: colors.white,
      };
    } else {
      return {
        text: isDark ? colors.white : colors.black,
        progress: colors.primary[400],
        progressTrack: isDark
          ? `rgba(255, 255, 255, 0.15)`
          : "rgba(0, 0, 0, 0.1)",
        icon: isDark ? colors.white : colors.black,
      };
    }
  };

  const uiColors = getColors();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => {
          if (isLoading) return;

          // Reload the audio if it has not loaded yet
          if (!sound) {
            loadSound();
            console.log("RELOADING THE SOUND:");
            return;
          }

          togglePlayback();
        }}
        // disabled={isLoading}
      >
        <FontAwesome
          name={isLoading ? "circle-o-notch" : isPlaying ? "pause" : "play"}
          size={24}
          color={uiColors.icon}
        />
      </TouchableOpacity>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: uiColors.progressTrack },
          ]}
        >
          <Animated.View
            style={[
              styles.progressBar,
              progressStyle,
              { backgroundColor: uiColors.progress },
            ]}
          />
        </View>

        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, { color: uiColors.text }]}>
            {formatDuration(position)}
          </Text>
          <Text style={[styles.timeText, { color: uiColors.text }]}>
            {formatDuration(duration)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 10,
    minWidth: 200,
    maxWidth: 280,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  progressContainer: {
    flex: 1,
    justifyContent: "center",
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    width: "100%",
    marginBottom: 5,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 12,
  },
});
