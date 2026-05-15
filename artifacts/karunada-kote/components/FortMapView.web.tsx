import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { useProgress } from "@/context/ProgressContext";
import { type Fort, type Landmark } from "@/constants/fortData";
import { useColors } from "@/hooks/useColors";

interface FortMapViewProps {
  fort: Fort;
  headerHeight: number;
  bottomOffset: number;
}

// Generate OpenStreetMap static map URL
function getStaticMapUrl(
  lat: number,
  lng: number,
  zoom: number,
  width: number,
  height: number,
  markers: { lat: number; lng: number; label: string }[]
): string {
  // Use OpenStreetMap's static map service (via staticmap service)
  const markerParams = markers
    .map((m, i) => `marker=${m.lat},${m.lng},red-${i + 1}`)
    .join("&");
  
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&maptype=map&${markerParams}`;
}

// Generate Google Maps embed URL for interactive view
function getGoogleMapsEmbedUrl(lat: number, lng: number, zoom: number): string {
  return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d100000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1`;
}

export default function FortMapView({ fort, headerHeight, bottomOffset }: FortMapViewProps) {
  const colors = useColors();
  const { visitedLandmarks } = useProgress();
  const { width } = useWindowDimensions();
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [showInteractiveMap, setShowInteractiveMap] = useState(false);

  const mapHeight = 300;
  const mapWidth = Math.min(width - 40, 600);

  // Calculate center of all landmarks or use fort center
  const centerLat = fort.latitude;
  const centerLng = fort.longitude;
  const zoom = 16;

  const markers = fort.landmarks.map((l) => ({
    lat: l.latitude,
    lng: l.longitude,
    label: l.name,
  }));

  const staticMapUrl = getStaticMapUrl(centerLat, centerLng, zoom, mapWidth, mapHeight, markers);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: headerHeight,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: bottomOffset + 20,
    },
    mapCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius + 4,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 20,
    },
    mapImage: {
      width: mapWidth,
      height: mapHeight,
      backgroundColor: colors.muted,
    },
    mapOverlay: {
      position: "absolute",
      top: 12,
      left: 12,
      right: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    mapBadge: {
      backgroundColor: "rgba(44,26,14,0.85)",
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    mapBadgeText: {
      color: "#FAF0DC",
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
    },
    mapToggle: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    mapToggleText: {
      color: colors.primaryForeground,
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
    },
    mapHint: {
      padding: 12,
      backgroundColor: colors.muted,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    mapHintText: {
      flex: 1,
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    sectionLabel: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.accent,
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 12,
    },
    landmarksContainer: {
      gap: 10,
    },
    landmarkItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    landmarkItemSelected: {
      borderColor: colors.accent,
      borderWidth: 2,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    landmarkContent: {
      flex: 1,
    },
    landmarkName: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 2,
    },
    landmarkSub: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    landmarkCoords: {
      fontSize: 10,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 4,
    },
    landmarkActions: {
      flexDirection: "row",
      gap: 8,
    },
    actionBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    actionBtnPrimary: {
      backgroundColor: colors.primary,
    },
    statsCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      marginTop: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: colors.accent,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 4,
    },
    emptyState: {
      padding: 40,
      alignItems: "center",
    },
    emptyStateText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
    },
  });

  const visitedCount = fort.landmarks.filter((l) => visitedLandmarks.has(l.id)).length;

  if (fort.landmarks.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.emptyState}>
            <Feather name="map" size={48} color={colors.mutedForeground} />
            <Text style={styles.emptyStateText}>
              No landmarks available for this fort yet. Check back soon!
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Static Map Card */}
        <View style={styles.mapCard}>
          {showInteractiveMap ? (
            <iframe
              src={getGoogleMapsEmbedUrl(centerLat, centerLng, zoom)}
              width={mapWidth}
              height={mapHeight}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <img
              src={staticMapUrl}
              alt={`Map of ${fort.name}`}
              style={{
                width: mapWidth,
                height: mapHeight,
                objectFit: "cover",
              }}
            />
          )}
          
          <View style={styles.mapOverlay}>
            <View style={styles.mapBadge}>
              <Text style={styles.mapBadgeText}>📍 {fort.landmarks.length} Landmarks</Text>
            </View>
            <TouchableOpacity
              style={styles.mapToggle}
              onPress={() => setShowInteractiveMap(!showInteractiveMap)}
            >
              <Feather
                name={showInteractiveMap ? "image" : "map"}
                size={14}
                color={colors.primaryForeground}
              />
              <Text style={styles.mapToggleText}>
                {showInteractiveMap ? "Static" : "Interactive"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapHint}>
            <Feather name="info" size={14} color={colors.mutedForeground} />
            <Text style={styles.mapHintText}>
              {showInteractiveMap
                ? "Interactive map powered by Google Maps"
                : "Tap landmarks below to explore their stories"}
            </Text>
          </View>
        </View>

        {/* Landmarks List */}
        <Text style={styles.sectionLabel}>Explore Landmarks</Text>
        
        <View style={styles.landmarksContainer}>
          {fort.landmarks.map((landmark) => {
            const visited = visitedLandmarks.has(landmark.id);
            const isSelected = selectedLandmark?.id === landmark.id;
            
            return (
              <TouchableOpacity
                key={landmark.id}
                style={[
                  styles.landmarkItem,
                  isSelected && styles.landmarkItemSelected,
                ]}
                onPress={() => setSelectedLandmark(landmark)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: visited ? colors.accent : colors.border },
                  ]}
                />
                <View style={styles.landmarkContent}>
                  <Text style={styles.landmarkName}>{landmark.name}</Text>
                  <Text style={styles.landmarkSub}>{landmark.subtitle}</Text>
                  <Text style={styles.landmarkCoords}>
                    📍 {landmark.latitude.toFixed(4)}, {landmark.longitude.toFixed(4)}
                  </Text>
                </View>
                <View style={styles.landmarkActions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() =>
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${landmark.latitude},${landmark.longitude}`,
                        "_blank"
                      )
                    }
                  >
                    <Feather name="navigation" size={14} color={colors.foreground} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionBtnPrimary]}
                    onPress={() =>
                      router.push(`/landmark/${landmark.fortId}/${landmark.id}`)
                    }
                  >
                    <Feather name="book-open" size={14} color={colors.primaryForeground} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{fort.landmarks.length}</Text>
              <Text style={styles.statLabel}>Total Landmarks</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{visitedCount}</Text>
              <Text style={styles.statLabel}>Visited</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round((visitedCount / fort.landmarks.length) * 100)}%
              </Text>
              <Text style={styles.statLabel}>Progress</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
