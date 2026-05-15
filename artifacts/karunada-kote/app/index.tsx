import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProgressBar } from "@/components/ProgressBar";
import { useProgress } from "@/context/ProgressContext";
import { FORTS, type Fort } from "@/constants/fortData";
import { useColors } from "@/hooks/useColors";
import {
  type Language,
  type LanguageCode,
  SUPPORTED_LANGUAGES,
  getLanguageByCode,
  getLanguageDisplayName,
  getSpeechLanguage,
  getWelcomeMessage,
  getLanguageLabels,
  type LanguageSection,
  buildLanguageSections,
  isLanguageAvailable,
  detectRegion,
} from "@/constants/languages";
import { useLanguageDetection } from "@/hooks/useLanguageDetection";

// Language Selector Component
function LanguageSelector({
  visible,
  onClose,
  selectedLanguage,
  onSelectLanguage,
  detectedLanguage,
  hasLocationPermission,
  requestLocationPermission,
  isDetecting,
  languageSections,
}: {
  visible: boolean;
  onClose: () => void;
  selectedLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  detectedLanguage: LanguageCode | null;
  hasLocationPermission: boolean;
  requestLocationPermission: () => Promise<boolean>;
  isDetecting: boolean;
  languageSections: LanguageSection[];
}) {
  const colors = useColors();
  const labels = getLanguageLabels(selectedLanguage);

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "flex-end",
    },
    container: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: "80%",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      padding: 20,
    },
    locationBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: colors.accent + "15",
      borderRadius: colors.radius,
      padding: 16,
      marginBottom: 20,
    },
    locationText: {
      flex: 1,
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      lineHeight: 18,
    },
    detectBtn: {
      backgroundColor: colors.accent,
      borderRadius: colors.radius,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    detectBtnText: {
      color: colors.accentForeground,
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.accent,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    sectionSubtitle: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 12,
    },
    langItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: colors.radius,
      marginBottom: 8,
    },
    langItemSelected: {
      backgroundColor: colors.accent + "15",
      borderWidth: 1,
      borderColor: colors.accent,
    },
    langItemUnavailable: {
      opacity: 0.6,
    },
    langFlag: {
      fontSize: 24,
    },
    langInfo: {
      flex: 1,
    },
    langName: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    langNative: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    langBadge: {
      backgroundColor: colors.muted,
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    langBadgeText: {
      fontSize: 10,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
    },
    langBadgeSelected: {
      backgroundColor: colors.accent,
    },
    langBadgeSelectedText: {
      color: colors.accentForeground,
    },
    autoDetected: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 4,
    },
    autoDetectedText: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.accent,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{labels.select}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Feather name="x" size={18} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Location Detection Banner */}
            <View style={styles.locationBanner}>
              <Feather name="map-pin" size={20} color={colors.accent} />
              <Text style={styles.locationText}>
                {hasLocationPermission
                  ? "We'll suggest languages based on your location"
                  : "Allow location access to auto-detect your regional language"}
              </Text>
              {!hasLocationPermission && (
                <TouchableOpacity style={styles.detectBtn} onPress={requestLocationPermission}>
                  <Text style={styles.detectBtnText}>Allow</Text>
                </TouchableOpacity>
              )}
              {isDetecting && (
                <ActivityIndicator size="small" color={colors.accent} />
              )}
            </View>

            {/* Language Sections */}
            {languageSections.map((section, idx) => (
              <View key={idx} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.subtitle && (
                  <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
                )}
                {section.languages.map((lang) => {
                  const isSelected = selectedLanguage === lang.code;
                  const isAvailable = lang.isAvailable;
                  const isAutoDetected = detectedLanguage === lang.code;

                  return (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.langItem,
                        isSelected && styles.langItemSelected,
                        !isAvailable && styles.langItemUnavailable,
                      ]}
                      onPress={() => {
                        onSelectLanguage(lang.code);
                        if (isAvailable) onClose();
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.langFlag}>{lang.region === "south" ? "🌴" : lang.region === "north" ? "🏔️" : "🌍"}</Text>
                      <View style={styles.langInfo}>
                        <Text style={styles.langName}>{lang.name}</Text>
                        <Text style={styles.langNative}>{lang.nativeName}</Text>
                        {isAutoDetected && (
                          <View style={styles.autoDetected}>
                            <Feather name="navigation" size={10} color={colors.accent} />
                            <Text style={styles.autoDetectedText}>{labels.auto}</Text>
                          </View>
                        )}
                      </View>
                      <View style={[styles.langBadge, isSelected && styles.langBadgeSelected]}>
                        <Text style={[styles.langBadgeText, isSelected && styles.langBadgeSelectedText]}>
                          {isAvailable ? "✓" : "Soon"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// Voice Assistant Component
function VoiceAssistant({
  visible,
  onClose,
  selectedLanguage,
  onOpenLanguageSelector,
  detectedLanguage,
}: {
  visible: boolean;
  onClose: () => void;
  selectedLanguage: LanguageCode;
  onOpenLanguageSelector: () => void;
  detectedLanguage: LanguageCode | null;
}) {
  const colors = useColors();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const labels = getLanguageLabels(selectedLanguage);

  const currentLang = getLanguageByCode(selectedLanguage);
  const welcomeMessage = getWelcomeMessage(selectedLanguage);

  const startVoiceGuide = useCallback(async () => {
    setIsSpeaking(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const speechLang = getSpeechLanguage(selectedLanguage);

    Speech.speak(welcomeMessage, {
      language: speechLang,
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  }, [selectedLanguage, welcomeMessage]);

  const stopVoiceGuide = useCallback(async () => {
    await Speech.stop();
    setIsSpeaking(false);
  }, []);

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    container: {
      backgroundColor: colors.card,
      borderRadius: colors.radius + 8,
      padding: 24,
      width: "100%",
      maxWidth: 400,
      alignItems: "center",
    },
    icon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: isSpeaking ? colors.accent : colors.muted,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    iconText: {
      fontSize: 36,
    },
    title: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 20,
    },
    button: {
      backgroundColor: isSpeaking ? colors.muted : colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 14,
      paddingHorizontal: 24,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
    },
    buttonText: {
      color: isSpeaking ? colors.mutedForeground : colors.primaryForeground,
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
    closeButton: {
      paddingVertical: 12,
    },
    closeText: {
      color: colors.mutedForeground,
      fontSize: 14,
      fontFamily: "Inter_500Medium",
    },
    langSelector: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      marginBottom: 12,
    },
    langSelectorText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    pulse: {
      position: "absolute",
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.accent,
      opacity: 0.3,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.icon}>
            <Text style={styles.iconText}>{isSpeaking ? "🎙️" : "🎧"}</Text>
          </View>
          
          <Text style={styles.title}>Voice Assistant</Text>
          <Text style={styles.subtitle}>
            {isSpeaking
              ? "Playing audio guide... Tap stop to end."
              : "Let me guide you through Karnataka's historic forts. Tap start to begin."}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={isSpeaking ? stopVoiceGuide : startVoiceGuide}
            activeOpacity={0.8}
          >
            <Feather
              name={isSpeaking ? "square" : "play"}
              size={18}
              color={isSpeaking ? colors.mutedForeground : colors.primaryForeground}
            />
            <Text style={styles.buttonText}>
              {isSpeaking ? "Stop Guide" : "Start Audio Guide"}
            </Text>
          </TouchableOpacity>

          {/* Language Selection Button */}
          <TouchableOpacity 
            style={styles.langSelector} 
            onPress={onOpenLanguageSelector}
          >
            <Feather name="globe" size={14} color={colors.mutedForeground} />
            <Text style={styles.langSelectorText}>
              {currentLang?.nativeName} ({currentLang?.name})
            </Text>
            <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function FortCard({ fort }: { fort: Fort }) {
  const colors = useColors();
  const { getFortProgress } = useProgress();
  const progress = getFortProgress(fort.id);

  const styles = StyleSheet.create({
    card: {
      marginHorizontal: 16,
      marginBottom: 20,
      borderRadius: colors.radius + 4,
      backgroundColor: colors.card,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#2C1A0E",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    imageContainer: {
      height: 180,
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    imageGradient: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 80,
    },
    eraBadge: {
      position: "absolute",
      top: 12,
      right: 12,
      backgroundColor: "rgba(44,26,14,0.75)",
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    eraBadgeText: {
      color: "#FAF0DC",
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
    },
    imageTitle: {
      position: "absolute",
      bottom: 12,
      left: 14,
      right: 14,
    },
    fortName: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: "#FAF0DC",
    },
    fortSubtitle: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "#E8D5B0",
      marginTop: 2,
    },
    body: {
      padding: 16,
      gap: 12,
    },
    districtLabel: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.accent,
      letterSpacing: 0.3,
    },
    description: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 21,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    startBtn: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    startBtnText: {
      color: colors.primaryForeground,
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
    },
    challengesBtn: {
      width: 44,
      height: 44,
      borderRadius: colors.radius,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    progressBtn: {
      width: 44,
      height: 44,
      borderRadius: colors.radius,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={fort.image} style={styles.image} contentFit="cover" />
        <LinearGradient
          colors={["transparent", "rgba(44,26,14,0.85)"]}
          style={styles.imageGradient}
        />
        <View style={styles.eraBadge}>
          <Text style={styles.eraBadgeText}>{fort.era}</Text>
        </View>
        <View style={styles.imageTitle}>
          <Text style={styles.fortName}>{fort.name}</Text>
          <Text style={styles.fortSubtitle}>{fort.subtitle}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.districtLabel}>{fort.district}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {fort.description}
        </Text>

        <ProgressBar
          percentage={progress.percentage}
          visited={progress.visited}
          total={progress.total}
          compact
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => router.push(`/fort/${fort.id}`)}
            activeOpacity={0.85}
          >
            <Feather name="map" size={18} color={colors.primaryForeground} />
            <Text style={styles.startBtnText}>Start Tour</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.challengesBtn}
            onPress={() => router.push(`/challenges/${fort.id}`)}
            activeOpacity={0.8}
          >
            <Feather name="camera" size={18} color={colors.foreground} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.progressBtn}
            onPress={() => router.push(`/progress/${fort.id}`)}
            activeOpacity={0.8}
          >
            <Feather name="award" size={18} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 4,
    },
    headerBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    langBtn: {
      marginLeft: "auto",
      marginRight: 8,
      width: 44,
      backgroundColor: colors.muted,
      borderWidth: 1,
      borderColor: colors.border,
    },
    langBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    voiceBtn: {
      backgroundColor: colors.accent,
    },
    appIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 16,
      marginBottom: 4,
    },
    sectionLabel: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.accent,
      letterSpacing: 2,
      textTransform: "uppercase",
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    searchWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginHorizontal: 16,
      marginBottom: 12,
      paddingHorizontal: 14,
      paddingVertical: Platform.OS === "ios" ? 10 : 8,
      borderRadius: colors.radius,
      backgroundColor: colors.muted,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      paddingVertical: 0,
    },
    filterScroll: {
      marginBottom: 8,
      maxHeight: 44,
    },
    filterScrollContent: {
      paddingHorizontal: 16,
      gap: 8,
      alignItems: "center",
      paddingBottom: 12,
    },
    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.muted,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterChipActive: {
      backgroundColor: colors.accent + "22",
      borderColor: colors.accent,
    },
    filterChipText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    filterChipTextActive: {
      color: colors.accent,
      fontFamily: "Inter_600SemiBold",
    },
    emptyState: {
      paddingHorizontal: 32,
      paddingVertical: 40,
      alignItems: "center",
    },
    emptyStateText: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 22,
    },
    list: {
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 20),
    },
  });

  const [voiceAssistantVisible, setVoiceAssistantVisible] = useState(false);
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const districtOptions = useMemo(() => {
    const names = [...new Set(FORTS.map((f) => f.district))];
    return names.sort((a, b) => a.localeCompare(b));
  }, []);

  const filteredForts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FORTS.filter((f) => {
      if (districtFilter !== "all" && f.district !== districtFilter) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.subtitle.toLowerCase().includes(q) ||
        f.district.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
      );
    });
  }, [districtFilter, searchQuery]);

  // Language detection hook
  const {
    selectedLanguage,
    setSelectedLanguage,
    detectedLanguage,
    hasLocationPermission,
    requestLocationPermission,
    isDetecting,
    languageSections,
    showLanguageSelector,
    setShowLanguageSelector,
  } = useLanguageDetection();

  return (
    <View style={styles.container}>
      {/* Language Selector Modal */}
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
        detectedLanguage={detectedLanguage}
        hasLocationPermission={hasLocationPermission}
        requestLocationPermission={requestLocationPermission}
        isDetecting={isDetecting}
        languageSections={languageSections}
      />

      <VoiceAssistant 
        visible={voiceAssistantVisible} 
        onClose={() => setVoiceAssistantVisible(false)} 
        selectedLanguage={selectedLanguage}
        onOpenLanguageSelector={() => setShowLanguageSelector(true)}
        detectedLanguage={detectedLanguage}
      />
      
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.appIcon}
            contentFit="cover"
          />
          <Text style={styles.headerTitle}>Karunada Kote Guide</Text>
          {/* Language Selector Button */}
          <TouchableOpacity
            style={[styles.headerBtn, styles.langBtn]}
            onPress={() => setShowLanguageSelector(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.langBtnText}>
              {getLanguageDisplayName(selectedLanguage, true)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerBtn, styles.voiceBtn]}
            onPress={() => setVoiceAssistantVisible(true)}
            activeOpacity={0.8}
          >
            <Feather name="mic" size={18} color={colors.accentForeground} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Virtual Historian — Karnataka Forts
        </Text>
      </View>

      <FlatList
        data={filteredForts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FortCard fort={item} />}
        ListHeaderComponent={
          <>
            <Text style={styles.sectionLabel}>Choose Your Fort</Text>
            <View style={styles.searchWrap}>
              <Feather name="search" size={18} color={colors.mutedForeground} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search name, district, or keywords…"
                placeholderTextColor={colors.mutedForeground}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="while-editing"
              />
            </View>
            <ScrollView
              horizontal
              style={styles.filterScroll}
              contentContainerStyle={styles.filterScrollContent}
              showsHorizontalScrollIndicator={false}
            >
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  districtFilter === "all" && styles.filterChipActive,
                ]}
                onPress={() => setDistrictFilter("all")}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    districtFilter === "all" && styles.filterChipTextActive,
                  ]}
                >
                  All districts
                </Text>
              </TouchableOpacity>
              {districtOptions.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.filterChip,
                    districtFilter === d && styles.filterChipActive,
                  ]}
                  onPress={() =>
                    setDistrictFilter((cur) => (cur === d ? "all" : d))
                  }
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      districtFilter === d && styles.filterChipTextActive,
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No forts match your search or district filter. Try “All districts”
              or different keywords.
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
