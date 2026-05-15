import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getFortById } from "@/constants/fortData";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

interface PhotoItem {
  id: string;
  imageUrl: string;
  caption?: string;
  tags: string[];
}

interface PhotosResponse {
  items: PhotoItem[];
  nextCursor: string | null;
}

// Mock functions for standalone deployment (workspace dependency not available)
function getListFortPhotosQueryKey(id: string, params: any) {
  return ["/api/forts", id, "photos", params];
}

function useListFortPhotos(id: string, params: any, options: any) {
  return {
    queryKey: getListFortPhotosQueryKey(id, params),
    data: { items: [] as PhotoItem[], nextCursor: null },
    isLoading: false,
    isError: false,
  };
}

async function listFortPhotos(id: string, params: any): Promise<PhotosResponse> {
  return { items: [], nextCursor: null };
}

function resolveUrl(baseUrl: string | null, imageUrl: string) {
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (!baseUrl) return imageUrl;
  return `${baseUrl.replace(/\/+$/, "")}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

export default function FortPhotosScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const auth = useAuth();
  const queryClient = useQueryClient();

  const fort = getFortById(id);
  const [tag, setTag] = useState("");
  const [landmarkId, setLandmarkId] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [caption, setCaption] = useState("");

  const params = useMemo(
    () => ({
      tag: tag.trim() || undefined,
      landmarkId,
      limit: 50,
    }),
    [tag, landmarkId],
  );

  const photosQuery = useListFortPhotos(id, params, {
    query: {
      queryKey: getListFortPhotosQueryKey(id, params),
      enabled: auth.isReady && !!auth.baseUrl,
    },
  });

  async function handlePickAndUpload() {
    if (!auth.token) {
      Alert.alert("Sign-in required", "Auth token missing. Check API server and JWT_SECRET.");
      return;
    }
    if (!auth.baseUrl) {
      Alert.alert(
        "API base URL missing",
        "Set EXPO_PUBLIC_API_URL or run with a reachable API server.",
      );
      return;
    }

    setUploading(true);
    try {
      const perm =
        Platform.OS === "web"
          ? { granted: true }
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!perm.granted) {
        Alert.alert("Permission required", "Allow gallery access to upload photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.85,
        allowsEditing: true,
      });

      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];

      const uri = asset.uri;
      const name = uri.split("/").pop() || `upload_${Date.now()}.jpg`;
      const type = asset.mimeType || "image/jpeg";

      const form = new FormData();
      form.append("image", { uri, name, type } as any);
      if (caption.trim()) form.append("caption", caption.trim());
      if (landmarkId) form.append("landmarkId", landmarkId);
      if (tagsInput.trim()) form.append("tags", tagsInput.trim());

      const res = await fetch(`${auth.baseUrl}/api/forts/${id}/photos`, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.token}` },
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      setCaption("");
      setTagsInput("");

      await queryClient.invalidateQueries({
        queryKey: ["/api/forts/" + id + "/photos"],
      });
    } catch (e: any) {
      Alert.alert("Upload failed", e?.message ?? "Unknown error");
    } finally {
      setUploading(false);
    }
  }

  async function handleLoadMore() {
    if (!photosQuery.data?.nextCursor) return;
    const next = await listFortPhotos(id, { ...params, cursor: photosQuery.data.nextCursor });
    queryClient.setQueryData(photosQuery.queryKey, (prev: any) => {
      if (!prev) return next;
      return {
        items: [...prev.items, ...next.items],
        nextCursor: next.nextCursor,
      };
    });
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 12),
      paddingHorizontal: 16,
      paddingBottom: 12,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 10,
    },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      flex: 1,
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    uploadBtn: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 10,
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    uploadBtnText: {
      color: colors.primaryForeground,
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
    },
    filterRow: { flexDirection: "row", gap: 10, alignItems: "center" },
    input: {
      flex: 1,
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
    },
    smallInput: {
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
    },
    card: {
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: colors.radius + 2,
      overflow: "hidden",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    photo: { width: "100%", height: 220 },
    meta: { padding: 12, gap: 6 },
    metaRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
    chip: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: colors.muted,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chipText: { fontSize: 12, color: colors.foreground, fontFamily: "Inter_500Medium" },
    caption: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    empty: { padding: 24, alignItems: "center", gap: 8 },
    emptyText: { color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    footerSpace: { height: insets.bottom + (Platform.OS === "web" ? 34 : 16) },
  });

  if (!fort) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Fort not found</Text>
      </View>
    );
  }

  const items = photosQuery.data?.items ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={18} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            Community Photos — {fort.name}
          </Text>
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={handlePickAndUpload}
            disabled={uploading}
            activeOpacity={0.85}
          >
            <Feather name="upload" size={16} color={colors.primaryForeground} />
            <Text style={styles.uploadBtnText}>{uploading ? "Uploading…" : "Upload"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <TextInput
            placeholder="Filter tag (e.g. sunrise)"
            placeholderTextColor={colors.mutedForeground}
            value={tag}
            onChangeText={setTag}
            style={styles.input}
          />
        </View>

        <View style={styles.filterRow}>
          <TextInput
            placeholder="Upload tags (comma-separated)"
            placeholderTextColor={colors.mutedForeground}
            value={tagsInput}
            onChangeText={setTagsInput}
            style={styles.input}
          />
        </View>

        <View style={styles.filterRow}>
          <TextInput
            placeholder="Caption (optional)"
            placeholderTextColor={colors.mutedForeground}
            value={caption}
            onChangeText={setCaption}
            style={styles.input}
          />
          <TextInput
            placeholder="LandmarkId"
            placeholderTextColor={colors.mutedForeground}
            value={landmarkId ?? ""}
            onChangeText={(v) => setLandmarkId(v.trim() ? v.trim() : undefined)}
            style={[styles.smallInput, { width: 120 }]}
          />
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        onEndReached={() => {
          void handleLoadMore();
        }}
        onEndReachedThreshold={0.4}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: resolveUrl(auth.baseUrl, item.imageUrl) }}
              style={styles.photo}
              contentFit="cover"
            />
            <View style={styles.meta}>
              {item.caption ? <Text style={styles.caption}>{item.caption}</Text> : null}
              <View style={styles.metaRow}>
                {item.tags.slice(0, 8).map((t: string) => (
                  <View key={t} style={styles.chip}>
                    <Text style={styles.chipText}>#{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          photosQuery.isLoading ? null : (
            <View style={styles.empty}>
              <Feather name="image" size={18} color={colors.mutedForeground} />
              <Text style={styles.emptyText}>
                No community photos yet. Upload the first one.
              </Text>
            </View>
          )
        }
        ListFooterComponent={<View style={styles.footerSpace} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

