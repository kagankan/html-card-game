import { describe, it, expect } from "vitest";
import {
  checkNext,
  formatHtml,
  getTransparentContentModel,
  isStringArray,
} from "./content-model";

describe("isStringArray", () => {
  it("returns true when all elements are strings", () => {
    expect(isStringArray(["a", "b", "c"])).toBe(true);
  });

  it("returns false when any element is not a string", () => {
    expect(isStringArray(["a", "b", 1])).toBe(false);
  });
});

describe("getTransparentContentModel", () => {
  it("returns null when model is true", () => {
    const modelOfDiv = [
      {
        oneOrMore: ":model(flow)",
      },
    ];
    expect(getTransparentContentModel(modelOfDiv)).toEqual([]);
  });
  it("トランスペアレントモデル", () => {
    // getContentModel("a");
    const modelOfA = [
      {
        transparent:
          ":not(:model(interactive), a, [tabindex], :has(:model(interactive), a, [tabindex]))",
      },
    ];
    expect(getTransparentContentModel(modelOfA)).toEqual([
      ":not(:model(interactive), a, [tabindex], :has(:model(interactive), a, [tabindex]))",
    ]);
  });

  it("returns transparent content model", () => {
    const modelOdVideo = [
      {
        zeroOrMore: "source",
      },
      {
        zeroOrMore: "track",
      },
      {
        transparent: ":not(audio, video, :has(audio, video))",
      },
    ];
    expect(getTransparentContentModel(modelOdVideo)).toEqual([
      ":not(audio, video, :has(audio, video))",
    ]);
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
  it("ulの中にliが入れられる", () => {
    expect(checkNext(["ul"], "li")).toBe(true);
    expect(checkNext(["body", "ul"], "li")).toBe(true);
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

describe("formatHtml", () => {
  it("returns formatted html", () => {
    expect(formatHtml(["ul", "li", "p"])).toBe("<ul><li><p></p></li></ul>");
  });
  it("空要素の処理", () => {
    expect(formatHtml(["ul", "li", "p", "br"])).toBe(
      "<ul><li><p><br></p></li></ul>",
    );
  });
  it("空要素が途中に挟まっている場合はエラー", () => {
    expect(() => formatHtml(["ul", "li", "br", "p"])).toThrowError();
  });
  it("インデント", () => {
    expect(formatHtml(["ul", "li", "p", "br"], 2)).toBe(
      `<ul>
  <li>
    <p>
      <br>
    </p>
  </li>
</ul>`,
    );
  });
});
