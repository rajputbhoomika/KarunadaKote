export interface Landmark {
  id: string;
  fortId: string;
  name: string;
  subtitle: string;
  latitude: number;
  longitude: number;
  storyEN: string;
  storyKN: string;
  image: number | null;
  audioDurationSeconds: number;
}

export interface PhotoChallenge {
  id: string;
  fortId: string;
  landmarkId: string;
  titleEN: string;
  titleKN: string;
  descriptionEN: string;
  descriptionKN: string;
}

export interface Fort {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  /** Karnataka district name for regional filtering (e.g. Ballari, Vijayanagara). */
  district: string;
  image: number;
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
  era: string;
  landmarks: Landmark[];
  challenges: PhotoChallenge[];
}

import { bidarFort } from "./forts/bidar";
import { curatedKarnatakaForts, featuredFortsFirst } from "./forts/catalog";
import { chitradurgaFort } from "./forts/chitradurga";

export const FORTS: Fort[] = [
  ...featuredFortsFirst,
  chitradurgaFort,
  bidarFort,
  ...curatedKarnatakaForts,
];

export function getFortById(id: string): Fort | undefined {
  return FORTS.find((f) => f.id === id);
}

export function getLandmarkById(
  fortId: string,
  landmarkId: string
): Landmark | undefined {
  const fort = getFortById(fortId);
  return fort?.landmarks.find((l) => l.id === landmarkId);
}

export function getChallengeById(
  fortId: string,
  challengeId: string
): PhotoChallenge | undefined {
  const fort = getFortById(fortId);
  return fort?.challenges.find((c) => c.id === challengeId);
}
