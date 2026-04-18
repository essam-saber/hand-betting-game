import { Tile, NumberSuit, DragonType, WindType } from "./tiles";

const SUITS: NumberSuit[] = ["bamboo", "circles", "characters"];
const DRAGONS: DragonType[] = ["red", "green", "white"];
const WINDS: WindType[] = ["east", "south", "west", "north"];

// === Build a fresh standard Mahjong deck (136 tiles) ===
// 3 suits x 9 numbers x 4 copies = 108 number tiles
// 3 dragons x 4 copies = 12 dragon tiles
// 4 winds x 4 copies = 16 wind tiles
// total = 136 tiles
export function buildFreshDeck(): Tile[] {
  const tiles: Tile[] = [];

  // number tiles
  for (const suit of SUITS) {
    for (let value = 1; value <= 9; value++) {
      for (let copy = 0; copy < 4; copy++) {
        tiles.push({
          id: `${suit}-${value}-${copy}-${Math.random()}`,
          category: "number",
          typeKey: `${suit}-${value}`,
          label: `${value} ${capitalize(suit)}`,
        });
      }
    }
  }

  // dragon tiles
  for (const dragon of DRAGONS) {
    for (let copy = 0; copy < 4; copy++) {
      tiles.push({
        id: `dragon-${dragon}-${copy}-${Math.random()}`,
        category: "dragon",
        typeKey: `dragon-${dragon}`,
        label: `${capitalize(dragon)} Dragon`,
      });
    }
  }

  // wind tiles
  for (const wind of WINDS) {
    for (let copy = 0; copy < 4; copy++) {
      tiles.push({
        id: `wind-${wind}-${copy}-${Math.random()}`,
        category: "wind",
        typeKey: `wind-${wind}`,
        label: `${capitalize(wind)} Wind`,
      });
    }
  }

  return tiles;
}

// === Fisher-Yates shuffle (the standard fair shuffle algorithm) ===
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}