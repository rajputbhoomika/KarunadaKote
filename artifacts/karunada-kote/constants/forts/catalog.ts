import type { Fort } from "../fortData";

const placeholder = require("../../assets/images/icon.png");

function fort(
  partial: Omit<Fort, "image" | "landmarks" | "challenges"> & {
    image?: number;
    landmarks?: Fort["landmarks"];
    challenges?: Fort["challenges"];
  },
): Fort {
  return {
    ...partial,
    image: partial.image ?? placeholder,
    landmarks: partial.landmarks ?? [],
    challenges: partial.challenges ?? [],
  };
}

/** Shown first in the app fort list (North Karnataka highlights). */
export const featuredFortsFirst: Fort[] = [
  fort({
    id: "hampi",
    name: "Hampi Fort",
    subtitle: "Heart of Vijayanagara",
    description:
      "Ruins of the royal fortified core of the Vijayanagara capital — granite gateways, temple-lined avenues, and the dramatic boulder-strewn landscape that framed one of South India’s greatest empires.",
    district: "Vijayanagara",
    image: require("../../assets/images/fort_hampi.jpg"),
    latitude: 15.3172,
    longitude: 76.4717,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
    era: "14th – 16th Century",
    landmarks: [
      {
        id: "hampi-royal-enclosure",
        fortId: "hampi",
        name: "Royal Enclosure",
        subtitle: "Palace Core of Vijayanagara",
        latitude: 15.3149,
        longitude: 76.4734,
        storyEN:
          "The Royal Enclosure was the administrative and ceremonial heart of the capital — a walled precinct of platforms, stepped tanks, and palace foundations where the Vijayanagara court displayed its power. Walking these granite plinths, you trace the layout of audience halls and pavilions that once overlooked processions and state rituals.",
        storyKN:
          "ರಾಜಕೀಯ ಆವರಣವು ರಾಜಧಾನಿಯ ಆಡಳಿತಾತ್ಮಕ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಕೇಂದ್ರವಾಗಿತ್ತು — ವಿಜಯನಗರ ಅರಮನೆಯ ಅವಶೇಷಗಳು, ಕಾಲುವೆಗಳು ಮತ್ತು ಮಂಟಪಗಳ ಒಡ್ಡುಗಳ ಈ ಪ್ರದೇಶ ಇಂದಿಗೂ ಸಾಮ್ರಾಜ್ಯದ ವೈಭವವನ್ನು ನೆನಪಿಸುತ್ತದೆ.",
        image: null,
        audioDurationSeconds: 48,
      },
      {
        id: "hampi-elephant-stables",
        fortId: "hampi",
        name: "Elephant Stables",
        subtitle: "Domed Royal Stables",
        latitude: 15.3086,
        longitude: 76.4716,
        storyEN:
          "This long arc of domed chambers housed the empire’s war elephants — a symbol of military might and royal prestige. The hybrid Indo-Islamic vaulting is among Hampi’s most photogenic monuments and a reminder of how the capital blended Deccan building traditions.",
        storyKN:
          "ಈ ಅರ್ಧಗೋಳಾಕಾರದ ಕೊಠಡಿಗಳ ಶ್ರೇಣಿ ಸಾಮ್ರಾಜ್ಯದ ಯುದ್ಧ ಆನೆಗಳಿಗೆ ನಿವಾಸವಾಗಿತ್ತು. ಡೆಕ್ಕನ್ ವಾಸ್ತುಶೈಲಿಯ ಈ ಮಿಶ್ರ ನಿರ್ಮಾಣ ಹಂಪಿಯ ಪ್ರಸಿದ್ಧ ನೋಟಗಳಲ್ಲಿ ಒಂದು.",
        image: null,
        audioDurationSeconds: 44,
      },
      {
        id: "hampi-virupaksha",
        fortId: "hampi",
        name: "Virupaksha Temple Approach",
        subtitle: "Sacred Axis of the Sacred Centre",
        latitude: 15.3351,
        longitude: 76.4601,
        storyEN:
          "The living Virupaksha shrine anchors Hampi’s ritual life and the old market street that fed pilgrims and traders. From here, the sacred landscape of the Tungabhadra and the boulder ridges frames how the city fused devotion with imperial ambition.",
        storyKN:
          "ಜೀವಂತ ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯವು ಹಂಪಿಯ ಧಾರ್ಮಿಕ ಜೀವನದ ಕೇಂದ್ರ. ತುಂಗಭದ್ರಾ ಮತ್ತು ಬಂಡೆಗಳ ನಡುವಿನ ಈ ಪವಿತ್ರ ದೃಶ್ಯ ಸಾಮ್ರಾಜ್ಯದ ಭಕ್ತಿ ಮತ್ತು ರಾಜಕೀಯತೆಯ ಸಂಗಮವನ್ನು ಸೂಚಿಸುತ್ತದೆ.",
        image: null,
        audioDurationSeconds: 46,
      },
    ],
    challenges: [
      {
        id: "challenge-hampi-royal",
        fortId: "hampi",
        landmarkId: "hampi-royal-enclosure",
        titleEN: "Enclosure Explorer",
        titleKN: "ಆವರಣ ಅನ್ವೇಷಕ",
        descriptionEN: "Photograph the scale of the Royal Enclosure’s granite platforms.",
        descriptionKN: "ರಾಜಕೀಯ ಆವರಣದ ಗ್ರಾನೈಟ್ ಒಡ್ಡುಗಳ ವಿಸ್ತಾರವನ್ನು ಛಾಯಾಚಿತ್ರ ತೆಗೆಯಿರಿ.",
      },
      {
        id: "challenge-hampi-stables",
        fortId: "hampi",
        landmarkId: "hampi-elephant-stables",
        titleEN: "Stable Silhouettes",
        titleKN: "ಸ್ಥಿರ ನೆರಳುಗಳು",
        descriptionEN: "Capture the repeating domes of the Elephant Stables.",
        descriptionKN: "ಆನೆಗಳ ನಿಲಯದ ಪುನರಾವರ್ತಿತ ಗುಮ್ಮಟಗಳನ್ನು ಛಾಯಾಚಿತ್ರ ತೆಗೆಯಿರಿ.",
      },
    ],
  }),
  fort({
    id: "bellari",
    name: "Ballari Fort (Bellary)",
    subtitle: "Granite Hill Stronghold",
    description:
      "A commanding fort atop Ballari’s granite hills, long a strategic watchpoint over the eastern Deccan — layered by Vijayanagara, Bahmani, and later powers.",
    district: "Ballari",
    image: require("../../assets/images/fort_bellari.jpg"),
    latitude: 15.1506,
    longitude: 76.9301,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
    era: "15th – 19th Century",
    landmarks: [
      {
        id: "bellari-upper-fort",
        fortId: "bellari",
        name: "Upper Fort & Citadel",
        subtitle: "Summit Stronghold",
        latitude: 15.1512,
        longitude: 76.9296,
        storyEN:
          "The upper works crown Ballari’s twin hills, with steep approaches designed to tire attackers long before they reached the core. From the summit, the plain opens toward the east — the same sightlines that made this fort a prize for successive Deccan states.",
        storyKN:
          "ಮೇಲಿನ ಕೋಟೆ ಭಾಗಗಳು ಬಳ್ಳಾರಿಯ ಏಕಗ್ರಾನೈಟ್ ಶಿಖರಗಳ ಮೇಲೆ ನಿಂತಿವೆ; ಇಕ್ಕೆಲದ ಮಾರ್ಗಗಳು ಆಕ್ರಮಣಕಾರರನ್ನು ನಿಧಾನಗೊಳಿಸಲು ವಿನ್ಯಾಸಗೊಂಡಿವೆ. ಶಿಖರದಿಂದ ಪೂರ್ವದ ಸಮತಲ ವಿಶಾಲವಾಗಿ ಕಾಣುತ್ತದೆ.",
        image: null,
        audioDurationSeconds: 45,
      },
      {
        id: "bellari-ramparts",
        fortId: "bellari",
        name: "Granite Ramparts",
        subtitle: "Ring of Defensive Walls",
        latitude: 15.1498,
        longitude: 76.9312,
        storyEN:
          "Massive curtain walls follow the natural contours of the hill, using the bedrock itself as foundation. Ballari’s masonry belongs to a long arc of Vijayanagara-era hill-fort engineering adapted under later rulers who repaired and re-armed the gates.",
        storyKN:
          "ದಪ್ಪ ಆವರಣ ಗೋಡೆಗಳು ಬೆಟ್ಟದ ನೈಸರ್ಗಿಕ ರೇಖೆಯನ್ನು ಅನುಸರಿಸಿ ಬಂಡೆಯ ಮೇಲೆ ನಿಂತಿವೆ. ಈ ಶಿಲ್ಪಕಲೆ ವಿಜಯನಗರ ಕಾಲದ ಗಿರಿಕೋಟೆಗಳ ಪರಂಪರೆಯ ಭಾಗ.",
        image: null,
        audioDurationSeconds: 42,
      },
    ],
    challenges: [
      {
        id: "challenge-bellari-summit",
        fortId: "bellari",
        landmarkId: "bellari-upper-fort",
        titleEN: "Hilltop Horizon",
        titleKN: "ಶಿಖರದ ಕ್ಷಿತಿಜ",
        descriptionEN: "Take a photo from the upper fort showing the surrounding plain.",
        descriptionKN: "ಮೇಲಿನ ಕೋಟೆಯಿಂದ ಸುತ್ತಲಿನ ಸಮತಲವನ್ನು ತೋರಿಸುವ ಫೋಟೋ ತೆಗೆಯಿರಿ.",
      },
    ],
  }),
  fort({
    id: "koppal",
    name: "Koppal Fort",
    subtitle: "Northern Karnataka Bastion",
    description:
      "Historic hill fort overlooking Koppal — a key node in medieval campaigns across the Tungabhadra basin and the surrounding plateau.",
    district: "Koppal",
    image: require("../../assets/images/fort_koppal.jpg"),
    latitude: 15.3456,
    longitude: 76.1578,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
    era: "12th – 18th Century",
    landmarks: [
      {
        id: "koppal-main-gate",
        fortId: "koppal",
        name: "Fort Gateway",
        subtitle: "Principal Entrance",
        latitude: 15.3461,
        longitude: 76.1575,
        storyEN:
          "The main approach threads up the scarp toward Koppal’s walled summit — a classic hill-fort sequence of bends and outer works meant to break the momentum of assaulting columns.",
        storyKN:
          "ಮುಖ್ಯ ಮಾರ್ಗವು ಕೊಪ್ಪಲ್ ಕೋಟೆಯ ಮುತ್ತಿನ ಶಿಖರದ ಕಡೆಗೆ ಬಂಡೆಯ ಢಾಲನ್ನು ಹತ್ತುತ್ತದೆ — ತಿರುವುಗಳು ಮತ್ತು ಹೊರಾವರಣಗಳು ಶತ್ರುಗಳ ನೇರ ದಾಳಿಯನ್ನು ಮುರಿಯಲು ವಿನ್ಯಾಸಗೊಂಡಿವೆ.",
        image: null,
        audioDurationSeconds: 40,
      },
      {
        id: "koppal-viewpoint",
        fortId: "koppal",
        name: "Plateau Viewpoint",
        subtitle: "Over the Tungabhadra Basin",
        latitude: 15.3448,
        longitude: 76.1585,
        storyEN:
          "From the higher batteries, the land falls away toward the Tungabhadra drainage and the agricultural mosaic of Koppal district — the strategic reason chieftains and sultans contested this rock for centuries.",
        storyKN:
          "ಎತ್ತರದ ಬ್ಯಾಟರಿಗಳಿಂದ ತುಂಗಭದ್ರಾ ಪ್ರದೇಶ ಮತ್ತು ಕೊಪ್ಪಲ್ ಜಿಲ್ಲೆಯ ಕೃಷಿ ಪ್ರದೇಶಗಳು ಕಾಣುತ್ತವೆ; ಈ ಕಾರಣದಿಂದಲೇ ಶತಮಾನಗಳ ಕಾಲ ಈ ಬಂಡೆಗಾಗಿ ಹೋರಾಟ ನಡೆದಿದೆ.",
        image: null,
        audioDurationSeconds: 43,
      },
    ],
    challenges: [
      {
        id: "challenge-koppal-gate",
        fortId: "koppal",
        landmarkId: "koppal-main-gate",
        titleEN: "Gateway Guardian",
        titleKN: "ದ್ವಾರ ಪಾಲಕ",
        descriptionEN: "Photograph the fort’s main gateway and approach.",
        descriptionKN: "ಕೋಟೆಯ ಮುಖ್ಯ ದ್ವಾರ ಮತ್ತು ಮಾರ್ಗವನ್ನು ಛಾಯಾಚಿತ್ರ ತೆಗೆಯಿರಿ.",
      },
    ],
  }),
];

