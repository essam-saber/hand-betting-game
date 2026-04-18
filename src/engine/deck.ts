import type { Tile, NumberSuit, DragonType, WindType } from "./tiles";

const SUITS: NumberSuit[] = ["bamboo", "circles", "characters"];
const DRAGONS: DragonType[] = ["red", "green", "white"];
const WINDS: WindType[] = ["east", "south", "west", "north"];

const COPIES_PER_TILE = 4;

export function buildFreshDeck(): Tile[] {
  const tiles: Tile[] = [];

  for (const suit of SUITS) {
    for (let value = 1; value <= 9; value++) {
      for (let copy = 0; copy < COPIES_PER_TILE; copy++) {
        tiles.push({
          id: makeId(`${suit}-${value}`, copy),
          category: "number",
          typeKey: `${suit}-${value}`,
          label: `${value} ${capitalize(suit)}`,
        });
      }
    }
  }

  for (const dragon of DRAGONS) {
    for (let copy = 0; copy < COPIES_PER_TILE; copy++) {
      tiles.push({
        id: makeId(`dragon-${dragon}`, copy),
        category: "dragon",
        typeKey: `dragon-${dragon}`,
        label: `${capitalize(dragon)} Dragon`,
      });
    }
  }

  for (const wind of WINDS) {
    for (let copy = 0; copy < COPIES_PER_TILE; copy++) {
      tiles.push({
        id: makeId(`wind-${wind}`, copy),
        category: "wind",
        typeKey: `wind-${wind}`,
        label: `${capitalize(wind)} Wind`,
      });
    }
  }

  return tiles;
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function makeId(typeKey: string, copy: number): string {
  return `${typeKey}-${copy}-${Math.random().toString(36).slice(2, 8)}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}