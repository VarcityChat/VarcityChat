import { createContext, useContext, useState, useRef, ReactNode } from "react";
import { Audio } from "expo-av";

interface AudioContextType {
  currentPlayingId: string | null;
  setCurrentPlayingId: (id: string | null) => void;
  stopCurrentPlaying: () => void;
  registerPlayer: (id: string, sound: Audio.Sound) => void;
  unregisterPlayer: (id: string) => void;
}

const AudioPlayerContext = createContext<AudioContextType | undefined>(
  undefined
);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const soundsRef = useRef<Map<string, Audio.Sound>>(new Map());

  const registerPlayer = (id: string, sound: Audio.Sound) => {
    soundsRef.current.set(id, sound);
  };

  const unregisterPlayer = (id: string) => {
    soundsRef.current.delete(id);
  };

  const stopCurrentPlaying = async () => {
    if (currentPlayingId && soundsRef.current.has(currentPlayingId)) {
      const sound = soundsRef.current.get(currentPlayingId);
      if (sound) {
        try {
          await sound.pauseAsync();
        } catch (error) {
          console.log("Error pausing sound", error);
        }
      }
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentPlayingId,
        setCurrentPlayingId,
        stopCurrentPlaying,
        registerPlayer,
        unregisterPlayer,
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