// Curated Karnataka-wide starter catalog (placeholder images for now).
// You can keep expanding this list and later swap in real cover images.
export const curatedKarnatakaForts: Fort[] = [
  fort({
    id: "belgaum",
    name: "Belgaum Fort (Belagavi)",
    subtitle: "Gateway of the Deccan",
    description:
      "A large fortified complex shaped by the Ratta dynasty, Adil Shahi, and Marathas — known for its massive bastions and layered history.",
    district: "Belagavi",
    image: require("../../assets/images/fort_belgaum.jpg"),
    latitude: 15.8497,
    longitude: 74.4977,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
    era: "12th – 18th Century",
    landmarks: [
      {
        id: "belgaum-main-gate",
        fortId: "belgaum",
        name: "Belgaum Fort Main Gate",
        subtitle: "Historic Entrance",
        latitude: 15.8495,
        longitude: 74.4975,
        storyEN:
          "The main gate of Belgaum Fort stands as a testament to centuries of military architecture. Built by the Ratta dynasty and later strengthened by the Adil Shahi rulers, this imposing entrance features thick stone walls and defensive bastions. The gate witnessed countless processions of armies, traders, and pilgrims passing through the Deccan plateau. As you stand here, imagine the clash of swords and the bustle of medieval commerce that once filled this space.",
        storyKN:
          "ಬೆಳಗಾವಿ ಕೋಟೆಯ ಮುಖ್ಯ ದ್ವಾರ ಶತಮಾನಗಳ ಸೈನಿಕ ವಾಸ್ತುಶಿಲ್ಪಕ್ಕೆ ಸಾಕ್ಷಿಯಾಗಿ ನಿಂತಿದೆ. ರಟ್ಟ ರಾಜವಂಶದವರಿಂದ ನಿರ್ಮಿಸಲ್ಪಟ್ಟು, ನಂತರ ಅದಿಲ್ ಶಾಹಿ ಆಡಳಿತಗಾರರಿಂದ ಬಲಪಡಿಸಲ್ಪಟ್ಟ ಈ ದ್ವಾರವು ದಪ್ಪ ಕಲ್ಲಿನ ಗೋಡೆಗಳು ಮತ್ತು ರಕ್ಷಣಾತ್ಮಕ ಬುರುಜುಗಳನ್ನು ಹೊಂದಿದೆ.",
        image: null,
        audioDurationSeconds: 40,
      },
      {
        id: "belgaum-ramparts",
        fortId: "belgaum",
        name: "Ancient Ramparts",
        subtitle: "Defensive Walls",
        latitude: 15.8502,
        longitude: 74.498,
        storyEN:
          "These massive ramparts encircle the fort's core, built from locally quarried black basalt stone. Standing atop these walls, soldiers once kept watch over the surrounding plains, scanning for approaching enemies from the Deccan plateau. The unique design allows defenders to fire upon attackers from multiple angles while remaining protected.",
        storyKN:
          "ಈ ಸಶಕ್ತ ಆವರಣ ಗೋಡೆಗಳು ಕೋಟೆಯ ಮಧ್ಯಭಾಗವನ್ನು ಸುತ್ತುವರಿಯುತ್ತವೆ, ಸ್ಥಳೀಯವಾಗಿ ತೆಗೆದ ಕಪ್ಪು ಬಸಾಲ್ಟ್ ಕಲ್ಲಿನಿಂದ ನಿರ್ಮಿಸಲ್ಪಟ್ಟವು. ಈ ಗೋಡೆಗಳ ಮೇಲೆ ನಿಂತ ಸಿಪಾಯಿಗಳು ಡೆಕ್ಕನ್ ಪರಿಸರದಿಂದ ಬರುವ ಶತ್ರುಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡುತ್ತಿದ್ದರು.",
        image: null,
        audioDurationSeconds: 35,
      },
    ],
    challenges: [
      {
        id: "challenge-belgaum-gate",
        fortId: "belgaum",
        landmarkId: "belgaum-main-gate",
        titleEN: "Gateway Guardian",
        titleKN: "ದ್ವಾರ ಪಾಲಕ",
        descriptionEN: "Capture the imposing architecture of the Belgaum Fort main entrance.",
        descriptionKN: "ಬೆಳಗಾವಿ ಕೋಟೆಯ ಮುಖ್ಯ ಪ್ರವೇಶದ್ವಾರದ ಆಕರ್ಷಕ ವಾಸ್ತುಶಿಲ್ಪವನ್ನು ಛಾಯಾಚಿತ್ರ ತೆಗೆಯಿರಿ.",
      },
    ],
  }),
  fort({
    id: "bijapur",
    name: "Bijapur Citadel (Vijayapura)",
    subtitle: "Adil Shahi Power",
    description:
      "A Deccan Sultanate stronghold with monumental structures; the citadel area reflects the military heart of Bijapur’s historic core.",
    district: "Vijayapura",
    image: require("../../assets/images/fort_bijapur.jpg"),
    latitude: 16.8302,
    longitude: 75.71,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
    era: "16th – 17th Century",
    landmarks: [
      {
        id: "bijapur-citadel-walls",
        fortId: "bijapur",
        name: "Citadel Walls",
        subtitle: "Massive Defensive Structure",
        latitude: 16.83,
        longitude: 75.7095,
        storyEN:
          "The citadel walls of Bijapur represent the pinnacle of Adil Shahi military engineering. These walls, up to 15 meters thick in places, were designed to withstand cannon fire and prolonged sieges. The intricate masonry work showcases the skill of craftsmen who built this fortress during the height of the Deccan Sultanate's power.",
        storyKN:
          "ವಿಜಯಪುರದ ಕೋಟೆಯ ಗೋಡೆಗಳು ಅದಿಲ್ ಶಾಹಿ ಸೈನಿಕ ಎಂಜಿನಿಯರಿಂಗ್ನ ಶಿಖರವನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತವೆ. ಸ್ಥಳಗಳಲ್ಲಿ 15 ಮೀಟರ್ ದಪ್ಪವಿರುವ ಈ ಗೋಡೆಗಳು ಕಾಂಡಿನ ಬ.connect眼神 ಮತ್ತು ದೀರ್ಘ ಮುತ್ತಿಗೆಗಳನ್ನು ತಾಳಿಕೊಳ್ಳಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿತ್ತು.",
        image: null,
        audioDurationSeconds: 38,
      },
      {
        id: "bijapur-watchtower",
        fortId: "bijapur",
        name: "Ancient Watchtower",
        subtitle: "Vantage Point",
        latitude: 16.8308,
        longitude: 75.7105,
        storyEN:
          "This watchtower once served as the eyes of the citadel, with sentries scanning the horizon for approaching armies. From this height, one could see for miles across the Deccan plains, giving the defenders precious time to prepare for any attack. The tower's design reflects both functionality and the artistic sensibilities of the Adil Shahi period.",
        storyKN:
          "ಈ ಕಾವಲು ಗೋಪುರವು ಒಂದು ಕಾಲದಲ್ಲಿ ಕೋಟೆಯ ಕಣ್ಣಾಗಿ ಸೇವೆ ಸಲ್ಲಿಸುತ್ತಿತ್ತು, ಸೆಂಟ್ರಿಗಳು ಸಮೀಪಿಸುತ್ತಿರುವ ಸೈನ್ಯಗಳಿಗಾಗಿ ಕ್ಷಿತಿಜವನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡುತ್ತಿದ್ದರು. ಈ ಎತ್ತರದಿಂದ, ಡೆಕ್ಕನ್ ಸಮತಲಗಳು ಮೈಲಿಗಳವರೆಗೆ ಕಾಣಬಹುದಾಗಿತ್ತು.",
        image: null,
        audioDurationSeconds: 42,
      },
    ],
    challenges: [
      {
        id: "challenge-bijapur-walls",
        fortId: "bijapur",
        landmarkId: "bijapur-citadel-walls",
        titleEN: "Wall Watcher",
        titleKN: "ಗೋಡೆಯ ವೀಕ್ಷಕ",
        descriptionEN: "Photograph the intricate masonry details of the citadel walls.",
        descriptionKN: "ಕೋಟೆಯ ಗೋಡೆಗಳ ಸುಕ್ಷ್ಮ ಶಿಲ್ಪಕಲೆಯ ವಿವರಗಳನ್ನು ಛಾಯಾಚಿತ್ರ ತೆಗೆಯಿರಿ.",
      },
    ],
  }),
  fort({
    id: "srirangapatna",
    name: "Srirangapatna Fort",
    subtitle: "Tipu Sultan's Island Fortress",
    description:
      "A river-island fortification on the Kaveri, pivotal in Anglo–Mysore wars and remembered for Tipu Sultan's final stand.",
    district: "Mandya",
    image: require("../../assets/images/fort_srirangapatna.jpg"),
    latitude: 12.418,
    longitude: 76.6947,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
    era: "15th – 18th Century",
    landmarks: [
      {
        id: "srirangapatna-dungeon",
        fortId: "srirangapatna",
        name: "Colonel Bailey's Dungeon",
        subtitle: "Underground Prison",
        latitude: 12.4185,
        longitude: 76.694,
        storyEN:
          "These dark underground chambers once held British prisoners of war during Tipu Sultan's reign. Named after Colonel Bailey who died here, the dungeon showcases the harsh conditions of 18th-century warfare. The damp walls and narrow ventilation shafts tell tales of courage and suffering from a pivotal era in Indian history.",
        storyKN:
          "ಟಿಪ್ಪು ಸುಲ್ತಾನ್ ಆಳ್ವಿಕೆಯ ಸಮಯದಲ್ಲಿ ಈ ಇರುಳ ಕೊಠಡಿಗಳು ಬ್ರಿಟಿಷ್ ಯುದ್ಧ ಸೆರೆಯಾಳುಗಳನ್ನು ಹಿಡಿದಿಡುತ್ತಿದ್ದವು. ಕರ್ನಲ್ ಬೇಲಿಯವರು ಇಲ್ಲಿ ಮರಣ ಹೊಂದಿದ್ದಾರೆ ಎಂದು ಹೆಸರಿಸಲ್ಪಟ್ಟ ಈ ಕಾರಾಗೃಹವು 18ನೇ ಶತಮಾನದ ಯುದ್ಧದ ಕಠೋರ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಪ್ರದರ್ಶಿಸುತ್ತದೆ.",
        image: null,
        audioDurationSeconds: 45,
      },
      {
        id: "srirangapatna-gate",
        fortId: "srirangapatna",
        name: "Bangalore Gate",
        subtitle: "Main Fort Entrance",
        latitude: 12.4175,
        longitude: 76.6955,
        storyEN:
          "The Bangalore Gate stands as the principal entrance to this island fortress. Its sturdy construction reflects the military architecture perfected during the Mysore Sultanate. This gate witnessed the final assault of 1799 when British forces breached the fort, leading to the fall of Tipu Sultan and marking a turning point in Indian colonial history.",
        storyKN:
          "ಬೆಂಗಳೂರು ದ್ವಾರವು ಈ ದ್ವೀಪ ಕೋಟೆಯ ಮುಖ್ಯ ಪ್ರವೇಶದ್ವಾರವಾಗಿ ನಿಂತಿದೆ. ಮೈಸೂರು ಸುಲ್ತಾನೇಟ್ ಸಮಯದಲ್ಲಿ ಪರಿಪೂರ್ಣಗೊಂಡ ಸೈನಿಕ ವಾಸ್ತುಶಿಲ್ಪವನ್ನು ಇದರ ದೃಢ ನಿರ್ಮಾಣ ಪ್ರತಿಬಿಂಬಿಸುತ್ತದೆ. 1799ರಲ್ಲಿ ಬ್ರಿಟಿಷ್ ಪಡೆಗಳು ಈ ಕೋಟೆಯನ್ನು ಒಳಗೊಂಡ ಪ್ರಯತ್ನವನ್ನು ಈ ದ್ವಾರ ನೋಡಿದೆ.",
        image: null,
        audioDurationSeconds: 48,
      },
    ],
    challenges: [
      {
        id: "challenge-srirangapatna-dungeon",
        fortId: "srirangapatna",
        landmarkId: "srirangapatna-dungeon",
        titleEN: "Dungeon Explorer",
        titleKN: "ಕಾರಾಗೃಹ ಅನ್ವೇಷಕ",
        descriptionEN: "Photograph the atmospheric entrance to Colonel Bailey's Dungeon.",
        descriptionKN: "ಕರ್ನಲ್ ಬೇಲಿಯ ಕಾರಾಗೃಹದ ವಾತಾವರಣದ ಪ್ರವೇಶದ್ವಾರವನ್ನು ಛಾಯಾಚಿತ್ರ ತೆಗೆಯಿರಿ.",
      },
    ],
  }),
  fort({
    id: "madhugiri",
    name: "Madhugiri Fort",
    subtitle: "Monolithic Hill Fortress",
    description:
      "A dramatic granite monolith with steep climbs and strong ramparts; one of Karnataka's iconic hill forts.",
    district: "Tumakuru",
    image: require("../../assets/images/fort_madhugiri.jpg"),
    latitude: 13.6603,
    longitude: 77.2097,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
    era: "17th – 18th Century",
    landmarks: [
      {
        id: "madhugiri-summit",
        fortId: "madhugiri",
        name: "Madhugiri Summit",
        subtitle: "Peak of the Monolith",
        latitude: 13.6605,
        longitude: 77.21,
        storyEN:
          "Standing atop the Madhugiri monolith, you are on one of Asia's largest single-rock formations. The Vijayanagara rulers and later Hyder Ali recognized this massive granite dome as a natural fortress. The climb to this summit rewards you with panoramic views of the Deccan plateau stretching to the horizon. At sunset, the rock glows golden, giving the fort its name - Madhugiri, meaning Honey Hill.",
        storyKN:
          "ಮಧುಗಿರಿ ಏಕಶಿಲೆಯ ಮೇಲೆ ನಿಂತಿರುವ ನೀವು ಏಷ್ಯಾದ ಅತಿದೊಡ್ಡ ಏಕಕಲ್ಲಿನ ನಿರ್ಮಾಣಗಳಲ್ಲಿ ಒಂದರ ಮೇಲೆ ಇದ್ದೀರಿ. ವಿಜಯನಗರ ಆಡಳಿತಗಾರರು ಮತ್ತು ನಂತರ ಹೈದರ್ ಅಲಿ ಈ ಸಶಕ್ತ ಗ್ರಾನೈಟ್ ಗುಂಡುಗಳನ್ನು ಸ್ವಾಭಾವಿಕ ಕೋಟೆಯಾಗಿ ಗುರುತಿಸಿದರು.",
        image: null,
        audioDurationSeconds: 50,
      },
      {
        id: "madhugiri-fort-entrance",
        fortId: "madhugiri",
        name: "Fort Base Entrance",
        subtitle: "Gateway to the Monolith",
        latitude: 13.6598,
        longitude: 77.2092,
        storyEN:
          "The entrance to Madhugiri Fort marks the beginning of a challenging ascent up the monolithic rock face. The original path was designed to slow down invaders while allowing defenders to rain stones and arrows from above. Today, this entrance welcomes trekkers seeking adventure and history enthusiasts tracing the footsteps of Vijayanagara soldiers who once defended this impregnable position.",
        storyKN:
          "ಮಧುಗಿರಿ ಕೋಟೆಯ ಪ್ರವೇಶದ್ವಾರವು ಏಕಶಿಲೆಯ ಮೇಲ್ಭಾಗದವರೆಗಿನ ಕಠಿಣ ಏರಿಕೆಯ ಆರಂಭವನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಮೂಲ ಮಾರ್ಗವು ಆಕ್ರಮಣಕಾರರನ್ನು ನಿಧಾನಗೊಳಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿತ್ತು.",
        image: null,
        audioDurationSeconds: 45,
      },
    ],
    challenges: [
      {
        id: "challenge-madhugiri-summit",
        fortId: "madhugiri",
        landmarkId: "madhugiri-summit",
        titleEN: "Peak Conqueror",
        titleKN: "ಶಿಖರ ವಿಜೇತ",
        descriptionEN: "Take a photo from the summit showing the panoramic view.",
        descriptionKN: "ಪ್ಯಾನೊರಮಿಕ್ ದೃಶ್ಯವನ್ನು ತೋರಿಸುವ ಶಿಖರದಿಂದ ಫೋಟೋ ತೆಗೆಯಿರಿ.",
      },
    ],
  }),
  fort({
    id: "bangalore",
    name: "Bengaluru Fort",
    subtitle: "Kempe Gowda's Foundation",
    description:
      "Originally built as a mud fort and later rebuilt in stone; fragments survive near the historic heart of Bengaluru.",
    district: "Bengaluru Urban",
    image: require("../../assets/images/fort_bangalore.jpg"),
    latitude: 12.9629,
    longitude: 77.5775,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
    era: "16th – 18th Century",
    landmarks: [
      {
        id: "bangalore-darwaza",
        fortId: "bangalore",
        name: "Delhi Gate",
        subtitle: "Preserved Fort Entrance",
        latitude: 12.9632,
        longitude: 77.5778,
        storyEN:
          "The Delhi Gate is one of the few surviving structures of Kempe Gowda's original Bengaluru Fort. Built in 1537, this gate once formed part of a mud fort that protected a small trading settlement. Though much of the fort has vanished under modern development, this gate stands as a tangible link to the city's founding era and its transformation into a global technology hub.",
        storyKN:
          "ದೆಹಲಿ ದ್ವಾರವು ಕೆಂಪೇಗೌಡರ ಮೂಲ ಬೆಂಗಳೂರು ಕೋಟೆಯ ಉಳಿದಿರುವ ಕೆಲವು ಕಟ್ಟಡಗಳಲ್ಲಿ ಒಂದು. 1537ರಲ್ಲಿ ನಿರ್ಮಿಸಲ್ಪಟ್ಟ ಈ ದ್ವಾರವು ಒಂದು ಸಣ್ಣ ವ್ಯಾಪಾರಿ ಸಂಸ್ಥೆಯನ್ನು ರಕ್ಷಿಸಿದ ಮಣ್ಣಿನ ಕೋಟೆಯ ಭಾಗವಾಗಿತ್ತು.",
        image: null,
        audioDurationSeconds: 42,
      },
      {
        id: "bangalore-ganesh-temple",
        fortId: "bangalore",
        name: "Fort Ganesh Temple",
        subtitle: "Ancient Shrine within Fort",
        latitude: 12.9626,
        longitude: 77.5772,
        storyEN:
          "This ancient Ganesh temple has witnessed the transformation of Bengaluru from a medieval trading post to a modern metropolis. Located within the original fort boundaries, it served as a spiritual center for the fort's inhabitants and continues to be worshipped at today. The temple represents the enduring cultural continuity that persists even as the city changes around it.",
        storyKN:
          "ಈ ಪ್ರಾಚೀನ ಗಣೇಶ ದೇವಾಲಯವು ಬೆಂಗಳೂರನ್ನು ಮಧ್ಯಯುಗೀಯ ವ್ಯಾಪಾರಿ ಕೇಂದ್ರದಿಂದ ಆಧುನಿಕ ಮಹಾನಗರಕ್ಕೆ ಪರಿವರ್ತನೆಯನ್ನು ಸಾಕ್ಷಿಯಾಗಿದೆ. ಮೂಲ ಕೋಟೆಯ ಎಲೆಗಳೊಳಗೆ സ്ഥിതി ചെയ്യുന്ന ಈ ದೇವಾಲಯವು ಕೋಟೆಯ ನಿವಾಸಿಗಳ ಆಧ್ಯಾತ್ಮಿಕ ಕೇಂದ್ರವಾಗಿ ಸೇವೆ ಸಲ್ಲಿಸುತ್ತಿತ್ತು.",
        image: null,
        audioDurationSeconds: 38,
      },
    ],
    challenges: [
      {
        id: "challenge-bangalore-gate",
        fortId: "bangalore",
        landmarkId: "bangalore-darwaza",
        titleEN: "Gatekeeper",
        titleKN: "ದ್ವಾರ ಪಾಲಕ",
        descriptionEN: "Capture the historic Delhi Gate of Bengaluru Fort.",
        descriptionKN: "ಬೆಂಗಳೂರು ಕೋಟೆಯ ಐತಿಹಾಸಿಕ ದೆಹಲಿ ದ್ವಾರವನ್ನು ಛಾಯಾಚಿತ್ರ ತೆಗೆಯಿರಿ.",
      },
    ],
  }),
  fort({
    id: "mirjan",
    name: "Mirjan Fort",
    subtitle: "Laterite Fort by the Coast",
    description:
      "A striking laterite fort near Kumta, associated with trade routes and coastal power struggles; known for its moats and gateways.",
    district: "Uttara Kannada",
    image: require("../../assets/images/fort_mirjan.jpg"),
    latitude: 14.4157,
    longitude: 74.4205,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
    era: "16th – 18th Century",
  }),
  fort({
    id: "sadalga",
    name: "Sadalga Fort",
    subtitle: "Frontier Fortifications",
    description:
      "A historic fort region near the northern border; a good candidate for community-sourced photos and stories.",
    district: "Belagavi",
    image: require("../../assets/images/fort_sadalga.jpg"),
    latitude: 16.5503,
    longitude: 74.5382,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
    era: "Medieval – Early Modern",
  }),
];

