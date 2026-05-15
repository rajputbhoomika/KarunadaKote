import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { FORTS } from "@/constants/fortData";

interface ProgressContextType {
  visitedLandmarks: Set<string>;
  completedChallenges: Record<string, string>;
  markLandmarkVisited: (landmarkId: string) => void;
  completeChallenge: (challengeId: string, photoUri: string) => void;
  getFortProgress: (fortId: string) => {
    visited: number;
    total: number;
    percentage: number;
  };
  isLoaded: boolean;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

const STORAGE_KEY_LANDMARKS = "@karunada_visited_landmarks";
const STORAGE_KEY_CHALLENGES = "@karunada_completed_challenges";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [visitedLandmarks, setVisitedLandmarks] = useState<Set<string>>(
    new Set()
  );
  const [completedChallenges, setCompletedChallenges] = useState<
    Record<string, string>
  >({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [landmarks, challenges] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_LANDMARKS),
          AsyncStorage.getItem(STORAGE_KEY_CHALLENGES),
        ]);
        if (landmarks) {
          const arr: string[] = JSON.parse(landmarks);
          setVisitedLandmarks(new Set(arr));
        }
        if (challenges) {
          setCompletedChallenges(JSON.parse(challenges));
        }
      } catch {
        // ignore storage errors
      } finally {
        setIsLoaded(true);
      }
    }
    load();
  }, []);

  const markLandmarkVisited = useCallback(
    async (landmarkId: string) => {
      setVisitedLandmarks((prev) => {
        const next = new Set(prev);
        next.add(landmarkId);
        AsyncStorage.setItem(
          STORAGE_KEY_LANDMARKS,
          JSON.stringify([...next])
        ).catch(() => {});
        return next;
      });
    },
    []
  );

  const completeChallenge = useCallback(
    async (challengeId: string, photoUri: string) => {
      setCompletedChallenges((prev) => {
        const next = { ...prev, [challengeId]: photoUri };
        AsyncStorage.setItem(
          STORAGE_KEY_CHALLENGES,
          JSON.stringify(next)
        ).catch(() => {});
        return next;
      });
    },
    []
  );

  const getFortProgress = useCallback(
    (fortId: string) => {
      const fort = FORTS.find((f) => f.id === fortId);
      if (!fort) return { visited: 0, total: 0, percentage: 0 };
      const total = fort.landmarks.length;
      const visited = fort.landmarks.filter((l) =>
        visitedLandmarks.has(l.id)
      ).length;
      const percentage = total > 0 ? Math.round((visited / total) * 100) : 0;
      return { visited, total, percentage };
    },
    [visitedLandmarks]
  );

  return (
    <ProgressContext.Provider
      value={{
        visitedLandmarks,
        completedChallenges,
        markLandmarkVisited,
        completeChallenge,
        getFortProgress,
        isLoaded,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
