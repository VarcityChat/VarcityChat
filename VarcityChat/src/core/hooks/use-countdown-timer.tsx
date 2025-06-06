import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { differenceInSeconds } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TIMER_OFFSET = "TIMER_OFFSET";

export const useCountDownTimer = (
  autoRun: boolean = true,
  totalSeconds: number,
  onComplete?: () => void,
  duration?: number
) => {
  const [initialDuration] = useState(totalSeconds || 0);
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds || 0);
  const [isRunning, setIsRunning] = useState(autoRun);

  const handleAppStateChange = async (appState: AppStateStatus) => {
    if (appState === "active") {
      const backgroundTime = await AsyncStorage.getItem(TIMER_OFFSET);
      if (backgroundTime !== null) {
        const offset = differenceInSeconds(
          Date.now(),
          new Date(parseInt(backgroundTime, 10))
        );
        setSecondsLeft((secondsLeftValue) => {
          const seconds = secondsLeftValue - offset;
          if (seconds < 0) {
            onComplete && onComplete();
            return 0;
          }
          return seconds;
        });
      }
    } else if (appState === "background" || appState === "inactive") {
      await AsyncStorage.setItem(TIMER_OFFSET, Date.now().toString());
    }
  };

  useEffect(() => {
    const listener = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      listener.remove();
    };
  }, []);

  const resetTimer = () => {
    setSecondsLeft(initialDuration);
  };

  const startTImer = () => {
    resetTimer();
    setIsRunning(true);
  };

  useEffect(() => {
    let intervalId: any;
    if (isRunning && secondsLeft > 0) {
      intervalId = setInterval(() => {
        setSecondsLeft((secondsLeftValue) => {
          if (secondsLeftValue === 0) {
            clearInterval(intervalId);
            onComplete && onComplete();
            return secondsLeft;
          }
          return secondsLeft - 1;
        });
      }, duration || 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [duration, isRunning, onComplete, secondsLeft, totalSeconds]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return {
    minutes: `${minutes}`,
    seconds: `${seconds < 10 ? "0" : ""}${seconds}`,
    secondsLeft,
    startTImer,
    resetTimer,
  };
};
