import type { ElementName } from "./constants";

/** 要素ごとの枚数指定 */
export type DeckRecipe = Partial<Record<ElementName, number>>;

/** 1 種類あたりに指定できる枚数の上限 */
export const MAX_COUNT_PER_ELEMENT = 9;

/** 1 ゲームで使えるカードの合計枚数の上限 */
export const MAX_TOTAL_CARDS = 60;

export const DEFAULT_DECK_RECIPE = {
  body: 1,
  div: 1,
  span: 1,
  a: 1,
  hr: 1,
  p: 1,
  button: 1,
  ul: 1,
  li: 1,
  br: 1,
  nav: 0,
  header: 0,
  footer: 0,
  main: 1,
  aside: 1,
  section: 1,
  article: 1,
  h1: 1,
  h2: 1,
  script: 1,
  style: 1,
  meta: 0,
  title: 0,
} as const satisfies DeckRecipe;

export const ALLOWED_ELEMENTS = Object.keys(
  DEFAULT_DECK_RECIPE,
) as ElementName[];

/** レシピからカードの要素名の配列を作る */
export const recipeToDeck = (recipe: DeckRecipe): ElementName[] => {
  return (Object.entries(recipe) as [ElementName, number][]).flatMap(
    ([element, count]) => Array.from({ length: count }, () => element),
  );
};

/** レシピに含まれるカードの合計枚数 */
export const countCards = (recipe: DeckRecipe): number => {
  return Object.values(recipe).reduce((sum, count) => sum + count, 0);
};

/** 枚数を 0 以上、上限以下に収める */
export const clampCount = (
  count: number,
  max: number = MAX_COUNT_PER_ELEMENT,
): number => {
  return Math.min(max, Math.max(0, count));
};

export type DeckRecipeValidation =
  { ok: true } | { ok: false; reason: "too-few" | "too-many" };

/** 対戦人数に対してレシピが成立するか */
export const validateDeckRecipe = (
  recipe: DeckRecipe,
  playerCount: number,
): DeckRecipeValidation => {
  const total = countCards(recipe);
  if (total <= playerCount) {
    return { ok: false, reason: "too-few" };
  }
  if (total > MAX_TOTAL_CARDS) {
    return { ok: false, reason: "too-many" };
  }
  return { ok: true };
};
