import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FortMapView from "@/components/FortMapView";
import { useProgress } from "@/context/ProgressContext";
import { getFortById } from "@/constants/fortData";
import { useColors } from "@/hooks/useColors";

export default function FortScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getFortProgress } = useProgress();

  const fort = getFortById(id);
  const progress = fort ? getFortProgress(fort.id) : null;

  if (!fort) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Fort not found</Text>
      </View>
    );
  }

  const headerHeight =
    insets.top + (Platform.OS === "web" ? 67 : 8) + 12 + 36 + 12;
  const bottomOffset = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 8),
      paddingHorizontal: 16,
      paddingBottom: 12,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
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
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    progressChip: {
      backgroundColor: colors.accent,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    progressChipText: {
      color: colors.accentForeground,
      fontSize: 12,
      fontFamily: "Inter_700Bold",
    },
    photosBtn: {
      marginTop: 10,
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      paddingVertical: 10,
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    photosBtnText: {
      color: colors.foreground,
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
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
          <Text style={styles.headerTitle} numberOfLines={1}>
            {fort.name}
          </Text>
          {progress && (
            <View style={styles.progressChip}>
              <Text style={styles.progressChipText}>{progress.percentage}%</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.photosBtn}
          onPress={() => router.push(`/fort/${fort.id}/photos`)}
          activeOpacity={0.85}
        >
          <Feather name="image" size={16} color={colors.foreground} />
          <Text style={styles.photosBtnText}>Community Photos</Text>
        </TouchableOpacity>
      </View>

      <FortMapView
        fort={fort}
        headerHeight={headerHeight}
        bottomOffset={bottomOffset}
      />
    </View>
  );
}
