export type TileCategory = "number" | "dragon" | "wind";
export type NumberSuit = "bamboo" | "circles" | "characters";
export type DragonType = "red" | "green" | "white";
export type WindType = "east" | "south" | "west" | "north";

export interface Tile {
  id: string;
  category: TileCategory;
  // All copies of the same tile share a typeKey, e.g. "dragon-red".
  // Dynamic values are tracked per typeKey, not per copy.
  typeKey: string;
  label: string;
}

export const BASE_NON_NUMBER_VALUE = 5;
export const MIN_TILE_VALUE = 0;
export const MAX_TILE_VALUE = 10;
export const MAX_RESHUFFLES = 3;
export const HAND_SIZE = 2;