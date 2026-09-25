import { describe, expect, it } from "vitest";
import {
  clearField,
  deal,
  findWinner,
  nextTurn,
  playCard,
  shuffle,
  startMatch,
  type Match,
} from "./match";

const createMatch = (overrides: Partial<Match> = {}): Match => ({
  field: [],
  trash: [],
  players: [
    [
      { element: "div", id: "a" },
      { element: "p", id: "b" },
    ],
    [{ element: "span", id: "c" }],
  ],
  ...overrides,
});

describe("deal", () => {
  it("カードを人数分に分ける", () => {
    const cards = ["card1", "card2", "card3", "card4", "card5"];
    const playerCount = 3;

    expect(deal(cards, playerCount)).toEqual({
      ok: true,
      value: [["card1", "card4"], ["card2", "card5"], ["card3"]],
    });
  });

  it("カードが足りない場合、エラーを返す", () => {
    const cards = ["card1", "card2", "card3"];
    const playerCount = 5;
    expect(deal(cards, playerCount)).toEqual({
      ok: false,
      error: { type: "not-enough-cards", cardCount: 3, playerCount: 5 },
    });
  });

  it("カードが人数より多い場合、全員に配られる", () => {
    const result = deal(["card1", "card2", "card3"], 2);
    expect(result).toEqual({
      ok: true,
      value: [["card1", "card3"], ["card2"]],
    });
  });
});

describe("shuffle", () => {
  it("元の配列を変更しない", () => {
    const original = [1, 2, 3, 4, 5];
    shuffle(original);
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });

  it("要素の集合は変わらない", () => {
    const shuffled = shuffle([1, 2, 3, 4, 5]);
    expect([...shuffled].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("要素数が変わらない", () => {
    expect(shuffle([1, 2, 3, 4, 5, 6])).toHaveLength(6);
  });
});

describe("startMatch", () => {
  it("人数分の手札を配り、場と捨て札は空である", () => {
    const result = startMatch(["div", "span", "p", "a", "hr"], 2);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.players.map((hand) => hand.length)).toEqual([3, 2]);
    expect(result.value.field).toEqual([]);
    expect(result.value.trash).toEqual([]);
  });

  it("プレイヤーが 1 人以下の場合、エラーを返す", () => {
    expect(startMatch(["div", "span"], 1)).toEqual({
      ok: false,
      error: { type: "invalid-player-count", playerCount: 1 },
    });
  });
});

describe("playCard", () => {
  it("指定したカードが手札から場に移る", () => {
    const result = playCard(createMatch(), 0, 1);
    expect(result).toEqual({
      ok: true,
      value: createMatch({
        field: [{ element: "p", id: "b" }],
        players: [
          [{ element: "div", id: "a" }],
          [{ element: "span", id: "c" }],
        ],
      }),
    });
  });

  it("存在しないカードを指定した場合、エラーを返す", () => {
    expect(playCard(createMatch(), 1, 3)).toEqual({
      ok: false,
      error: { type: "card-not-found", playerIndex: 1, cardIndex: 3 },
    });
  });
});

describe("clearField", () => {
  it("場のカードが捨て札に移る", () => {
    const match = createMatch({
      field: [{ element: "div", id: "x" }],
      trash: [{ element: "p", id: "y" }],
    });
    expect(clearField(match)).toEqual({
      ...match,
      field: [],
      trash: [
        { element: "p", id: "y" },
        { element: "div", id: "x" },
      ],
    });
  });
});

describe("findWinner", () => {
  it("どちらの手札も残っている間は勝者がいない", () => {
    expect(findWinner(createMatch())).toBeNull();
  });
});

describe("nextTurn", () => {
  it("手番が入れ替わる", () => {
    expect(nextTurn(0)).toBe(1);
    expect(nextTurn(1)).toBe(0);
  });
});
