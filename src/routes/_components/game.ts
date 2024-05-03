import htmlSpec from "@markuplint/html-spec";
import { createSelector } from "@markuplint/selector";
// import type { PermittedContentPattern } from "@markuplint/ml-spec";

// TODO: ユニオン型にしたい
export type ElementName = (typeof htmlSpec.specs)[number]["name"];

const getContentModel = (elementName: ElementName) => {
  const name = elementName.toLowerCase();
  const spec = htmlSpec.specs.find((s) => s.name === name);
  return spec?.contentModel.contents;
};

export function isStringArray(
  arr: readonly unknown[],
): arr is string[] | readonly string[] {
  return arr.every((item) => typeof item === "string");
}

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
  parents: string[],
  /** 次に出したい要素 */
  tagName: string,
): boolean => {
  if (parents.length === 0) {
    return true; //{ ok: true, queries: ["*"] };
  }
  const element = document.createElement(tagName);
  console.log(element);
  console.log(parents);
  const ok = parents.every((parent) => {
    const contentModel = getContentModel(parent);
    console.log(contentModel);
    if (contentModel == null) return false; //{ ok: false };
    const candidates = flattenContentPattern(contentModel, "*");
    console.log(candidates);
    const queries = candidates.filter((model) => {
      const result = createSelector(model, htmlSpec).match(element);
      return result !== false;
    });
    if (queries.length === 0) return false;

    console.log(tagName, queries);
    return true;
  });
  return ok;
};
