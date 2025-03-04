import { StyleSheet } from "react-native";
import {
  Audio,
  AVPlaybackStatus,
  InterruptionModeAndroid,
  InterruptionModeIOS,
} from "expo-av";
import { useCallback, useEffect, useState } from "react";
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
import { useToast } from "@/core/hooks/use-toast";
import { DELIVERY_STATUSES } from "@/api/chats/types";

interface AudioPlayerProps {
  audioUrl: string;
  isSender: boolean;
  messageId: string;
  deliveryStatus: DELIVERY_STATUSES;
}

export const AudioPlayer = ({
  audioUrl,
  isSender,
  messageId,
  deliveryStatus,
}: AudioPlayerProps) => {
  const { showToast } = useToast();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    currentPlayingId,
    setCurrentPlayingId,
    stopCurrentPlaying,
    registerPlayer,
  } = useAudioPlayer();

  const progressWidth = useSharedValue(0);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  // Handle global playback coordination
  useEffect(() => {
    if (currentPlayingId && currentPlayingId !== messageId && isPlaying) {
      sound
        ?.pauseAsync()
        .then(() => {
          setIsPlaying(false);
        })
        .catch((error) =>
          console.error("Error pausing current player:", error)
        );
    }
  }, [currentPlayingId, messageId, isPlaying, sound]);

  // Update sound status callback
  const updateSoundStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);

      setPosition(status.positionMillis / 1000);
      const progress = status.durationMillis
        ? (status.positionMillis / status.durationMillis) * 100
        : 0;
      progressWidth.value = withTiming(progress, { duration: 100 });

      if (
        status.didJustFinish ||
        status.positionMillis >= status.durationMillis! - 100
      ) {
        setIsPlaying(false);
        setCurrentPlayingId(null);
        setPosition(0);
        progressWidth.value = withTiming(0, { duration: 200 });

        // Reset the sound position but doesn't use await here
        if (sound) {
          sound.stopAsync().catch((err) => {
            console.error("Position reset error:", err);
          });
        }
      }
    }
  };

  const loadSound = useCallback(async () => {
    if (isLoaded || isLoading) return;

    setIsLoading(true);
    setLoadError(false);

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      const soundObject = new Audio.Sound();
      soundObject.setOnPlaybackStatusUpdate(updateSoundStatus);

      await soundObject.loadAsync(
        { uri: audioUrl },
        {
          shouldPlay: false,
          progressUpdateIntervalMillis: 100,
          volume: 1.0,
          androidImplementation: "MediaPlayer",
        }
      );

      await soundObject.setVolumeAsync(1.0);

      const status = await soundObject.getStatusAsync();
      if (!status.isLoaded) {
        throw new Error("Audio failed to load");
      }

      setSound(soundObject);
      setIsLoaded(true);
      setDuration(status.durationMillis! / 1000);

      // register with context
      registerPlayer(messageId, soundObject);

      return soundObject;
    } catch (error) {
      console.error("Error loading audio:", error);
      showToast({
        type: "error",
        text1: "Error",
        text2: "An error occurred when trying to load the audio",
      });
      setLoadError(true);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [
    audioUrl,
    messageId,
    isLoaded,
    isLoading,
    registerPlayer,
    updateSoundStatus,
  ]);

  const togglePlayback = async () => {
    // if there's an error, retry loading
    if (loadError) {
      setLoadError(false);
      await loadSound();
      return;
    }

    // if not loaded, load and play
    if (!isLoaded) {
      try {
        const newSound = await loadSound();
        if (!newSound) return;

        if (currentPlayingId && currentPlayingId !== messageId) {
          await stopCurrentPlaying();
        }

        // play the newly loaded sound
        setIsPlaying(true);
        setCurrentPlayingId(messageId);
        await newSound.playAsync();
      } catch (error) {
        showToast({
          type: "error",
          text1: "Error",
          text2: "Error loading sound",
        });
        setLoadError(true);
      }
      return;
    }

    // Already loaded - toggle play/pause
    if (!sound) {
      setIsLoaded(false);
      return;
    }

    try {
      const status = await sound.getStatusAsync();

      if (!status.isLoaded) {
        setIsLoaded(false);
        setSound(null);
        return;
      }

      if (status.isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        if (currentPlayingId && currentPlayingId !== messageId) {
          await stopCurrentPlaying();
        }

        if (
          status.positionMillis > 0 &&
          status.positionMillis >= status.durationMillis! - 100
        ) {
          setPosition(0);
          progressWidth.value = withTiming(0, { duration: 100 });
          await sound.stopAsync();
        }

        setIsPlaying(true);
        setCurrentPlayingId(messageId);
        await sound.playAsync();
      }
    } catch (error) {
      setIsLoaded(false);
      setSound(null);
      setLoadError(true);
    }
  };

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
        text: colors.black,
        progress: colors.primary[400],
        progressTrack: `rgba(0, 0, 0, 0.1)`,
        icon: isDark ? colors.white : colors.black,
      };
    }
  };

  const uiColors = getColors();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
        <FontAwesome
          name={isLoading ? "circle-o-notch" : isPlaying ? "pause" : "play"}
          size={20}
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
            {isLoaded ? formatDuration(duration) : "--:--"}
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
