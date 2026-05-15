import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getDefaultApiBaseUrl } from "@/lib/apiBaseUrl";

// Try to import workspace dependencies, handle gracefully if not available
let apiClient: any = null;
try {
  apiClient = require("@workspace/api-client-react");
} catch (e) {
  console.log("Workspace API client not available - running in standalone mode");
}

type AuthState = {
  isReady: boolean;
  baseUrl: string | null;
  token: string | null;
  userId: string | null;
};

const STORAGE_DEVICE_ID = "@karunada_device_id";
const STORAGE_TOKEN = "@karunada_access_token";
const STORAGE_USER_ID = "@karunada_user_id";

const AuthContext = createContext<AuthState | null>(null);

function randomId(): string {
  const g: any = globalThis as any;
  if (g?.crypto?.randomUUID) return g.crypto.randomUUID();
  return `dev_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isReady: false,
    baseUrl: null,
    token: null,
    userId: null,
  });

  useEffect(() => {
    let mounted = true;

    async function init() {
      const baseUrl = getDefaultApiBaseUrl();
      
      // Only set baseUrl if api client is available
      if (apiClient?.setBaseUrl) {
        apiClient.setBaseUrl(baseUrl);
      }

      const [storedDeviceId, storedToken, storedUserId] = await Promise.all([
        AsyncStorage.getItem(STORAGE_DEVICE_ID),
        AsyncStorage.getItem(STORAGE_TOKEN),
        AsyncStorage.getItem(STORAGE_USER_ID),
      ]);

      const deviceId = storedDeviceId ?? randomId();
      if (!storedDeviceId) {
        await AsyncStorage.setItem(STORAGE_DEVICE_ID, deviceId);
      }

      // Always re-auth once per launch to ensure token/user are valid and in sync.
      let auth: any = null;
      try {
        if (apiClient?.authDevice) {
          auth = await apiClient.authDevice({ deviceId });
          await Promise.all([
            AsyncStorage.setItem(STORAGE_TOKEN, auth.token),
            AsyncStorage.setItem(STORAGE_USER_ID, auth.user.id),
          ]);
        } else {
          // Standalone mode: use stored values
          auth = storedToken && storedUserId ? { token: storedToken, user: { id: storedUserId } } : null;
        }
      } catch {
        // Keep stored token if server is unreachable.
        auth = storedToken && storedUserId ? { token: storedToken, user: { id: storedUserId } } : null;
      }

      const token = auth?.token ?? null;
      const userId = auth?.user?.id ?? storedUserId ?? null;

      // Configure generated API client to attach bearer tokens.
      if (apiClient?.setAuthTokenGetter) {
        apiClient.setAuthTokenGetter(() => token);
      }

      if (!mounted) return;
      setState({ isReady: true, baseUrl, token, userId });
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(() => state, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

