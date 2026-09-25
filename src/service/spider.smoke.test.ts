/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import {
  buildDeck,
  dealSpider,
  isValidChain,
  canPlaceRun,
  moveRun,
  dealFromStock,
  canComplete,
  completeColumn,
  TARGET_RUN_LENGTH,
  SOLITAIRE_DECK_RECIPE,
  type SpiderCard,
} from "./spider";

const card = (element: SpiderCard["element"], faceUp = true): SpiderCard => ({
  element,
  id: `${element}-${Math.random()}`,
  faceUp,
});

describe("spider smoke", () => {
  it("デッキはレシピ通りの枚数になる", () => {
    const total = Object.values(SOLITAIRE_DECK_RECIPE).reduce((a, b) => a + b, 0);
    expect(buildDeck().length).toBe(total);
  });

  it("配ると各列の末尾だけ表向きになる", () => {
    const state = dealSpider();
    expect(state.columns.length).toBe(7);
    for (const col of state.columns) {
      const up = col.filter((c) => c.faceUp);
      expect(up.length).toBe(1);
      expect(col[col.length - 1].faceUp).toBe(true);
    }
  });

  it("isValidChain: コンテンツモデルで内包可否を判定する", () => {
    // ul は li を内包できる。li は ul（入れ子リスト）も内包できる。
    expect(isValidChain(["ul", "li"])).toBe(true);
    expect(isValidChain(["li", "ul"])).toBe(true);
    // ul は ul を直接は内包できない（間に li が要る）
    expect(isValidChain(["ul", "ul"])).toBe(false);
    // span（phrasing）は div（flow）を内包できない
    expect(isValidChain(["span", "div"])).toBe(false);
  });

  it("canPlaceRun: ul の列に li を置ける、span の列に div は置けない", () => {
    expect(canPlaceRun([card("li")], [card("ul")])).toBe(true);
    expect(canPlaceRun([card("div")], [card("span")])).toBe(false);
  });

  it("moveRun: li を ul の列に移動できる", () => {
    const state = {
      columns: [[card("ul")], [card("li")]],
      stock: [],
      foundations: [],
    };
    const next = moveRun(state, 1, 0, 0);
    expect(next).not.toBeNull();
    expect(next!.columns[0].map((c) => c.element)).toEqual(["ul", "li"]);
    expect(next!.columns[1].length).toBe(0);
  });

  it("moveRun: 不正な移動は null", () => {
    // span の列に div を移そうとしても置けない
    const state = {
      columns: [[card("span")], [card("div")]],
      stock: [],
      foundations: [],
    };
    expect(moveRun(state, 1, 0, 0)).toBeNull();
  });

  it("canComplete / completeColumn: 目標枚数の有効チェーンは手動で完成できる", () => {
    const five = Array.from({ length: TARGET_RUN_LENGTH }, () => card("div"));
    expect(canComplete(five)).toBe(true);
    // 目標枚数未満では完成できない
    expect(canComplete(five.slice(0, TARGET_RUN_LENGTH - 1))).toBe(false);

    const state = { columns: [five], stock: [], foundations: [] };
    const next = completeColumn(state, 0);
    expect(next).not.toBeNull();
    expect(next!.foundations.length).toBe(1);
    expect(next!.columns[0].length).toBe(0);
  });

  it("moveRun / dealFromStock は自動完成しない", () => {
    // 目標枚数に達しても自動では取り除かれないことを確認
    const nearComplete = Array.from({ length: TARGET_RUN_LENGTH - 1 }, () =>
      card("div"),
    );
    const state = {
      columns: [nearComplete, [card("div")]],
      stock: [],
      foundations: [],
    };
    const next = moveRun(state, 1, 0, 0);
    expect(next).not.toBeNull();
    expect(next!.foundations.length).toBe(0);
    expect(next!.columns[0].length).toBe(TARGET_RUN_LENGTH);
  });

  it("dealFromStock: 各列に 1 枚配られる", () => {
    const state = {
      columns: [[card("div")], [card("div")]],
      stock: [card("span", false), card("span", false)],
      foundations: [],
    };
    const next = dealFromStock(state);
    expect(next).not.toBeNull();
    expect(next!.columns[0].length).toBe(2);
    expect(next!.columns[0][1].faceUp).toBe(true);
    expect(next!.stock.length).toBe(0);
  });
});
