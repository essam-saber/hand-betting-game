import { describe, it, expect } from "vitest";
import { createNewGame, getTileValue, placeBet, sumHand } from "../game";
import {
  BASE_NON_NUMBER_VALUE,
  HAND_SIZE,
  MAX_RESHUFFLES,
  MAX_TILE_VALUE,
  MIN_TILE_VALUE,
} from "../tiles";
import type { Tile } from "../tiles";
import type { GameState } from "../state";

function numberTile(suit: string, value: number, copy = 0): Tile {
  return {
    id: `${suit}-${value}-${copy}`,
    category: "number",
    typeKey: `${suit}-${value}`,
    label: `${value} ${suit}`,
  };
}

function dragonTile(color: string, copy = 0): Tile {
  return {
    id: `dragon-${color}-${copy}`,
    category: "dragon",
    typeKey: `dragon-${color}`,
    label: `${color} dragon`,
  };
}

function windTile(dir: string, copy = 0): Tile {
  return {
    id: `wind-${dir}-${copy}`,
    category: "wind",
    typeKey: `wind-${dir}`,
    label: `${dir} wind`,
  };
}

function defaultTileValues(): Record<string, number> {
  return {
    "dragon-red": BASE_NON_NUMBER_VALUE,
    "dragon-green": BASE_NON_NUMBER_VALUE,
    "dragon-white": BASE_NON_NUMBER_VALUE,
    "wind-east": BASE_NON_NUMBER_VALUE,
    "wind-south": BASE_NON_NUMBER_VALUE,
    "wind-west": BASE_NON_NUMBER_VALUE,
    "wind-north": BASE_NON_NUMBER_VALUE,
  };
}

function baseState(overrides: Partial<GameState> = {}): GameState {
  return {
    drawPile: [],
    discardPile: [],
    reshuffleCount: 0,
    currentHand: [],
    tileValues: defaultTileValues(),
    score: 0,
    history: [],
    isGameOver: false,
    gameOverReason: null,
    ...overrides,
  };
}

describe("getTileValue", () => {
  it("returns face value for number tiles", () => {
    expect(getTileValue(numberTile("bamboo", 7), {})).toBe(7);
  });

  it("returns the mapped value for dragons", () => {
    expect(getTileValue(dragonTile("red"), { "dragon-red": 3 })).toBe(3);
  });

  it("returns the mapped value for winds", () => {
    expect(getTileValue(windTile("east"), { "wind-east": 8 })).toBe(8);
  });

  it("falls back to BASE_NON_NUMBER_VALUE when missing from map", () => {
    expect(getTileValue(dragonTile("red"), {})).toBe(BASE_NON_NUMBER_VALUE);
  });
});

describe("sumHand", () => {
  it("adds number tile values", () => {
    const hand = [numberTile("bamboo", 3), numberTile("circles", 4)];
    expect(sumHand(hand, {})).toBe(7);
  });

  it("mixes number and non-number values", () => {
    const hand = [numberTile("bamboo", 2), dragonTile("red")];
    expect(sumHand(hand, { "dragon-red": 5 })).toBe(7);
  });
});

describe("createNewGame", () => {
  it("puts HAND_SIZE tiles in the hand", () => {
    expect(createNewGame().currentHand).toHaveLength(HAND_SIZE);
  });

  it("puts 134 tiles in the draw pile", () => {
    expect(createNewGame().drawPile).toHaveLength(134);
  });

  it("starts with score 0", () => {
    expect(createNewGame().score).toBe(0);
  });

  it("starts with an empty discard pile", () => {
    expect(createNewGame().discardPile).toEqual([]);
  });

  it("starts with an empty history", () => {
    expect(createNewGame().history).toEqual([]);
  });

  it("starts with reshuffleCount 0", () => {
    expect(createNewGame().reshuffleCount).toBe(0);
  });

  it("is not game over", () => {
    expect(createNewGame().isGameOver).toBe(false);
  });

  it("initializes all dragons and winds to BASE_NON_NUMBER_VALUE", () => {
    expect(createNewGame().tileValues).toEqual(defaultTileValues());
  });
});

