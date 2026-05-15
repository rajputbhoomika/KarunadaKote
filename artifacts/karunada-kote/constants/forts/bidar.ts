import type { Fort } from "../fortData";

export const bidarFort: Fort = {
  id: "bidar",
  name: "Bidar Fort",
  subtitle: "The Bahmani Capital",
  description:
    "Once the glorious capital of the Bahmani Sultanate, Bidar Fort is one of India's finest examples of Persian-influenced medieval architecture. Its vast moat, massive walls, and ornate palaces reveal a city that was once the cultural heart of the Deccan.",
  district: "Bidar",
  image: require("../../assets/images/bidar_fort.png"),
  latitude: 17.9141,
  longitude: 77.523,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
  era: "14th – 16th Century",
  landmarks: [
    {
      id: "rangin-mahal",
      fortId: "bidar",
      name: "Rangin Mahal",
      subtitle: "The Colourful Palace",
      latitude: 17.9145,
      longitude: 77.5225,
      storyEN:
        "Rangin Mahal — the Palace of Colours — was built by Ali Barid Shah and stands as one of the finest examples of the Bidar Sultanate's artistic achievement. Every wall surface is adorned with mother-of-pearl inlay work, intricate tile mosaics in turquoise and cobalt, and carved wooden panels of extraordinary delicacy. The name 'Rangin' meaning colourful is no exaggeration — in its heyday, this palace shimmered with reflected light like a jewel box. The Bidar school of bidriware metalwork, still practiced today, was born in the workshops surrounding this palace.",
      storyKN:
        "ರಂಗೀನ್ ಮಹಲ್ — ಬಣ್ಣಗಳ ಅರಮನೆ — ಅಲಿ ಬರೀದ್ ಶಾಹ್ ನಿರ್ಮಿಸಿದ ಬೀದರ್ ಸುಲ್ತಾನೇಟ್‌ನ ಕಲಾಕೌಶಲ್ಯದ ಅತ್ಯುತ್ತಮ ಮಾದರಿ. ಇಲ್ಲಿ ಮದರ್-ಆಫ್-ಪರ್ಲ್ ಜಡಿತ ಕೆಲಸ ಮತ್ತು ಸೂಕ್ಷ್ಮ ಟೈಲ್ ಮೊಸಾಯಿಕ್ ಕೆಲಸಗಳು ಇಂದಿಗೂ ಮನಮೋಹಕವಾಗಿ ಕಾಣಿಸುತ್ತವೆ.",
      image: null,
      audioDurationSeconds: 55,
    },
    {
      id: "solah-khamba",
      fortId: "bidar",
      name: "Solah Khamba Mosque",
      subtitle: "Mosque of Sixteen Pillars",
      latitude: 17.9138,
      longitude: 77.5235,
      storyEN:
        "The Solah Khamba — meaning Sixteen Pillars — is the oldest mosque within Bidar Fort, built during the reign of Ahmad Shah Bahmani in the 15th century. Its sixteen massive stone columns support a grand hypostyle hall that could accommodate thousands of worshippers. The geometric patterns on its stone screens and the calligraphic inscriptions around its mihrabs reveal a civilization that valued both beauty and scholarship. Scholars, traders, and poets from Persia, Turkey, and Arabia gathered here, making Bidar a cosmopolitan center centuries before the concept was invented.",
      storyKN:
        "ಸೋಳ ಖಂಬ — ಹದಿನಾರು ಕಂಬಗಳ ಮಸೀದಿ — ಬೀದರ್ ಕೋಟೆಯಲ್ಲಿರುವ ಅತ್ಯಂತ ಪ್ರಾಚೀನ ಮಸೀದಿ. 15ನೇ ಶತಮಾನದಲ್ಲಿ ನಿರ್ಮಿಸಲ್ಪಟ್ಟ ಈ ಮಸೀದಿ ಪರ್ಷಿಯಾ, ತುರ್ಕಿ ಮತ್ತು ಅರೇಬಿಯಾದ ವಿದ್ವಾಂಸರ ಕೇಂದ್ರವಾಗಿತ್ತು.",
      image: null,
      audioDurationSeconds: 50,
    },
    {
      id: "royal-baths",
      fortId: "bidar",
      name: "Royal Hammam",
      subtitle: "The Sultan's Bathhouse",
      latitude: 17.9142,
      longitude: 77.5228,
      storyEN:
        "Beneath the earth of Bidar Fort lies an underground marvel — the Royal Hammam or bathhouse, a sophisticated Persian-style thermal bath that served the Bahmani sultans. Hot water was circulated through terracotta pipes beneath the floor, warming the marble surfaces above. The domed ceilings were studded with glass to diffuse soft coloured light into the steam below. This was not merely a place of hygiene — it was a place of ritual, relaxation, and political negotiation. Many of the Deccan's most consequential decisions were made in the warmth and privacy of this extraordinary space.",
      storyKN:
        "ಬೀದರ್ ಕೋಟೆಯ ಭೂಮಿಯಡಿ ಅಡಗಿದ ಅದ್ಭುತ — ರಾಜಮನೆತನದ ಹಮ್ಮಾಮ್. ಪರ್ಷಿಯನ್ ಶೈಲಿಯ ಉಷ್ಣ ಸ್ನಾನಗೃಹ. ಇಲ್ಲಿ ಡೆಕ್ಕನ್‌ನ ಅನೇಕ ಮಹತ್ವಪೂರ್ಣ ನಿರ್ಧಾರಗಳು ತೆಗೆದುಕೊಳ್ಳಲ್ಪಟ್ಟಿದ್ದವು.",
      image: null,
      audioDurationSeconds: 45,
    },
  ],
  challenges: [
    {
      id: "challenge-rangin",
      fortId: "bidar",
      landmarkId: "rangin-mahal",
      titleEN: "Palace of Colours",
      titleKN: "ಬಣ್ಣಗಳ ಅರಮನೆ",
      descriptionEN:
        "Capture the mother-of-pearl inlay or tile mosaic detail inside Rangin Mahal.",
      descriptionKN:
        "ರಂಗೀನ್ ಮಹಲ್‌ನಲ್ಲಿ ಮದರ್-ಆಫ್-ಪರ್ಲ್ ಜಡಿತ ಅಥವಾ ಟೈಲ್ ಮೊಸಾಯಿಕ್ ವಿವರವನ್ನು ಛಾಯಾಚಿತ್ರ ತೆಗೆಯಿರಿ.",
    },
  ],
};

