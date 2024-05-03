import htmlSpec from "@markuplint/html-spec";
import { createSelector } from "@markuplint/selector";
import type { ElementName } from "./constants";
// import type { PermittedContentPattern } from "@markuplint/ml-spec";

export const getContentModel = (elementName: ElementName) => {
  const name = elementName.toLowerCase();
  const spec = htmlSpec.specs.find((s) => s.name === name);
  return spec?.contentModel.contents;
};

export function isStringArray(
  arr: readonly unknown[],
): arr is string[] | readonly string[] {
  return arr.every((item) => typeof item === "string");
}

export const getTransparentContentModel = (
  model: (typeof htmlSpec.specs)[number]["contentModel"]["contents"],
): string[] => {
  if (model === true || model === false) {
    return [];
  } else {
    return model.flatMap((m) => {
      if ("transparent" in m) {
        return m.transparent;
      }
      return [];
    });
  }
};

const flattenContentPattern = (
  model: (typeof htmlSpec.specs)[number]["contentModel"]["contents"],
  lastQuery: string,
): string[] => {
  if (model === true) {
    return ["*"];
  } else if (model === false) {
    return [":not(*)"];
  } else {
    return model.flatMap((m) => {
      if ("oneOrMore" in m) {
        if (typeof m.oneOrMore === "string") {
          return [m.oneOrMore];
        } else if (isStringArray(m.oneOrMore)) {
          return m.oneOrMore;
        } else {
          return flattenContentPattern(m.oneOrMore, lastQuery);
        }
      } else if ("zeroOrMore" in m) {
        if (typeof m.zeroOrMore === "string") {
          return [m.zeroOrMore];
        } else if (isStringArray(m.zeroOrMore)) {
          return m.zeroOrMore;
        } else {
          return flattenContentPattern(m.zeroOrMore, lastQuery);
        }
      } else if ("transparent" in m) {
        return [`:is(${lastQuery}):is(${m.transparent})`];
      }
      return [];
    });
  }
};

/**
 * 与えられた要素が次に出せるかどうか
 * documentを使うため、ブラウザ環境でのみ動作する
 */
export const checkNext = (
  /** 現在出ている要素の配列。この配列は仕様を満たしている前提 */
  parents: readonly ElementName[],
  /** 次に出したい要素 */
  tagName: ElementName,
): boolean => {
  if (parents.length === 0) {
    return true; //{ ok: true, queries: ["*"] };
  }
  const element = document.createElement(tagName);
  console.log(element);
  console.log(parents);

  let first = true;
  let transparent = false;
  for (const parent of [...parents].reverse()) {
    console.log("parent", parent);
    const contentModel = getContentModel(parent);
    if (contentModel == null) return false;
    console.log(contentModel);
    // 最初の要素の場合、すべてのコンテンツモデルをチェック
    // 子要素が透過的なコンテンツモデルの場合、透過的なコンテンツモデルのみチェック
    if (first || transparent) {
      console.log("first || transparent");
      const candidates = flattenContentPattern(contentModel, "*");
      console.log(candidates);

      const queries = candidates.filter((model) => {
        const result = createSelector(model, htmlSpec).match(element);
        return result !== false;
      });
      if (queries.length === 0) return false;

      first = false;
    }
    const transparentContentModel = getTransparentContentModel(contentModel);
    if (transparentContentModel.length === 0) {
      transparent = false;
      continue;
    }

    transparent = true;
    const queries = transparentContentModel.filter((model) => {
      const result = createSelector(model, htmlSpec).match(element);
      return result !== false;
    });
    if (queries.length === 0) return false;
  }
  return true;
};
