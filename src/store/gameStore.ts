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

    const next = placeBet(current, direction);

    // If the bet ended the game, persist the score immediately
    if (next.isGameOver && !current.isGameOver) {
      const updated = saveScore(next.score);
      set({ game: next, leaderboard: updated });
      return;
    }

    set({ game: next });
  },

  exitToLanding: () => {
    set({ game: null });
  },
}));