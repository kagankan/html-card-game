import { describe, expect, it } from "vitest";
import { deal, shuffle } from "./match";

describe("shuffle", () => {
  it("シードを指定すると同じ結果になる", () => {
    const cards = [1, 2, 3, 4, 5, 6, 7, 8];
    const result1 = shuffle(cards, 42);
    const result2 = shuffle(cards, 42);
    expect(result1).toEqual(result2);
  });

  it("シードが異なると結果が異なる", () => {
    const cards = [1, 2, 3, 4, 5, 6, 7, 8];
    const result1 = shuffle(cards, 1);
    const result2 = shuffle(cards, 2);
    expect(result1).not.toEqual(result2);
  });

  it("全要素が含まれる", () => {
    const cards = [1, 2, 3, 4, 5];
    const result = shuffle(cards, 42);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("元の配列を変更しない", () => {
    const cards = [1, 2, 3, 4, 5];
    shuffle(cards, 42);
    expect(cards).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("deal", () => {
  it("カードを人数分に分ける", () => {
    const cards = ["card1", "card2", "card3", "card4", "card5"];
    const playerCount = 3;

    expect(deal(cards, playerCount)).toEqual([
      ["card1", "card4"],
      ["card2", "card5"],
      ["card3"],
    ]);
  });

  it("カードが足りない場合、エラーを投げる（想定しない）", () => {
    const cards = ["card1", "card2", "card3"];
    const playerCount = 5;
    expect(() => deal(cards, playerCount)).toThrowError();
  });
});
