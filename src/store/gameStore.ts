import { create } from "zustand";
import type { BetDirection, GameState } from "../engine/state";
import { createNewGame, placeBet } from "../engine/game";
import {
  loadLeaderboard,
  saveScore,
  type LeaderboardEntry,
} from "./leaderboard";

interface GameStore {
  game: GameState | null;
  leaderboard: LeaderboardEntry[];

  startNewGame: () => void;
  bet: (direction: BetDirection) => void;
  saveCurrentScore: (name: string) => void;
  exitToLanding: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  game: null,
  leaderboard: loadLeaderboard(),

  startNewGame: () => {
    set({ game: createNewGame() });
  },

  bet: (direction) => {
    const current = get().game;
    if (!current) return;
    set({ game: placeBet(current, direction) });
  },

  saveCurrentScore: (name) => {
    const current = get().game;
    if (!current || !current.isGameOver) return;
    const updated = saveScore(name, current.score);
    set({ leaderboard: updated });
  },

  exitToLanding: () => {
    set({ game: null });
  },
}));