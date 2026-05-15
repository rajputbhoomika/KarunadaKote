import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProgress } from "@/context/ProgressContext";
import { getFortById, type PhotoChallenge } from "@/constants/fortData";
import { useColors } from "@/hooks/useColors";

function ChallengeItem({ challenge }: { challenge: PhotoChallenge }) {
  const colors = useColors();
  const { completedChallenges, completeChallenge } = useProgress();
  const [loading, setLoading] = useState(false);

  const photoUri = completedChallenges[challenge.id];
  const isCompleted = !!photoUri;

  async function handleCamera() {
    setLoading(true);
    try {
      const permResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permResult.granted) {
        Alert.alert(
          "Camera Required",
          "Allow camera access to complete this photo challenge."
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets[0]) {
        await completeChallenge(challenge.id, result.assets[0].uri);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } finally {
      setLoading(false);
    }
  }

  const styles = StyleSheet.create({
    card: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: colors.card,
      borderRadius: colors.radius + 2,
      borderWidth: 1,
      borderColor: isCompleted ? colors.accent : colors.border,
      overflow: "hidden",
    },
    header: {
      padding: 16,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    iconBg: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isCompleted ? colors.accent : colors.muted,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    textArea: { flex: 1 },
    title: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 4,
    },
    desc: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 19,
    },
    photo: {
      width: "100%",
      height: 200,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      flexDirection: "row",
      gap: 10,
    },
    cameraBtn: {
      flex: 1,
      backgroundColor: isCompleted ? colors.muted : colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderWidth: isCompleted ? 1 : 0,
      borderColor: colors.border,
    },
    cameraBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: isCompleted ? colors.mutedForeground : colors.primaryForeground,
    },
    completedBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: `${colors.accent}22`,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    completedText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.accent,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBg}>
          <Feather
            name={isCompleted ? "check" : "camera"}
            size={20}
            color={isCompleted ? colors.accentForeground : colors.foreground}
          />
        </View>
        <View style={styles.textArea}>
          <Text style={styles.title}>{challenge.titleEN}</Text>
          <Text style={styles.desc}>{challenge.descriptionEN}</Text>
        </View>
      </View>

      {isCompleted && photoUri && (
        <Image source={{ uri: photoUri }} style={styles.photo} contentFit="cover" />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cameraBtn}
          onPress={handleCamera}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Feather
            name={isCompleted ? "refresh-cw" : "camera"}
            size={16}
            color={isCompleted ? colors.mutedForeground : colors.primaryForeground}
          />
          <Text style={styles.cameraBtnText}>
            {isCompleted ? "Retake Photo" : "Take Photo"}
          </Text>
        </TouchableOpacity>

        {isCompleted && (
          <View style={styles.completedBadge}>
            <Feather name="star" size={12} color={colors.accent} />
            <Text style={styles.completedText}>Done</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function ChallengesScreen() {
  const { fortId } = useLocalSearchParams<{ fortId: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const fort = getFortById(fortId);
  const { completedChallenges } = useProgress();

  if (!fort) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Fort not found</Text>
      </View>
    );
  }

  const completed = fort.challenges.filter(
    (c) => !!completedChallenges[c.id]
  ).length;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 12),
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 4,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      flex: 1,
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    headerSub: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    sectionLabel: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.accent,
      letterSpacing: 2,
      textTransform: "uppercase",
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    listBottom: {
      height: insets.bottom + (Platform.OS === "web" ? 34 : 20),
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={18} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Photo Challenges</Text>
        </View>
        <Text style={styles.headerSub}>
          {fort.name} — {completed}/{fort.challenges.length} completed
        </Text>
      </View>

      <FlatList
        data={fort.challenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChallengeItem challenge={item} />}
        ListHeaderComponent={
          <Text style={styles.sectionLabel}>
            {fort.challenges.length} Challenges
          </Text>
        }
        ListFooterComponent={<View style={styles.listBottom} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
