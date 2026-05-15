import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AudioPlayer } from "@/components/AudioPlayer";
import { useProgress } from "@/context/ProgressContext";
import { getLandmarkById } from "@/constants/fortData";
import { useColors } from "@/hooks/useColors";
import { type LanguageCode, getLanguageByCode, getSpeechLanguage, getLanguageDisplayName } from "@/constants/languages";

type Language = "EN" | "KN";

export default function LandmarkScreen() {
  const { fortId, landmarkId } = useLocalSearchParams<{
    fortId: string;
    landmarkId: string;
  }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { visitedLandmarks, markLandmarkVisited } = useProgress();

  const landmark = getLandmarkById(fortId, landmarkId);
  const [language, setLanguage] = useState<Language>("EN");
  const isVisited = visitedLandmarks.has(landmarkId);

  // Load saved language preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("@karunada_kote:selected_language");
      if (saved === "KN" || saved === "EN") {
        setLanguage(saved as Language);
      }
    }
  }, []);

  if (!landmark) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Landmark not found</Text>
      </View>
    );
  }

  const story = language === "EN" ? landmark.storyEN : landmark.storyKN;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    imageContainer: {
      height: 260,
      position: "relative",
    },
    image: { width: "100%", height: "100%" },
    imagePlaceholder: {
      width: "100%",
      height: "100%",
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    placeholderText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    imageGradient: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 100,
    },
    backBtn: {
      position: "absolute",
      top: insets.top + (Platform.OS === "web" ? 67 : 12),
      left: 16,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(44,26,14,0.6)",
      alignItems: "center",
      justifyContent: "center",
    },
    imageHeading: {
      position: "absolute",
      bottom: 16,
      left: 16,
      right: 16,
    },
    landmarkName: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: "#FAF0DC",
    },
    landmarkSubtitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: "#E8D5B0",
      marginTop: 2,
    },
    content: {
      padding: 20,
      gap: 20,
    },
    visitedBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    visitedText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.accent,
    },
    langToggle: {
      flexDirection: "row",
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      padding: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    langBtn: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: colors.radius - 2,
      alignItems: "center",
    },
    langBtnActive: {
      backgroundColor: colors.primary,
    },
    langBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
    },
    langBtnTextActive: {
      color: colors.primaryForeground,
    },
    storyCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius + 2,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
    },
    storyLabel: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.accent,
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 12,
    },
    storyText: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      lineHeight: 26,
    },
    markBtn: {
      backgroundColor: isVisited ? colors.muted : colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      borderWidth: isVisited ? 1 : 0,
      borderColor: colors.border,
    },
    markBtnText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: isVisited ? colors.mutedForeground : colors.primaryForeground,
    },
    bottomPad: {
      height: insets.bottom + (Platform.OS === "web" ? 34 : 16),
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {landmark.image ? (
            <Image
              source={landmark.image}
              style={styles.image}
              contentFit="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={40} color={colors.mutedForeground} />
              <Text style={styles.placeholderText}>{landmark.name}</Text>
            </View>
          )}
          <LinearGradient
            colors={["transparent", "rgba(44,26,14,0.85)"]}
            style={styles.imageGradient}
          />
          <View style={styles.imageHeading}>
            <Text style={styles.landmarkName}>{landmark.name}</Text>
            <Text style={styles.landmarkSubtitle}>{landmark.subtitle}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={18} color="#FAF0DC" />
        </TouchableOpacity>

        <View style={styles.content}>
          {isVisited && (
            <View style={styles.visitedBanner}>
              <Feather name="check-circle" size={18} color={colors.accent} />
              <Text style={styles.visitedText}>You have visited this landmark</Text>
            </View>
          )}

          <View style={styles.langToggle}>
            {(["EN", "KN"] as Language[]).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.langBtn, language === lang && styles.langBtnActive]}
                onPress={() => setLanguage(lang)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.langBtnText,
                    language === lang && styles.langBtnTextActive,
                  ]}
                >
                  {lang === "EN" ? "English" : "ಕನ್ನಡ"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <AudioPlayer
            durationSeconds={landmark.audioDurationSeconds}
            language={language}
            storyText={story}
            title={landmark.name}
          />

          <View style={styles.storyCard}>
            <Text style={styles.storyLabel}>Historical Account</Text>
            <Text style={styles.storyText}>{story}</Text>
          </View>

          <TouchableOpacity
            style={styles.markBtn}
            onPress={async () => {
              if (!isVisited) {
                await Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
                markLandmarkVisited(landmark.id);
              }
            }}
            activeOpacity={0.85}
          >
            <Feather
              name={isVisited ? "check-circle" : "map-pin"}
              size={20}
              color={isVisited ? colors.mutedForeground : colors.primaryForeground}
            />
            <Text style={styles.markBtnText}>
              {isVisited ? "Landmark Explored" : "Mark as Visited"}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomPad} />
        </View>
      </ScrollView>
    </View>
  );
}
