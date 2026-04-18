import type { Tile } from "./tiles";

export type BetDirection = "higher" | "lower";

export interface HistoryEntry {
  tiles: Tile[];
  total: number;
  bet: BetDirection;
  won: boolean;
}

export interface GameState {
  drawPile: Tile[];
  discardPile: Tile[];
  reshuffleCount: number;
  currentHand: Tile[];
  // Dynamic values per typeKey. Number tiles are not tracked here;
  // their value is the face value parsed from the typeKey.
  tileValues: Record<string, number>;
  score: number;
  history: HistoryEntry[];
  isGameOver: boolean;
  gameOverReason: string | null;
}