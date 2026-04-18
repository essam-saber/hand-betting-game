// === Tile categories ===
// A Mahjong tile belongs to one of these categories.
export type TileCategory = "number" | "dragon" | "wind";

// === Number tile suits ===
// Number tiles come in three suits, each with values 1-9.
export type NumberSuit = "bamboo" | "circles" | "characters";

// === Dragon tile types ===
export type DragonType = "red" | "green" | "white";

// === Wind tile types ===
export type WindType = "east" | "south" | "west" | "north";

// === The Tile object ===
// Every tile in the game has these properties.
export interface Tile {
  id: string;          // unique id for React keys (e.g. "bamboo-5-0")
  category: TileCategory;
  // typeKey: a string that identifies the TYPE of the tile.
  // All tiles of the same type share the same value (per our design decision).
  // Examples: "bamboo-5", "dragon-red", "wind-east"
  typeKey: string;
  label: string;       // human-readable label for the UI (e.g. "5 Bamboo", "Red Dragon")
}

// === Constants ===
export const BASE_NON_NUMBER_VALUE = 5;       // Dragons and Winds start at 5
export const MIN_TILE_VALUE = 0;              // game over if value reaches 0
export const MAX_TILE_VALUE = 10;             // game over if value reaches 10
export const MAX_RESHUFFLES = 3;              // game over after 3rd reshuffle
export const HAND_SIZE = 2;                   // 2 tiles per hand