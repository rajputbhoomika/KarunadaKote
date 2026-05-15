import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Circle, Marker, type Region } from "react-native-maps";

import { useProgress } from "@/context/ProgressContext";
import { type Fort, type Landmark } from "@/constants/fortData";
import { useColors } from "@/hooks/useColors";

const PROXIMITY_METERS = 50;

function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface FortMapViewProps {
  fort: Fort;
  headerHeight: number;
  bottomOffset: number;
}

export default function FortMapView({ fort, headerHeight, bottomOffset }: FortMapViewProps) {
  const colors = useColors();
  const { visitedLandmarks, markLandmarkVisited } = useProgress();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [nearbyLandmark, setNearbyLandmark] = useState<Landmark | null>(null);
  const [alertedLandmarks, setAlertedLandmarks] = useState<Set<string>>(new Set());
  const alertAnim = useRef(new Animated.Value(0)).current;
  const locationSub = useRef<Location.LocationSubscription | null>(null);

  const showNearbyAlert = useCallback(
    (landmark: Landmark) => {
      setNearbyLandmark(landmark);
      Animated.timing(alertAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAlertedLandmarks((prev) => new Set([...prev, landmark.id]));
    },
    [alertAnim]
  );

  const dismissAlert = useCallback(() => {
    Animated.timing(alertAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() =>
      setNearbyLandmark(null)
    );
  }, [alertAnim]);

  const startLocationTracking = useCallback(async () => {
    if (!locationPermission?.granted) return;
    locationSub.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 5, timeInterval: 3000 },
      (loc) => {
        const { latitude, longitude } = loc.coords;
        for (const landmark of fort.landmarks) {
          const dist = distanceMeters(latitude, longitude, landmark.latitude, landmark.longitude);
          if (dist <= PROXIMITY_METERS && !alertedLandmarks.has(landmark.id)) {
            showNearbyAlert(landmark);
            markLandmarkVisited(landmark.id);
            break;
          }
        }
      }
    );
  }, [locationPermission, fort, alertedLandmarks, showNearbyAlert, markLandmarkVisited]);

  useEffect(() => {
    startLocationTracking();
    return () => { locationSub.current?.remove(); };
  }, [startLocationTracking]);

  const styles = StyleSheet.create({
    map: { flex: 1, marginTop: headerHeight },
    permissionContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
      gap: 16,
      marginTop: headerHeight,
    },
    permissionText: {
      textAlign: "center",
      fontSize: 15,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      lineHeight: 22,
    },
    permissionBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: colors.radius,
    },
    permissionBtnText: {
      color: colors.primaryForeground,
      fontFamily: "Inter_600SemiBold",
      fontSize: 15,
    },
    alertBanner: {
      position: "absolute",
      bottom: bottomOffset + 16,
      left: 16,
      right: 16,
      backgroundColor: colors.primary,
      borderRadius: colors.radius + 4,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    alertIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    alertIconText: { fontSize: 20 },
    alertContent: { flex: 1 },
    alertLabel: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: "rgba(250,240,220,0.7)",
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 2,
    },
    alertTitle: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: colors.primaryForeground,
    },
    alertArrow: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    arrowText: { color: "#FAF0DC", fontSize: 16 },
    landmarkList: {
      position: "absolute",
      right: 16,
      bottom: bottomOffset + 80,
      gap: 8,
    },
    landmarkChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    landmarkChipText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      maxWidth: 160,
    },
    visitedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
    unvisitedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
    bottomActions: {
      position: "absolute",
      bottom: bottomOffset + 16,
      left: 16,
      flexDirection: "row",
      gap: 8,
    },
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    actionBtnText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
  });

  if (!locationPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ fontSize: 32 }}>⏳</Text>
      </View>
    );
  }

  if (!locationPermission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ fontSize: 48 }}>📍</Text>
        <Text style={styles.permissionText}>
          Location access is needed to track your position inside the fort and trigger landmark
          stories automatically as you explore.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestLocationPermission}>
          <Text style={styles.permissionBtnText}>Enable Location</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: fort.latitude,
          longitude: fort.longitude,
          latitudeDelta: fort.latitudeDelta,
          longitudeDelta: fort.longitudeDelta,
        } as Region}
        showsUserLocation
        showsMyLocationButton={false}
        mapType="satellite"
      >
        {fort.landmarks.map((landmark) => (
          <React.Fragment key={landmark.id}>
            <Marker
              coordinate={{ latitude: landmark.latitude, longitude: landmark.longitude }}
              title={landmark.name}
              description={landmark.subtitle}
              pinColor={visitedLandmarks.has(landmark.id) ? "#B8860B" : "#8B1A1A"}
              onCalloutPress={() =>
                router.push(`/landmark/${landmark.fortId}/${landmark.id}`)
              }
            />
            <Circle
              center={{ latitude: landmark.latitude, longitude: landmark.longitude }}
              radius={PROXIMITY_METERS}
              strokeColor="rgba(184,134,11,0.6)"
              fillColor="rgba(184,134,11,0.1)"
            />
          </React.Fragment>
        ))}
      </MapView>

      {nearbyLandmark && (
        <Animated.View style={[styles.alertBanner, { opacity: alertAnim }]}>
          <View style={styles.alertIcon}>
            <Text style={styles.alertIconText}>📍</Text>
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertLabel}>Landmark Nearby</Text>
            <Text style={styles.alertTitle}>{nearbyLandmark.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.alertArrow}
            onPress={() => {
              dismissAlert();
              router.push(`/landmark/${nearbyLandmark.fortId}/${nearbyLandmark.id}`);
            }}
          >
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={styles.landmarkList}>
        {fort.landmarks.map((landmark) => (
          <TouchableOpacity
            key={landmark.id}
            style={styles.landmarkChip}
            onPress={() => router.push(`/landmark/${landmark.fortId}/${landmark.id}`)}
            activeOpacity={0.8}
          >
            <View
              style={visitedLandmarks.has(landmark.id) ? styles.visitedDot : styles.unvisitedDot}
            />
            <Text style={styles.landmarkChipText} numberOfLines={1}>
              {landmark.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/challenges/${fort.id}`)}
        >
          <Text>📷</Text>
          <Text style={styles.actionBtnText}>Challenges</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/progress/${fort.id}`)}
        >
          <Text>🏅</Text>
          <Text style={styles.actionBtnText}>Progress</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
