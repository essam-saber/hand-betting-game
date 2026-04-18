import { describe, it, expect } from "vitest";
import { buildFreshDeck, shuffle } from "../deck";

describe("buildFreshDeck", () => {
  it("returns 136 tiles", () => {
    expect(buildFreshDeck()).toHaveLength(136);
  });

  it("has 108 number tiles", () => {
    const deck = buildFreshDeck();
    expect(deck.filter((t) => t.category === "number")).toHaveLength(108);
  });

  it("has 12 dragon tiles", () => {
    const deck = buildFreshDeck();
    expect(deck.filter((t) => t.category === "dragon")).toHaveLength(12);
  });

  it("has 16 wind tiles", () => {
    const deck = buildFreshDeck();
    expect(deck.filter((t) => t.category === "wind")).toHaveLength(16);
  });

  it("gives every tile a unique id", () => {
    const deck = buildFreshDeck();
    const ids = new Set(deck.map((t) => t.id));
    expect(ids.size).toBe(deck.length);
  });

  it("formats number tile typeKeys as suit-value", () => {
    const deck = buildFreshDeck();
    const numbers = deck.filter((t) => t.category === "number");
    for (const tile of numbers) {
      expect(tile.typeKey).toMatch(/^(bamboo|circles|characters)-[1-9]$/);
    }
  });
});

describe("shuffle", () => {
  it("does not mutate the input", () => {
    const input = [1, 2, 3, 4, 5];
    const snapshot = [...input];
    shuffle(input);
    expect(input).toEqual(snapshot);
  });

  it("returns a new array instance", () => {
    const input = [1, 2, 3];
    expect(shuffle(input)).not.toBe(input);
  });

  it("preserves length", () => {
    const input = [1, 2, 3, 4, 5];
    expect(shuffle(input)).toHaveLength(input.length);
  });

  it("preserves the same elements", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect([...result].sort()).toEqual([...input].sort());
  });
});
