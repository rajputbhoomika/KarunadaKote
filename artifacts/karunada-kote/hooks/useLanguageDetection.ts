import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";

import {
  type Language,
  type LanguageCode,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  detectLanguageByLocation,
  getLanguageByCode,
  getSuggestedLanguages,
  isLanguageAvailable,
  getBestAvailableLanguage,
  detectRegion,
  type LanguageSection,
  buildLanguageSections,
  getLanguageLabels,
} from "@/constants/languages";

interface UseLanguageDetectionReturn {
  // Current selected language
  selectedLanguage: LanguageCode;
  setSelectedLanguage: (code: LanguageCode) => void;
  
  // Auto-detected language based on location
  detectedLanguage: LanguageCode | null;
  
  // User's current location
  userLocation: { latitude: number; longitude: number } | null;
  locationError: string | null;
  
  // Permission status
  hasLocationPermission: boolean;
  requestLocationPermission: () => Promise<boolean>;
  
  // Language detection
  isDetecting: boolean;
  refreshLanguageDetection: () => Promise<void>;
  
  // Language data
  currentLanguage: Language | undefined;
  isCurrentLanguageAvailable: boolean;
  
  // Suggested languages
  suggestedLanguages: Language[];
  languageSections: LanguageSection[];
  
  // UI helpers
  languageLabels: ReturnType<typeof getLanguageLabels>;
  showLanguageSelector: boolean;
  setShowLanguageSelector: (show: boolean) => void;
  
  // Utility
  getEffectiveLanguage: () => LanguageCode;
}

const LANGUAGE_STORAGE_KEY = "@karunada_kote:selected_language";

export function useLanguageDetection(): UseLanguageDetectionReturn {
  // Selected language (user preference)
  const [selectedLanguage, setSelectedLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  
  // Auto-detected language from location
  const [detectedLanguage, setDetectedLanguage] = useState<LanguageCode | null>(null);
  
  // Location state
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  
  // UI state
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  
  // Load saved language preference
  useEffect(() => {
    // For web, use localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved) {
        const code = saved as LanguageCode;
        if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
          setSelectedLanguageState(code);
        }
      }
    }
  }, []);
  
  // Save language preference when it changes
  const setSelectedLanguage = useCallback((code: LanguageCode) => {
    setSelectedLanguageState(code);
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    }
  }, []);
  
  // Request location permission
  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === Location.PermissionStatus.GRANTED;
      setHasLocationPermission(granted);
      return granted;
    } catch (error) {
      console.error("Error requesting location permission:", error);
      setHasLocationPermission(false);
      return false;
    }
  }, []);
  
  // Detect language based on current location
  const detectLanguage = useCallback(async () => {
    setIsDetecting(true);
    setLocationError(null);
    
    try {
      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      
      // Detect language based on location
      const detected = detectLanguageByLocation(latitude, longitude);
      setDetectedLanguage(detected);
      
      // If detected language is available and user hasn't manually selected, use it
      if (isLanguageAvailable(detected) && selectedLanguage === DEFAULT_LANGUAGE) {
        setSelectedLanguageState(detected);
      }
      
      setLocationError(null);
    } catch (error) {
      console.error("Error detecting language from location:", error);
      setLocationError("Could not detect location. Using default language.");
    } finally {
      setIsDetecting(false);
    }
  }, [selectedLanguage]);
  
  // Initial permission check and language detection
  useEffect(() => {
    const init = async () => {
      try {
        // Check existing permission
        const { status } = await Location.getForegroundPermissionsAsync();
        const granted = status === Location.PermissionStatus.GRANTED;
        setHasLocationPermission(granted);
        
        if (granted) {
          // If permission already granted, detect language
          await detectLanguage();
        }
      } catch (error) {
        console.error("Error initializing language detection:", error);
      }
    };
    
    init();
  }, [detectLanguage]);
  
  // Refresh language detection
  const refreshLanguageDetection = useCallback(async () => {
    if (!hasLocationPermission) {
      const granted = await requestLocationPermission();
      if (!granted) return;
    }
    await detectLanguage();
  }, [hasLocationPermission, requestLocationPermission, detectLanguage]);
  
  // Get current language data
  const currentLanguage = getLanguageByCode(selectedLanguage);
  const isCurrentLanguageAvailable = isLanguageAvailable(selectedLanguage);
  
  // Get suggested languages based on location
  const suggestedLanguages = userLocation
    ? getSuggestedLanguages(userLocation.latitude, userLocation.longitude)
    : SUPPORTED_LANGUAGES.filter((l) => l.isAvailable);
  
  // Build language sections for UI
  const languageSections = userLocation
    ? buildLanguageSections({ lat: userLocation.latitude, lng: userLocation.longitude })
    : buildLanguageSections();
  
  // Get language labels for current language
  const languageLabels = getLanguageLabels(selectedLanguage);
  
  // Get effective language (fallback if selected not available)
  const getEffectiveLanguage = useCallback((): LanguageCode => {
    return getBestAvailableLanguage(selectedLanguage);
  }, [selectedLanguage]);
  
  return {
    selectedLanguage,
    setSelectedLanguage,
    detectedLanguage,
    userLocation,
    locationError,
    hasLocationPermission,
    requestLocationPermission,
    isDetecting,
    refreshLanguageDetection,
    currentLanguage,
    isCurrentLanguageAvailable,
    suggestedLanguages,
    languageSections,
    languageLabels,
    showLanguageSelector,
    setShowLanguageSelector,
    getEffectiveLanguage,
  };
}

// Hook for getting translated content
interface TranslatedContent {
  welcomeMessage: string;
  featureDescriptions: {
    explore: string;
    navigate: string;
    challenges: string;
  };
}

import { getWelcomeMessage, getFeatureDescriptions } from "@/constants/languages";

export function useTranslatedContent(languageCode: LanguageCode): TranslatedContent {
  return {
    welcomeMessage: getWelcomeMessage(languageCode),
    featureDescriptions: getFeatureDescriptions(languageCode),
  };
}

export default useLanguageDetection;
