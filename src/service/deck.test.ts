import { describe, expect, it } from "vitest";
import {
  ALLOWED_ELEMENTS,
  DEFAULT_DECK_RECIPE,
  MAX_COUNT_PER_ELEMENT,
  clampCount,
  countCards,
  recipeToDeck,
  validateDeckRecipe,
} from "./deck";

describe("recipeToDeck", () => {
  it("枚数分だけ要素が並ぶ", () => {
    expect(recipeToDeck({ div: 2, span: 1 })).toEqual(["div", "div", "span"]);
  });

  it("枚数が 0 の要素は含まれない", () => {
    expect(recipeToDeck({ div: 0, span: 1 })).toEqual(["span"]);
  });
});

describe("countCards", () => {
  it("レシピの合計枚数と、デッキの長さが一致する", () => {
    const recipe = { div: 3, span: 2, p: 1 };
    expect(countCards(recipe)).toBe(recipeToDeck(recipe).length);
  });

  it("デフォルトのレシピの合計枚数は、許可された要素数に等しい", () => {
    const expected = Object.values(DEFAULT_DECK_RECIPE).reduce(
      (sum, count) => sum + count,
      0,
    );
    expect(countCards(DEFAULT_DECK_RECIPE)).toBe(expected);
    expect(ALLOWED_ELEMENTS.length).toBeGreaterThan(0);
  });
});

describe("clampCount", () => {
  it("負の値は 0 になる", () => {
    expect(clampCount(-1)).toBe(0);
  });

  it("上限を超える値は上限になる", () => {
    expect(clampCount(100)).toBe(MAX_COUNT_PER_ELEMENT);
  });

  it("範囲内の値はそのまま返る", () => {
    expect(clampCount(3)).toBe(3);
  });
});

describe("validateDeckRecipe", () => {
  it("合計枚数が人数以下の場合、枚数不足になる", () => {
    expect(validateDeckRecipe({ div: 2 }, 2)).toEqual({
      ok: false,
      reason: "too-few",
    });
  });

  it("合計枚数が上限を超える場合、枚数過多になる", () => {
    expect(
      validateDeckRecipe(
        { div: 9, span: 9, p: 9, a: 9, hr: 9, li: 9, ul: 9 },
        2,
      ),
    ).toEqual({
      ok: false,
      reason: "too-many",
    });
  });

  it("人数より多く上限以内であれば成立する", () => {
    expect(validateDeckRecipe({ div: 3, span: 2 }, 2)).toEqual({ ok: true });
  });
});
