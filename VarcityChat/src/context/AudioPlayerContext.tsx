import {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import { Audio } from "expo-av";

interface AudioContextType {
  currentPlayingId: string | null;
  setCurrentPlayingId: (id: string | null) => void;
  stopCurrentPlaying: () => void;
  stopAllPlayers: () => void;
  registerPlayer: (id: string, sound: Audio.Sound) => void;
  unregisterPlayer: (id: string) => void;
  releaseUnusedPlayers: () => void;
}

const AudioPlayerContext = createContext<AudioContextType | undefined>(
  undefined
);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const soundsRef = useRef<Map<string, Audio.Sound>>(new Map());
  const lastPlayedTimestamps = useRef<Map<string, number>>(new Map());

  const registerPlayer = (id: string, sound: Audio.Sound) => {
    if (soundsRef.current.has(id)) {
      const existingSound = soundsRef.current.get(id);
      existingSound
        ?.unloadAsync()
        .catch((err) => console.error("Error unloading existing sound:", err));
    }
    soundsRef.current.set(id, sound);
  };

  const unregisterPlayer = (id: string) => {
    soundsRef.current.delete(id);
    lastPlayedTimestamps.current.delete(id);
    if (currentPlayingId === id) {
      setCurrentPlayingId(null);
    }
  };

  const stopCurrentPlaying = async () => {
    if (currentPlayingId && soundsRef.current.has(currentPlayingId)) {
      try {
        const sound = soundsRef.current.get(currentPlayingId);
        if (sound) {
          const status = await sound.getStatusAsync();
          if (status.isLoaded && status.isPlaying) {
            await sound.pauseAsync();
          }
        }
      } catch (err) {
        console.error("Error stopping sound:", err);
        soundsRef.current.delete(currentPlayingId);
      }
    }
    setCurrentPlayingId(null);
  };

  const stopAllPlayers = useCallback(async () => {
    // First, stop the current playing audio
    if (currentPlayingId) {
      await stopCurrentPlaying();
    }

    const stopPromises: Promise<void>[] = [];
    soundsRef.current.forEach((sound, id) => {
      stopPromises.push(
        sound
          .getStatusAsync()
          .then((status) => {
            if (status.isLoaded) {
              if (status.isPlaying) {
                sound.pauseAsync();
              }
              sound.unloadAsync();
            }
            return Promise.resolve();
          })
          .catch((err) => {
            console.error(`Error stopping sound ${id}`, err);
            soundsRef.current.delete(id);
            return Promise.resolve();
          })
      );
    });

    // Wait for all pause operations to complete
    await Promise.all(stopPromises);
    setCurrentPlayingId(null);
  }, [currentPlayingId, stopCurrentPlaying]);

  // release unused players to save memory
  const releaseUnusedPlayers = useCallback(() => {
    const now = Date.now();
    const THRESHOLD_MS = 5 * 60 * 1000; // 3 minutes

    for (const [id, timestamp] of lastPlayedTimestamps.current.entries()) {
      if (now - timestamp > THRESHOLD_MS && id !== currentPlayingId) {
        const sound = soundsRef.current.get(id);
        if (sound) {
          sound
            .unloadAsync()
            .catch((e) => console.error("Error unloading sound", e));
          soundsRef.current.delete(id);
          lastPlayedTimestamps.current.delete(id);
        }
      }
    }
  }, [currentPlayingId]);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentPlayingId,
        setCurrentPlayingId,
        stopCurrentPlaying,
        stopAllPlayers,
        registerPlayer,
        unregisterPlayer,
        releaseUnusedPlayers,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined)
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider"
    );
  return context;
}
