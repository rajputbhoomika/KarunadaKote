// Indian Languages Configuration
// Supports South Indian: Kannada, Tamil, Telugu, Malayalam
// Supports North Indian: Hindi, Marathi, Gujarati

export type LanguageCode = "EN" | "KN" | "TA" | "TE" | "ML" | "HI" | "MR" | "GU";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  region: "south" | "north" | "neutral";
  stateCodes: string[]; // Indian state codes where this language is primarily spoken
  expoSpeechCode: string; // Language code for expo-speech
  isAvailable: boolean; // Whether stories are available in this language
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: "EN",
    name: "English",
    nativeName: "English",
    region: "neutral",
    stateCodes: ["ALL"],
    expoSpeechCode: "en-IN",
    isAvailable: true,
  },
  {
    code: "KN",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    region: "south",
    stateCodes: ["KA"], // Karnataka
    expoSpeechCode: "kn-IN",
    isAvailable: true,
  },
  {
    code: "TA",
    name: "Tamil",
    nativeName: "தமிழ்",
    region: "south",
    stateCodes: ["TN", "PY"], // Tamil Nadu, Puducherry
    expoSpeechCode: "ta-IN",
    isAvailable: false, // Stories not yet available
  },
  {
    code: "TE",
    name: "Telugu",
    nativeName: "తెలుగు",
    region: "south",
    stateCodes: ["AP", "TG"], // Andhra Pradesh, Telangana
    expoSpeechCode: "te-IN",
    isAvailable: false, // Stories not yet available
  },
  {
    code: "ML",
    name: "Malayalam",
    nativeName: "മലയാളം",
    region: "south",
    stateCodes: ["KL", "LD"], // Kerala, Lakshadweep
    expoSpeechCode: "ml-IN",
    isAvailable: false, // Stories not yet available
  },
  {
    code: "HI",
    name: "Hindi",
    nativeName: "हिन्दी",
    region: "north",
    stateCodes: ["UP", "MP", "RJ", "HR", "HP", "UK", "JK", "LH", "CH", "DL", "BR", "JH"],
    expoSpeechCode: "hi-IN",
    isAvailable: false, // Stories not yet available
  },
  {
    code: "MR",
    name: "Marathi",
    nativeName: "मराठी",
    region: "north",
    stateCodes: ["MH", "GA"], // Maharashtra, Goa
    expoSpeechCode: "mr-IN",
    isAvailable: false, // Stories not yet available
  },
  {
    code: "GU",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    region: "north",
    stateCodes: ["GJ", "DD", "DN"], // Gujarat, Daman & Diu, Dadra & Nagar Haveli
    expoSpeechCode: "gu-IN",
    isAvailable: false, // Stories not yet available
  },
];

// Get language by code
export function getLanguageByCode(code: LanguageCode): Language | undefined {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
}

// Get available languages (with stories)
export function getAvailableLanguages(): Language[] {
  return SUPPORTED_LANGUAGES.filter((lang) => lang.isAvailable);
}

// Get all South Indian languages
export function getSouthIndianLanguages(): Language[] {
  return SUPPORTED_LANGUAGES.filter((lang) => lang.region === "south");
}

// Get all North Indian languages
export function getNorthIndianLanguages(): Language[] {
  return SUPPORTED_LANGUAGES.filter((lang) => lang.region === "north");
}

// Get language by state code (for location-based detection)
export function getLanguageByState(stateCode: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find((lang) => 
    lang.stateCodes.includes(stateCode) && lang.isAvailable
  );
}

// Default fallback language
export const DEFAULT_LANGUAGE: LanguageCode = "EN";

// Language to use for speech synthesis
export function getSpeechLanguage(code: LanguageCode): string {
  const lang = getLanguageByCode(code);
  return lang?.expoSpeechCode ?? "en-IN";
}

// Check if language has stories available
export function isLanguageAvailable(code: LanguageCode): boolean {
  const lang = getLanguageByCode(code);
  return lang?.isAvailable ?? false;
}

// Get best available language (fallback to English)
export function getBestAvailableLanguage(preferredCode: LanguageCode): LanguageCode {
  if (isLanguageAvailable(preferredCode)) {
    return preferredCode;
  }
  return DEFAULT_LANGUAGE;
}

// State to language mapping for common states
export const STATE_LANGUAGE_MAP: Record<string, LanguageCode> = {
  "Karnataka": "KN",
  "Tamil Nadu": "TA",
  "Andhra Pradesh": "TE",
  "Telangana": "TE",
  "Kerala": "ML",
  "Maharashtra": "MR",
  "Gujarat": "GU",
  "Goa": "MR",
  "Puducherry": "TA",
};

