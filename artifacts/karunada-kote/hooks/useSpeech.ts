import * as Speech from "expo-speech";
import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechOptions {
  language?: "EN" | "KN";
  rate?: number;
  pitch?: number;
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      Speech.stop();
    };
  }, [clearTimer]);

  const speak = useCallback(
    async (text: string, options?: SpeechOptions) => {
      const language = options?.language ?? "EN";
      
      // Stop any ongoing speech
      await Speech.stop();
      clearTimer();
      
      // Reset state
      setIsPaused(false);
      setElapsedTime(0);
      pausedTimeRef.current = 0;
      startTimeRef.current = Date.now();
      setIsSpeaking(true);

      // Start progress timer
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - startTimeRef.current - pausedTimeRef.current) / 1000;
        setElapsedTime(elapsed);
      }, 100);

      // Configure speech options
      const voiceLang = language === "KN" ? "kn-IN" : "en-IN";
      
      try {
        await Speech.speak(text, {
          language: voiceLang,
          rate: options?.rate ?? 0.9,
          pitch: options?.pitch ?? 1.0,
          onDone: () => {
            setIsSpeaking(false);
            setIsPaused(false);
            clearTimer();
          },
          onError: (error) => {
            console.error("Speech error:", error);
            setIsSpeaking(false);
            setIsPaused(false);
            clearTimer();
          },
        });
      } catch (error) {
        console.error("Failed to speak:", error);
        setIsSpeaking(false);
        clearTimer();
      }
    },
    [clearTimer]
  );

  const stop = useCallback(async () => {
    await Speech.stop();
    setIsSpeaking(false);
    setIsPaused(false);
    setElapsedTime(0);
    clearTimer();
  }, [clearTimer]);

  const pause = useCallback(async () => {
    await Speech.pause();
    setIsPaused(true);
    pausedTimeRef.current = Date.now() - startTimeRef.current - elapsedTime * 1000;
  }, [elapsedTime]);

  const resume = useCallback(async () => {
    await Speech.resume();
    setIsPaused(false);
    // Adjust start time to account for pause duration
    const pauseDuration = Date.now() - startTimeRef.current - elapsedTime * 1000 - pausedTimeRef.current;
    startTimeRef.current += pauseDuration;
  }, [elapsedTime]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    elapsedTime,
  };
}

// Get available voices (useful for debugging)
export async function getAvailableVoices(): Promise<Speech.Voice[]> {
  const voices = await Speech.getAvailableVoicesAsync();
  return voices;
}
