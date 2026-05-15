import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface ProgressBarProps {
  percentage: number;
  visited: number;
  total: number;
  compact?: boolean;
}

export function ProgressBar({
  percentage,
  visited,
  total,
  compact = false,
}: ProgressBarProps) {
  const colors = useColors();

  const styles = StyleSheet.create({
    container: {
      gap: compact ? 4 : 6,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    label: {
      fontSize: compact ? 11 : 12,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    pct: {
      fontSize: compact ? 11 : 13,
      fontFamily: "Inter_700Bold",
      color: colors.accent,
    },
    track: {
      height: compact ? 4 : 6,
      backgroundColor: colors.border,
      borderRadius: 3,
      overflow: "hidden",
    },
    fill: {
      height: "100%",
      backgroundColor: colors.accent,
      borderRadius: 3,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>
          {visited}/{total} landmarks explored
        </Text>
        <Text style={styles.pct}>{percentage}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}
