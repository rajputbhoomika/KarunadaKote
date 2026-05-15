import Constants from "expo-constants";
import { Platform } from "react-native";

function stripProtocol(hostOrUrl: string): string {
  const trimmed = hostOrUrl.trim();
  return trimmed.replace(/^https?:\/\//i, "");
}

function getMetroHost(): string | null {
  const hostUri =
    // Expo SDK versions expose different shapes.
    (Constants as any)?.expoConfig?.hostUri ??
    (Constants as any)?.expoGoConfig?.debuggerHost ??
    (Constants as any)?.manifest2?.extra?.expoGo?.debuggerHost ??
    (Constants as any)?.manifest?.debuggerHost;

  if (typeof hostUri !== "string" || hostUri.trim() === "") return null;

  const hostPort = stripProtocol(hostUri).split("/")[0];
  const host = hostPort.split(":")[0];
  return host || null;
}

export function getDefaultApiBaseUrl(): string | null {
  const env = process.env.EXPO_PUBLIC_API_URL;
  if (typeof env === "string" && env.trim() !== "") {
    return env.trim().replace(/\/+$/, "");
  }

  if (Platform.OS === "web" && typeof window !== "undefined") {
    return window.location.origin;
  }

  const host = getMetroHost();
  if (!host) return null;

  return `http://${host}:3000`;
}

