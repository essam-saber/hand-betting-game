import {
  BASE_NON_NUMBER_VALUE,
  HAND_SIZE,
  MAX_RESHUFFLES,
  MAX_TILE_VALUE,
  MIN_TILE_VALUE,
} from "./tiles";
import type { Tile } from "./tiles";
import { buildFreshDeck, shuffle } from "./deck";
import type { BetDirection, GameState, HistoryEntry } from "./state";

export function getTileValue(
  tile: Tile,
  tileValues: Record<string, number>
): number {
  if (tile.category === "number") {
    return parseInt(tile.typeKey.split("-")[1], 10);
  }
  return tileValues[tile.typeKey] ?? BASE_NON_NUMBER_VALUE;
}

export function sumHand(
  hand: Tile[],
  tileValues: Record<string, number>
): number {
  return hand.reduce((sum, tile) => sum + getTileValue(tile, tileValues), 0);
}

function buildInitialTileValues(): Record<string, number> {
  const values: Record<string, number> = {};
  for (const d of ["red", "green", "white"]) {
    values[`dragon-${d}`] = BASE_NON_NUMBER_VALUE;
  }
  for (const w of ["east", "south", "west", "north"]) {
    values[`wind-${w}`] = BASE_NON_NUMBER_VALUE;
  }
  return values;
}

interface DrawResult {
  drawn: Tile[];
  drawPile: Tile[];
  discardPile: Tile[];
  reshuffleCount: number;
}

function drawTiles(state: GameState, count: number): DrawResult {
  let drawPile = state.drawPile;
  let discardPile = state.discardPile;
  let reshuffleCount = state.reshuffleCount;

  if (drawPile.length < count) {
    drawPile = shuffle([...drawPile, ...discardPile, ...buildFreshDeck()]);
    discardPile = [];
    reshuffleCount += 1;
  }

  return {
    drawn: drawPile.slice(0, count),
    drawPile: drawPile.slice(count),
    discardPile,
    reshuffleCount,
  };
}

export function createNewGame(): GameState {
  const deck = shuffle(buildFreshDeck());

  return {
    drawPile: deck.slice(HAND_SIZE),
    discardPile: [],
    reshuffleCount: 0,
    currentHand: deck.slice(0, HAND_SIZE),
    tileValues: buildInitialTileValues(),
    score: 0,
    history: [],
    isGameOver: false,
    gameOverReason: null,
  };
}

export function placeBet(state: GameState, bet: BetDirection): GameState {
  if (state.isGameOver) return state;

  const oldHand = state.currentHand;
  const oldTotal = sumHand(oldHand, state.tileValues);

  const draw = drawTiles(
    { ...state, discardPile: [...state.discardPile, ...oldHand] },
    HAND_SIZE
  );

  const newHand = draw.drawn;
  const newTotal = sumHand(newHand, state.tileValues);

  // Tie counts as a loss. Player must guess strictly higher or lower.
  const won =
    bet === "higher" ? newTotal > oldTotal : newTotal < oldTotal;

  // Apply value changes only to the new hand's non-number tiles.
  // Use a Set so duplicate types in the same hand only shift once.
  const tileValues = { ...state.tileValues };
  const touched = new Set<string>();
  for (const tile of newHand) {
    if (tile.category === "number" || touched.has(tile.typeKey)) continue;
    touched.add(tile.typeKey);
    tileValues[tile.typeKey] += won ? 1 : -1;
  }

  const historyEntry: HistoryEntry = {
    tiles: oldHand,
    total: oldTotal,
    bet,
    won,
  };

  let isGameOver = false;
  let gameOverReason: string | null = null;

  for (const [typeKey, value] of Object.entries(tileValues)) {
    if (value <= MIN_TILE_VALUE || value >= MAX_TILE_VALUE) {
      isGameOver = true;
      gameOverReason = `Tile "${typeKey}" reached value ${value}`;
      break;
    }
  }

  if (!isGameOver && draw.reshuffleCount >= MAX_RESHUFFLES) {
    isGameOver = true;
    gameOverReason = `Draw pile exhausted ${MAX_RESHUFFLES} times`;
  }

  return {
    drawPile: draw.drawPile,
    discardPile: draw.discardPile,
    reshuffleCount: draw.reshuffleCount,
    currentHand: newHand,
    tileValues,
    score: won ? state.score + 1 : state.score,
    history: [historyEntry, ...state.history],
    isGameOver,
    gameOverReason,
  };
}