// Get distance between two coordinates in km (Haversine formula)
export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Major cities with their coordinates and primary languages
export const MAJOR_CITIES = [
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946, language: "KN" as LanguageCode },
  { name: "Mysuru", lat: 12.2958, lng: 76.6394, language: "KN" as LanguageCode },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, language: "TA" as LanguageCode },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558, language: "TA" as LanguageCode },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867, language: "TE" as LanguageCode },
  { name: "Vijayawada", lat: 16.5062, lng: 80.648, language: "TE" as LanguageCode },
  { name: "Kochi", lat: 9.9312, lng: 76.2673, language: "ML" as LanguageCode },
  { name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, language: "ML" as LanguageCode },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, language: "MR" as LanguageCode },
  { name: "Pune", lat: 18.5204, lng: 73.8567, language: "MR" as LanguageCode },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, language: "GU" as LanguageCode },
  { name: "Surat", lat: 21.1702, lng: 72.8311, language: "GU" as LanguageCode },
  { name: "Delhi", lat: 28.6139, lng: 77.209, language: "HI" as LanguageCode },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, language: "HI" as LanguageCode },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462, language: "HI" as LanguageCode },
];

// Detect language based on coordinates
export function detectLanguageByLocation(lat: number, lng: number): LanguageCode {
  // Find the nearest major city within 100km
  const NEAREST_THRESHOLD_KM = 100;
  
  let nearestCity = null;
  let minDistance = Infinity;
  
  for (const city of MAJOR_CITIES) {
    const distance = getDistanceFromLatLonInKm(lat, lng, city.lat, city.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  }
  
  // If within threshold, use that city's language
  if (nearestCity && minDistance <= NEAREST_THRESHOLD_KM) {
    const lang = getLanguageByCode(nearestCity.language);
    if (lang?.isAvailable) {
      return nearestCity.language;
    }
  }
  
  // Fallback to English
  return DEFAULT_LANGUAGE;
}

// Get language name for display
export function getLanguageDisplayName(code: LanguageCode, useNative = false): string {
  const lang = getLanguageByCode(code);
  if (!lang) return code;
  return useNative ? lang.nativeName : lang.name;
}

// Group languages by region
export function getLanguagesByRegion() {
  return {
    south: getSouthIndianLanguages(),
    north: getNorthIndianLanguages(),
    neutral: SUPPORTED_LANGUAGES.filter((lang) => lang.region === "neutral"),
  };
}

// Get story field name based on language code
export function getStoryFieldName(code: LanguageCode): string {
  return `story${code}`;
}

// Language selector options for UI
export const LANGUAGE_SELECTOR_GROUPS = [
  {
    title: "Available Now",
    languages: SUPPORTED_LANGUAGES.filter((lang) => lang.isAvailable),
  },
  {
    title: "South Indian Languages",
    languages: SUPPORTED_LANGUAGES.filter(
      (lang) => lang.region === "south" && !lang.isAvailable
    ),
  },
  {
    title: "North Indian Languages",
    languages: SUPPORTED_LANGUAGES.filter(
      (lang) => lang.region === "north" && !lang.isAvailable
    ),
  },
];

// Welcome messages in different languages (for Voice Assistant)
export const WELCOME_MESSAGES: Record<LanguageCode, string> = {
  EN: `Welcome to Karunada Kote Guide, your virtual historian for Karnataka Forts. You can explore historic forts with audio stories and photo challenges.`,
  KN: `ಕರುನಾಡ ಕೋಟೆ ಗೈಡ್‌ಗೆ ಸುಸ್ವಾಗತ. ಇದು ಕರ್ನಾಟಕದ ಕೋಟೆಗಳ ನಿಮ್ಮ ವರ್ಚುವಲ್ ಇತಿಹಾಸಕಾರ. ನೀವು ಧ್ವನಿ ಕಥೆಗಳು ಮತ್ತು ಫೋಟೋ ಸವಾಲುಗಳೊಂದಿಗೆ ಐತಿಹಾಸಿಕ ಕೋಟೆಗಳನ್ನು ಅನ್ವೇಷಿಸಬಹುದು.`,
  TA: `கருநாட கோட்டை வழிகாட்டிக்கு வரவேற்கிறோம். இது கர்நாடக கோட்டைகளின் உங்கள் மெய்நிகர் வரலாற்றாசிரியர். நீங்கள் ஒலி கதைகள் மற்றும் புகைப்பட சவால்களுடன் வரலாற்று கோட்டைகளை ஆராயலாம்.`,
  TE: `కరునాడ కోట గైడ్‌కు స్వాగతం. ఇది కర్ణాటక కోటల మీ వర్చువల్ చరిత్రకారుడు. మీరు ఆడియో కథలు మరియు ఫోటో సవాళ్లతో చారిత్రక కోటలను అన్వేషించవచ్చు.`,
  ML: `കരുണാഡ കോട്ട ഗൈഡിലേക്ക് സ്വാഗതം. ഇത് കർണാടകയിലെ കോട്ടകളുടെ നിങ്ങളുടെ വIRTUAL ചരിത്രകാരനാണ്. നിങ്ങൾക്ക് ഓഡിയോ കഥകളും ഫോട്ടോ വെല്ലുവിളികളും ഉപയോഗിച്ച് ചരിത്രപരമായ കോട്ടകൾ അന്വേഷിക്കാം.`,
  HI: `करुनाड कोटे गाइड में आपका स्वागत है। यह कर्नाटक के किलों का आपका आभासी इतिहासकार है। आप ऑडियो कहानियों और फोटो चुनौतियों के साऐतिहासिक किलों का अन्वेषण कर सकते हैं।`,
  MR: `करुनाड कोटे गाईडमध्ये आपले स्वागत आहे. हे कर्नाटकमधील किल्ल्यांचे तुमचे वर्चुअल इतिहासकार आहे. तुम्ही ऑडिओ कथा आणि फोटो आव्हानांसह ऐतिहासिक किल्ले शोधू शकता.`,
  GU: `કરુનાડા કોટે ગાઇડમાં આપનું સ્વાગત છે. આ કર્ણાટકના કિલ્લાઓનો તમારો વર્ચ્યુઅલ ઇતિહાસકાર છે. તમે ઓડિયો વાર્તાઓ અને ફોટો પડકારો સાથે ઐતિહાસિક કિલ્લાઓનું અન્વેષણ કરી શકો છો.`,
};

// Feature descriptions in different languages
export const FEATURE_DESCRIPTIONS: Record<LanguageCode, { explore: string; navigate: string; challenges: string }> = {
  EN: {
    explore: "Tap on any fort to start your tour",
    navigate: "Use the map to navigate between landmarks",
    challenges: "Complete photo challenges to track your progress",
  },
  KN: {
    explore: "ಪ್ರವಾಸವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಯಾವುದೇ ಕೋಟೆಯ ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ",
    navigate: "ಲ್ಯಾಂಡ್‌ಮಾರ್ಕ್‌ಗಳ ನಡುವೆ ನ್ಯಾವಿಗೇಟ್ ಮಾಡಲು ನಕ್ಷೆಯನ್ನು ಬಳಸಿ",
    challenges: "ನಿಮ್ಮ ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಫೋಟೋ ಸವಾಲುಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ",
  },
  TA: {
    explore: "உங்கள் சுற்றுப்பயணத்தைத் தொடங்க எந்தக் கோட்டையையும் தட்டவும்",
    navigate: "லேண்ட்மார்க்குகளுக்கு இடையில் செல்ல வரைபடத்தைப் பயன்படுத்தவும்",
    challenges: "உங்கள் முன்னேற்றத்தைக் கண்காணிக்க புகைப்பட சவால்களை முடிக்கவும்",
  },
  TE: {
    explore: "మీ పర్యటనను ప్రారంభించడానికి ఏ కోటపైనా ట్యాప్ చేయండి",
    navigate: "ల్యాండ్‌మార్క్‌ల మధ్య న్యావిగేట్ చేయడానికి మ్యాప్‌ను ఉపయోగించండి",
    challenges: "మీ పురోగతిని ట్రాక్ చేయడానికి ఫోటో సవాళ్లను పూర్తి చేయండి",
  },
  ML: {
    explore: "നിങ്ങളുടെ യാത്ര ആരംഭിക്കാൻ ഏത് കോട്ടയിലും ടാപ്പ് ചെയ്യുക",
    navigate: "ലാൻഡ്‌മാർക്കുകൾക്കിടയിൽ നാവിഗേറ്റ് ചെയ്യാൻ മാപ്പ് ഉപയോഗിക്കുക",
    challenges: "നിങ്ങളുടെ പുരോഗതി ട്രാക്ക് ചെയ്യാൻ ഫോട്ടോ വെല്ലുവിളികൾ പൂർത്തിയാക്കുക",
  },
  HI: {
    explore: "अपना दौरा शुरू करने के लिए किसी भी किले पर टैप करें",
    navigate: "लैंडमार्क के बीच नेविगेट करने के लिए मैप का उपयोग करें",
    challenges: "अपनी प्रगति को ट्रैक करने के लिए फोटो चुनौतियों को पूरा करें",
  },
  MR: {
    explore: "आपला दौरा सुरू करण्यासाठी कोणत्याही किल्ल्यावर टॅप करा",
    navigate: "लॅंडमार्क्स दरम्यान नेव्हिगेट करण्यासाठी नकाशाचा वापर करा",
    challenges: "आपली प्रगती ट्रॅक करण्यासाठी फोटो आव्हाने पूर्ण करा",
  },
  GU: {
    explore: "તમારા પ્રવાસની શરૂઆત કરવા માટે કોઈપણ કિલ્લા પર ટેપ કરો",
    navigate: "લેન્ડમાર્ક્સ વચ્ચે નેવિગેટ કરવા માટે નકશોનો ઉપયોગ કરો",
    challenges: "તમારી પ્રગતિ ટ્રેક કરવા માટે ફોટો પડકારો પૂર્ણ કરો",
  },
};

// Get welcome message for a language
export function getWelcomeMessage(code: LanguageCode): string {
  return WELCOME_MESSAGES[code] || WELCOME_MESSAGES.EN;
}

// Get feature descriptions for a language
export function getFeatureDescriptions(code: LanguageCode) {
  return FEATURE_DESCRIPTIONS[code] || FEATURE_DESCRIPTIONS.EN;
}

// Language labels for the UI
export const LANGUAGE_LABELS: Record<LanguageCode, { lang: string; select: string; auto: string; unavailable: string }> = {
  EN: { lang: "Language", select: "Select Language", auto: "Auto-detected", unavailable: "Stories coming soon" },
  KN: { lang: "ಭಾಷೆ", select: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", auto: "ಸ್ವಯಂ-ಪತ್ತೆಹಚ್ಚಲಾಗಿದೆ", unavailable: "ಕಥೆಗಳು ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತವೆ" },
  TA: { lang: "மொழி", select: "மொழியைத் தேர்ந்தெடுக்கவும்", auto: "தானியங்கி கண்டறிதல்", unavailable: "கதைகள் விரைவில்" },
  TE: { lang: "భాష", select: "భాషను ఎంచుకోండి", auto: "స్వయంచాలకంగా కనుగొనబడింది", unavailable: "కథలు త్వరలో" },
  ML: { lang: "ഭാഷ", select: "ഭാഷ തിരഞ്ഞെടുക്കുക", auto: "സ്വയമേവ കണ്ടെത്തി", unavailable: "കഥകൾ ഉടൻ വരും" },
  HI: { lang: "भाषा", select: "भाषा चुनें", auto: "स्वचालित रूप से पता लगाया", unavailable: "कहानियां जल्द आ रही हैं" },
  MR: { lang: "भाषा", select: "भाषा निवडा", auto: "स्वयं-शोधले", unavailable: "कथा लवकरच येत आहेत" },
  GU: { lang: "ભાષા", select: "ભાષા પસંદ કરો", auto: "આપો આપ શોધાયેલ", unavailable: "વાર્તાઓ ટૂંક સમયમાં આવશે" },
};

export function getLanguageLabels(code: LanguageCode) {
  return LANGUAGE_LABELS[code] || LANGUAGE_LABELS.EN;
}

// Detect region from coordinates for grouping
export function detectRegion(lat: number, lng: number): "south" | "north" | "unknown" {
  // Rough boundaries based on latitude
  // South India: Below 20°N (roughly)
  // North India: Above 20°N
  if (lat < 20) {
    return "south";
  } else if (lat >= 20) {
    return "north";
  }
  return "unknown";
}

// Get suggested languages based on location
export function getSuggestedLanguages(lat: number, lng: number): Language[] {
  const region = detectRegion(lat, lng);
  
  // Get available languages first
  const available = getAvailableLanguages();
  
  // Then get regional languages
  const regional = SUPPORTED_LANGUAGES.filter(
    (lang) => lang.region === region && !lang.isAvailable
  );
  
  // Combine, available first
  return [...available, ...regional];
}

// Get language flag/icon emoji
export function getLanguageFlag(code: LanguageCode): string {
  const flags: Record<LanguageCode, string> = {
    EN: "🇮🇳", // India for English (Indian English)
    KN: "🇮🇳", // Karnataka flag not available, using India
    TA: "🇮🇳", // Tamil Nadu
    TE: "🇮🇳", // Andhra/Telangana
    ML: "🇮🇳", // Kerala
    HI: "🇮🇳", // North India
    MR: "🇮🇳", // Maharashtra
    GU: "🇮🇳", // Gujarat
  };
  return flags[code] || "🇮🇳";
}

// Get region name
export function getRegionName(region: "south" | "north" | "neutral" | "unknown"): string {
  const names: Record<string, string> = {
    south: "South India",
    north: "North India",
    neutral: "All India",
    unknown: "Unknown Region",
  };
  return names[region] || "Unknown Region";
}

// Check if coordinates are in Karnataka
export function isInKarnataka(lat: number, lng: number): boolean {
  // Karnataka rough boundaries
  // Lat: 11.5°N to 18.5°N
  // Lng: 74°E to 78.5°E
  return lat >= 11.5 && lat <= 18.5 && lng >= 74 && lng <= 78.5;
}

// Get the best language for a fort location
export function getLanguageForFort(lat: number, lng: number): LanguageCode {
  // If in Karnataka, suggest Kannada
  if (isInKarnataka(lat, lng)) {
    return "KN";
  }
  
  // Otherwise, detect based on nearest city
  return detectLanguageByLocation(lat, lng);
}

// All language codes for iteration
export const ALL_LANGUAGE_CODES: LanguageCode[] = ["EN", "KN", "TA", "TE", "ML", "HI", "MR", "GU"];

// Available story languages (for which stories exist)
export const AVAILABLE_STORY_LANGUAGES: LanguageCode[] = ["EN", "KN"];

// Check if a language has stories for a specific landmark
export function hasStoryForLanguage(landmark: { storyEN: string; storyKN: string }, code: LanguageCode): boolean {
  if (code === "EN") return landmark.storyEN.length > 0;
  if (code === "KN") return landmark.storyKN.length > 0;
  // For other languages, check if we have the field (when we add more stories)
  const fieldName = getStoryFieldName(code);
  const story = (landmark as Record<string, string>)[fieldName];
  return typeof story === "string" && story.length > 0;
}

// Get story for a landmark in specific language with fallback
export function getStoryForLanguage(
  landmark: { storyEN: string; storyKN: string },
  code: LanguageCode
): string {
  if (code === "EN") return landmark.storyEN;
  if (code === "KN") return landmark.storyKN;
  
  // Check if story exists in requested language
  const fieldName = getStoryFieldName(code);
  const story = (landmark as Record<string, string>)[fieldName];
  
  if (story && story.length > 0) {
    return story;
  }
  
  // Fallback to English
  return landmark.storyEN;
}

// Language selector sections
export interface LanguageSection {
  title: string;
  subtitle?: string;
  languages: Language[];
}

// Build language sections for UI
export function buildLanguageSections(currentLocation?: { lat: number; lng: number }): LanguageSection[] {
  const sections: LanguageSection[] = [];
  
  // Section 1: Available now
  const available = getAvailableLanguages();
  if (available.length > 0) {
    sections.push({
      title: "Available Now",
      subtitle: "Stories available in these languages",
      languages: available,
    });
  }
  
  // Section 2: Suggested based on location
  if (currentLocation) {
    const detectedLang = detectLanguageByLocation(currentLocation.lat, currentLocation.lng);
    const lang = getLanguageByCode(detectedLang);
    
    if (lang && !lang.isAvailable) {
      const regionLangs = getSuggestedLanguages(currentLocation.lat, currentLocation.lng)
        .filter((l) => !l.isAvailable && l.code !== "EN");
      
      if (regionLangs.length > 0) {
        sections.push({
          title: `Suggested for ${getRegionName(detectRegion(currentLocation.lat, currentLocation.lng))}`,
          subtitle: "Stories coming soon",
          languages: regionLangs.slice(0, 3), // Top 3 suggestions
        });
      }
    }
  }
  
  // Section 3: All South Indian
  const south = getSouthIndianLanguages().filter((l) => !l.isAvailable);
  if (south.length > 0) {
    sections.push({
      title: "South Indian Languages",
      subtitle: "Tamil, Telugu, Malayalam - Stories coming soon",
      languages: south,
    });
  }
  
  // Section 4: All North Indian
  const north = getNorthIndianLanguages().filter((l) => !l.isAvailable);
  if (north.length > 0) {
    sections.push({
      title: "North Indian Languages",
      subtitle: "Hindi, Marathi, Gujarati - Stories coming soon",
      languages: north,
    });
  }
  
  return sections;
}

// Export default language configuration
export default {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  AVAILABLE_STORY_LANGUAGES,
  LANGUAGE_SELECTOR_GROUPS,
  WELCOME_MESSAGES,
  FEATURE_DESCRIPTIONS,
  LANGUAGE_LABELS,
  MAJOR_CITIES,
  STATE_LANGUAGE_MAP,
};
