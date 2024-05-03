import { describe, it, expect } from "vitest";
import { checkNext, isStringArray } from "./game";

describe("isStringArray", () => {
  it("returns true when all elements are strings", () => {
    expect(isStringArray(["a", "b", "c"])).toBe(true);
  });

  it("returns false when any element is not a string", () => {
    expect(isStringArray(["a", "b", 1])).toBe(false);
  });
});

/**
 * @vitest-environment jsdom
 */
describe("checkNext", () => {
  it("場に何も出ていないときは、すべての要素が出せる", () => {
    expect(checkNext([], "p")).toBe(true);
  });
  it("親のコンテンツモデルに適合した要素が出せる", () => {
    expect(checkNext(["div"], "div")).toBe(true);
  });
  it("親のコンテンツモデルに適合しない要素は出せない", () => {
    expect(checkNext(["span"], "div")).toBe(false);
  });
  it("コンテンツモデルに適合した要素が出せる", () => {
    expect(checkNext(["div", "p", "span"], "span")).toBe(true);
  });
  it("コンテンツモデルに適合しない要素が出せない", () => {
    expect(checkNext(["div", "p", "span"], "p")).toBe(false);
  });
  describe("トランスペアレントモデル", () => {
    it("トランスペアレントモデルが処理される", () => {
      expect(checkNext(["a", "div", "p"], "button")).toBe(false);
    });
    it("トランスペアレントモデルが処理される", () => {
      expect(checkNext(["div", "a"], "div")).toBe(true);
    });
    it("トランスペアレントモデルが処理される", () => {
      expect(checkNext(["span", "a"], "div")).toBe(false);
    });
  });
});
