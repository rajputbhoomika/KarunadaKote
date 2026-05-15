import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

interface AudioPlayerProps {
  durationSeconds: number;
  language: "EN" | "KN";
  storyText: string;
  title?: string;
}

type PlayState = "idle" | "loading" | "playing" | "paused" | "finished";

export function AudioPlayer({ durationSeconds, language, storyText, title }: AudioPlayerProps) {
  const colors = useColors();
  const [state, setState] = useState<PlayState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      Speech.stop();
    };
  }, [clearTimer]);

  // Reset when language changes
  useEffect(() => {
    setState("idle");
    setElapsed(0);
    clearTimer();
    Speech.stop();
  }, [language, clearTimer]);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsedSecs = (Date.now() - startTimeRef.current) / 1000;
      setElapsed(elapsedSecs);
      if (elapsedSecs >= durationSeconds) {
        clearTimer();
        setState("finished");
      }
    }, 100);
  }, [durationSeconds, clearTimer]);

  const handlePlay = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (state === "idle" || state === "finished") {
      setState("loading");
      setElapsed(0);
      
      const voiceLang = language === "KN" ? "kn-IN" : "en-IN";
      
      try {
        await Speech.speak(storyText, {
          language: voiceLang,
          rate: 0.9,
          pitch: 1.0,
          onStart: () => {
            setState("playing");
            startTimer();
          },
          onDone: () => {
            setState("finished");
            clearTimer();
            setElapsed(durationSeconds);
          },
          onStopped: () => {
            setState("paused");
            clearTimer();
          },
          onError: (error: any) => {
            console.error("Speech error:", error);
            setState("idle");
            clearTimer();
          },
        });
      } catch (error) {
        console.error("Failed to start speech:", error);
        setState("idle");
      }
    } else if (state === "paused") {
      // Resume speech
      await Speech.resume();
      setState("playing");
      startTimer();
    }
  }, [state, language, storyText, durationSeconds, startTimer, clearTimer]);

  const handlePause = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Speech.pause();
    clearTimer();
    setState("paused");
  }, [clearTimer]);

  const handleReplay = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await Speech.stop();
    clearTimer();
    setElapsed(0);
    
    const voiceLang = language === "KN" ? "kn-IN" : "en-IN";
    
    try {
      await Speech.speak(storyText, {
        language: voiceLang,
        rate: 0.9,
        pitch: 1.0,
        onStart: () => {
          setState("playing");
          startTimer();
        },
        onDone: () => {
          setState("finished");
          clearTimer();
          setElapsed(durationSeconds);
        },
        onStopped: () => {
          setState("paused");
          clearTimer();
        },
        onError: (error: any) => {
          console.error("Speech error:", error);
          setState("idle");
          clearTimer();
        },
      });
    } catch (error) {
      console.error("Failed to replay speech:", error);
      setState("idle");
    }
  }, [language, storyText, durationSeconds, startTimer, clearTimer]);

  const progress = durationSeconds > 0 ? Math.min(elapsed / durationSeconds, 1) : 0;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      gap: 8,
    },
    headerText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.accent,
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    langBadge: {
      backgroundColor: colors.accent,
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    langBadgeKN: {
      backgroundColor: "#B91C1C", // Deep red for Karnataka
    },
    langBadgeText: {
      color: colors.accentForeground,
      fontSize: 11,
      fontFamily: "Inter_700Bold",
    },
    titleText: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      marginTop: 2,
      flex: 1,
    },
    controls: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    playBtn: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    replayBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    progressContainer: {
      flex: 1,
    },
    progressTrack: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      overflow: "hidden",
      marginBottom: 4,
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.accent,
      borderRadius: 2,
    },
    times: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    timeText: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    statusText: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      marginTop: 8,
      textAlign: "center",
    },
  });

  const isPlaying = state === "playing";
  const showReplay = state === "finished" || state === "paused" || state === "playing";

  const isKannada = language === "KN";
  const langName = isKannada ? "ಕನ್ನಡ" : "EN";
  const voiceIndicator = isKannada ? "🎙️ kn-IN" : "🎙️ en-IN";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="volume-2" size={16} color={colors.accent} />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerText}>Audio Narration</Text>
          {title && (
            <Text style={styles.titleText} numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>
        <View style={[styles.langBadge, isKannada && styles.langBadgeKN]}>
          <Text style={styles.langBadgeText}>{langName}</Text>
        </View>
      </View>
      
      {/* Voice Language Indicator */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 6 }}>
        <Text style={{ fontSize: 12 }}>{isKannada ? "🇮🇳 🗣️" : "🇮🇳 🗣️"}</Text>
        <Text style={{ fontSize: 11, fontFamily: "Inter_500Medium", color: colors.mutedForeground }}>
          {isKannada ? "Kannada Voice (kn-IN)" : "English Voice (en-IN)"}
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.playBtn}
          onPress={isPlaying ? handlePause : handlePlay}
          activeOpacity={0.8}
        >
          {state === "loading" ? (
            <ActivityIndicator color={colors.primaryForeground} size="small" />
          ) : (
            <Feather
              name={isPlaying ? "pause" : "play"}
              size={22}
              color={colors.primaryForeground}
            />
          )}
        </TouchableOpacity>

        {showReplay && (
          <TouchableOpacity
            style={styles.replayBtn}
            onPress={handleReplay}
            activeOpacity={0.8}
          >
            <Feather name="rotate-ccw" size={16} color={colors.foreground} />
          </TouchableOpacity>
        )}

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <View style={styles.times}>
            <Text style={styles.timeText}>{formatTime(elapsed)}</Text>
            <Text style={styles.timeText}>{formatTime(durationSeconds)}</Text>
          </View>
        </View>
      </View>

      {state === "finished" && (
        <Text style={styles.statusText}>Narration complete — tap replay to listen again</Text>
      )}
      {state === "idle" && (
        <Text style={styles.statusText}>Tap play to hear the story of this landmark</Text>
      )}
    </View>
  );
}
