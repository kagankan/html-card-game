import { describe, expect, it } from "vitest";
import { deal } from "./match";

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

  it("カードが足りない場合、空の配列を持つプレイヤーがいる", () => {
    const cards = ["card1", "card2", "card3"];
    const playerCount = 5;
    expect(deal(cards, playerCount)).toEqual([
      ["card1"],
      ["card2"],
      ["card3"],
      [],
      [],
    ]);
  });
});
