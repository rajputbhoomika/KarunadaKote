import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProgressBar } from "@/components/ProgressBar";
import { useProgress } from "@/context/ProgressContext";
import { getFortById, type Landmark } from "@/constants/fortData";
import { useColors } from "@/hooks/useColors";

function LandmarkRow({ landmark }: { landmark: Landmark }) {
  const colors = useColors();
  const { visitedLandmarks } = useProgress();
  const visited = visitedLandmarks.has(landmark.id);

  const styles = StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    iconBg: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: visited ? `${colors.accent}22` : colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    textArea: { flex: 1 },
    name: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    subtitle: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: visited ? `${colors.accent}22` : colors.muted,
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    badgeText: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: visited ? colors.accent : colors.mutedForeground,
    },
    navBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/landmark/${landmark.fortId}/${landmark.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.iconBg}>
        <Feather
          name={visited ? "check-circle" : "map-pin"}
          size={18}
          color={visited ? colors.accent : colors.mutedForeground}
        />
      </View>
      <View style={styles.textArea}>
        <Text style={styles.name}>{landmark.name}</Text>
        <Text style={styles.subtitle}>{landmark.subtitle}</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{visited ? "Visited" : "Pending"}</Text>
      </View>
      <View style={styles.navBtn}>
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      </View>
    </TouchableOpacity>
  );
}

export default function ProgressScreen() {
  const { fortId } = useLocalSearchParams<{ fortId: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getFortProgress, completedChallenges } = useProgress();

  const fort = getFortById(fortId);
  const progress = fort ? getFortProgress(fortId) : null;

  if (!fort || !progress) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Fort not found</Text>
      </View>
    );
  }

  const challengesCompleted = fort.challenges.filter(
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
      marginBottom: 12,
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
    statsRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      padding: 14,
      alignItems: "center",
      gap: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statNum: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: colors.accent,
    },
    statLabel: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      textAlign: "center",
    },
    sectionLabel: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.accent,
      letterSpacing: 2,
      textTransform: "uppercase",
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.background,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 16,
    },
    completionBanner: {
      margin: 16,
      backgroundColor: `${colors.accent}22`,
      borderRadius: colors.radius + 2,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderWidth: 1,
      borderColor: colors.accent,
    },
    completionText: {
      flex: 1,
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.accent,
      lineHeight: 20,
    },
    listBottom: {
      height: insets.bottom + (Platform.OS === "web" ? 34 : 20),
    },
  });

  const isComplete = progress.percentage === 100;

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
          <Text style={styles.headerTitle}>Tour Progress</Text>
        </View>

        <ProgressBar
          percentage={progress.percentage}
          visited={progress.visited}
          total={progress.total}
        />

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{progress.visited}</Text>
            <Text style={styles.statLabel}>Landmarks{"\n"}Explored</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{progress.total - progress.visited}</Text>
            <Text style={styles.statLabel}>Landmarks{"\n"}Remaining</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{challengesCompleted}</Text>
            <Text style={styles.statLabel}>Photo{"\n"}Challenges</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={fort.landmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LandmarkRow landmark={item} />}
        ListHeaderComponent={
          <>
            {isComplete && (
              <View style={styles.completionBanner}>
                <Feather name="award" size={28} color={colors.accent} />
                <Text style={styles.completionText}>
                  Congratulations! You have fully explored {fort.name}. A true
                  Karunada Kote explorer!
                </Text>
              </View>
            )}
            <Text style={styles.sectionLabel}>All Landmarks</Text>
          </>
        }
        ListFooterComponent={<View style={styles.listBottom} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