describe("placeBet", () => {
  it("does not mutate the input state", () => {
    const state = baseState({
      currentHand: [numberTile("bamboo", 3), numberTile("bamboo", 4)],
      drawPile: [
        numberTile("bamboo", 5, 1),
        numberTile("bamboo", 5, 2),
        numberTile("circles", 1),
        numberTile("circles", 2),
      ],
    });
    const snapshot = JSON.parse(JSON.stringify(state));
    placeBet(state, "higher");
    expect(JSON.parse(JSON.stringify(state))).toEqual(snapshot);
  });

  it("moves the old hand to the discard pile", () => {
    const oldHand = [numberTile("bamboo", 3), numberTile("bamboo", 4)];
    const state = baseState({
      currentHand: oldHand,
      drawPile: [
        numberTile("bamboo", 5, 1),
        numberTile("bamboo", 5, 2),
        numberTile("circles", 1),
        numberTile("circles", 2),
      ],
    });
    const next = placeBet(state, "higher");
    expect(next.discardPile).toEqual(oldHand);
  });

  it("increments score by 1 on a correct bet", () => {
    const state = baseState({
      currentHand: [numberTile("bamboo", 3), numberTile("bamboo", 4)],
      drawPile: [
        numberTile("bamboo", 5, 1),
        numberTile("bamboo", 5, 2),
        numberTile("bamboo", 1),
        numberTile("bamboo", 2),
      ],
    });
    const next = placeBet(state, "higher");
    expect(next.score).toBe(1);
  });

  it("does not change score on a wrong bet", () => {
    const state = baseState({
      currentHand: [numberTile("bamboo", 5), numberTile("bamboo", 5)],
      drawPile: [
        numberTile("bamboo", 1),
        numberTile("bamboo", 1, 1),
        numberTile("bamboo", 2),
        numberTile("bamboo", 2, 1),
      ],
    });
    const next = placeBet(state, "higher");
    expect(next.score).toBe(0);
  });

  it("treats a tie as a loss on a higher bet", () => {
    const state = baseState({
      currentHand: [numberTile("bamboo", 3), numberTile("bamboo", 4)],
      drawPile: [
        numberTile("bamboo", 3, 1),
        numberTile("bamboo", 4, 1),
        numberTile("circles", 1),
        numberTile("circles", 2),
      ],
    });
    const next = placeBet(state, "higher");
    expect(next.score).toBe(0);
    expect(next.history[0].won).toBe(false);
  });

  it("treats a tie as a loss on a lower bet", () => {
    const state = baseState({
      currentHand: [numberTile("bamboo", 3), numberTile("bamboo", 4)],
      drawPile: [
        numberTile("bamboo", 3, 1),
        numberTile("bamboo", 4, 1),
        numberTile("circles", 1),
        numberTile("circles", 2),
      ],
    });
    const next = placeBet(state, "lower");
    expect(next.score).toBe(0);
    expect(next.history[0].won).toBe(false);
  });

  it("bumps non-number tiles in the new hand up by 1 after a win", () => {
    const state = baseState({
      currentHand: [numberTile("bamboo", 1), numberTile("bamboo", 1, 1)],
      drawPile: [
        dragonTile("red"),
        windTile("east"),
        numberTile("bamboo", 2),
        numberTile("bamboo", 2, 1),
      ],
    });
    const next = placeBet(state, "higher");
    expect(next.tileValues["dragon-red"]).toBe(BASE_NON_NUMBER_VALUE + 1);
    expect(next.tileValues["wind-east"]).toBe(BASE_NON_NUMBER_VALUE + 1);
  });

  it("drops non-number tiles in the new hand by 1 after a loss", () => {
    const state = baseState({
      currentHand: [numberTile("bamboo", 9), numberTile("bamboo", 9, 1)],
      drawPile: [
        dragonTile("red"),
        windTile("east"),
        numberTile("bamboo", 2),
        numberTile("bamboo", 2, 1),
      ],
    });
    const next = placeBet(state, "higher");
    expect(next.tileValues["dragon-red"]).toBe(BASE_NON_NUMBER_VALUE - 1);
    expect(next.tileValues["wind-east"]).toBe(BASE_NON_NUMBER_VALUE - 1);
  });

  it("does not change values for number tiles", () => {
    const state = baseState({
      currentHand: [numberTile("bamboo", 1), numberTile("bamboo", 1, 1)],
      drawPile: [
        numberTile("circles", 5),
        numberTile("characters", 6),
        numberTile("bamboo", 2),
        numberTile("bamboo", 2, 1),
      ],
    });
    const next = placeBet(state, "higher");
    expect(next.tileValues).toEqual(defaultTileValues());
  });

  it("shifts a duplicated non-number type in one hand by only 1", () => {
    const state = baseState({
      currentHand: [numberTile("bamboo", 1), numberTile("bamboo", 1, 1)],
      drawPile: [
        dragonTile("red", 0),
        dragonTile("red", 1),
        numberTile("bamboo", 2),
        numberTile("bamboo", 2, 1),
      ],
    });
    const next = placeBet(state, "higher");
    expect(next.tileValues["dragon-red"]).toBe(BASE_NON_NUMBER_VALUE + 1);
  });

  it("reshuffles when the draw pile is too small", () => {
    const state = baseState({
      currentHand: [numberTile("bamboo", 1), numberTile("bamboo", 1, 1)],
      drawPile: [numberTile("bamboo", 2)],
    });
    const next = placeBet(state, "higher");
    expect(next.reshuffleCount).toBe(1);
  });

  it("ends the game when a tile value reaches MAX_TILE_VALUE", () => {
    const state = baseState({
      currentHand: [numberTile("bamboo", 1), numberTile("bamboo", 1, 1)],
      drawPile: [
        dragonTile("red"),
        numberTile("bamboo", 9),
        numberTile("circles", 1),
        numberTile("circles", 2),
      ],
      tileValues: { ...defaultTileValues(), "dragon-red": MAX_TILE_VALUE - 1 },
    });
    const next = placeBet(state, "higher");
    expect(next.tileValues["dragon-red"]).toBe(MAX_TILE_VALUE);
    expect(next.isGameOver).toBe(true);
  });

  it("ends the game when a tile value reaches MIN_TILE_VALUE", () => {
    const state = baseState({
      currentHand: [numberTile("bamboo", 9), numberTile("bamboo", 9, 1)],
      drawPile: [
        dragonTile("red"),
        numberTile("bamboo", 1),
        numberTile("circles", 1),
        numberTile("circles", 2),
      ],
      tileValues: { ...defaultTileValues(), "dragon-red": MIN_TILE_VALUE + 1 },
    });
    const next = placeBet(state, "higher");
    expect(next.tileValues["dragon-red"]).toBe(MIN_TILE_VALUE);
    expect(next.isGameOver).toBe(true);
  });

  it("ends the game when reshuffleCount reaches MAX_RESHUFFLES", () => {
    const state = baseState({
      currentHand: [numberTile("bamboo", 1), numberTile("bamboo", 1, 1)],
      drawPile: [numberTile("bamboo", 2)],
      reshuffleCount: MAX_RESHUFFLES - 1,
    });
    const next = placeBet(state, "higher");
    expect(next.reshuffleCount).toBe(MAX_RESHUFFLES);
    expect(next.isGameOver).toBe(true);
  });

  it("returns the same state once the game is over", () => {
    const state = baseState({
      currentHand: [numberTile("bamboo", 1), numberTile("bamboo", 1, 1)],
      drawPile: [numberTile("bamboo", 3), numberTile("bamboo", 3, 1)],
      isGameOver: true,
      gameOverReason: "testing",
    });
    expect(placeBet(state, "higher")).toBe(state);
  });
});
