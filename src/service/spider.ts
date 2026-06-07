import type { ElementName } from "./constants";
import { checkNext } from "./content-model";
import { uuid } from "./id";

/**
 * HTML スパイダーソリティアのゲームロジック。
 *
 * 通常のスパイダーは「数字の降順（13→12）」で並びを作るが、
 * ここでは「コンテンツモデルで内包できるか」で並びを判定する。
 * 例: ul の上に li は置ける（ul→li）が、li の上に ul は置けない（li→ul）。
 * 並びの判定には content-model.ts の checkNext を使う。
 */

export type SpiderCard = Readonly<{
  element: ElementName;
  id: string;
  /** 表向きかどうか。裏向き（false）の要素は伏せられている */
  faceUp: boolean;
}>;

/**
 * 1 列分のカード。
 * index 0 が一番外側（上に表示、最初は裏向きのことが多い）、
 * 末尾が一番内側＝むき出しのカード（下に表示、操作対象）。
 * 表向きの連なり（末尾側の faceUp なカード列）は常に有効な入れ子チェーンになっている。
 */
export type Column = readonly SpiderCard[];

export type SpiderState = Readonly<{
  columns: readonly Column[];
  /** 山札。クリックで各列に 1 枚ずつ配る */
  stock: readonly SpiderCard[];
  /** 完成して取り除かれた連なり（土台） */
  foundations: readonly (readonly SpiderCard[])[];
}>;

// --- 調整用パラメータ ---------------------------------------------------------

/** 列の数 */
export const COLUMN_COUNT = 7;
/** 各列に最初に配る枚数（末尾の 1 枚だけ表向き、残りは裏向き） */
export const INITIAL_ROWS = 3;
/**
 * 表向きの連なりがこの長さ以上の有効なチェーンになったら完成として取り除く。
 * 通常スパイダーの「K→A の 13 枚揃え」に相当する。短くすると簡単になる。
 */
export const TARGET_RUN_LENGTH = 4;

/**
 * 山札のレシピ。入れ子にしやすい要素を中心に、合計 52 枚程度を用意する。
 * 数字を変えれば構成を調整できる。
 */
export const SOLITAIRE_DECK_RECIPE = {
  div: 5,
  section: 2,
  article: 2,
  aside: 1,
  ul: 3,
  ol: 1,
  li: 4,
  p: 4,
  span: 4,
  a: 3,
  em: 2,
  strong: 2,
  code: 2,
  b: 2,
  i: 1,
  small: 1,
  blockquote: 2,
  figure: 1,
  figcaption: 1,
  button: 1,
  label: 1,
  br: 3,
  hr: 2,
  img: 2,
} as const satisfies Partial<Record<ElementName, number>>;

// --- デッキ生成・配り --------------------------------------------------------

const shuffle = <T>(array: readonly T[]): T[] =>
  [...array].sort(() => Math.random() - 0.5);

export const buildDeck = (
  recipe: Partial<Record<ElementName, number>> = SOLITAIRE_DECK_RECIPE,
): ElementName[] =>
  (Object.entries(recipe) as [ElementName, number][]).flatMap(
    ([element, count]) => Array.from({ length: count }, () => element),
  );

/** 新しいゲームを開始する */
export const dealSpider = (
  deck: readonly ElementName[] = buildDeck(),
  columnCount: number = COLUMN_COUNT,
  initialRows: number = INITIAL_ROWS,
): SpiderState => {
  const cards: SpiderCard[] = shuffle(deck).map((element) => ({
    element,
    id: uuid(),
    faceUp: false,
  }));

  const columns: SpiderCard[][] = Array.from({ length: columnCount }, () => []);
  let idx = 0;
  for (let row = 0; row < initialRows; row++) {
    for (let c = 0; c < columnCount; c++) {
      if (idx >= cards.length) break;
      columns[c].push(cards[idx++]);
    }
  }
  // 各列の末尾だけ表向きにする
  for (const col of columns) {
    if (col.length > 0) {
      col[col.length - 1] = { ...col[col.length - 1], faceUp: true };
    }
  }

  const stock = cards.slice(idx);
  return { columns, stock, foundations: [] };
};

// --- チェーン判定（ブラウザでのみ動作） --------------------------------------

/** 要素の並びが有効な入れ子チェーンか（先頭が外側、末尾が内側） */
export const isValidChain = (elements: readonly ElementName[]): boolean => {
  for (let i = 0; i < elements.length; i++) {
    if (!checkNext(elements.slice(0, i), elements[i])) {
      return false;
    }
  }
  return true;
};

/** 列の表向きの連なりが始まる index */
export const faceUpStart = (column: Column): number => {
  let i = column.length;
  while (i > 0 && column[i - 1].faceUp) i--;
  return i;
};

/** その列のむき出し（表向き）の要素列 */
export const faceUpElements = (column: Column): ElementName[] =>
  column.slice(faceUpStart(column)).map((c) => c.element);

/**
 * 列の cardIndex 以降のカード（連なり）を、対象列に置けるか判定する。
 * 対象列の表向きチェーンの末尾に連なりを足しても有効なチェーンであればよい。
 */
export const canPlaceRun = (
  run: readonly SpiderCard[],
  targetColumn: Column,
): boolean => {
  if (run.length === 0) return false;
  const base = faceUpElements(targetColumn);
  return isValidChain([...base, ...run.map((c) => c.element)]);
};

// --- 操作 -------------------------------------------------------------------

/**
 * (fromColumn, cardIndex) の連なりを toColumn に移動する。
 * 不正な移動の場合は null を返す。
 */
export const moveRun = (
  state: SpiderState,
  fromColumn: number,
  cardIndex: number,
  toColumn: number,
): SpiderState | null => {
  if (fromColumn === toColumn) return null;
  const source = state.columns[fromColumn];
  const target = state.columns[toColumn];
  if (!source || !target) return null;

  const card = source[cardIndex];
  if (!card || !card.faceUp) return null;

  const run = source.slice(cardIndex);
  if (!canPlaceRun(run, target)) return null;

  const newSource = source.slice(0, cardIndex);
  // 連なりを全部はがしたら、その下の裏向きカードを表にする
  if (newSource.length > 0 && !newSource[newSource.length - 1].faceUp) {
    newSource[newSource.length - 1] = {
      ...newSource[newSource.length - 1],
      faceUp: true,
    };
  }
  const newTarget = [...target, ...run];

  const columns = state.columns.map((col, i) => {
    if (i === fromColumn) return newSource;
    if (i === toColumn) return newTarget;
    return col;
  });

  return autoComplete({ ...state, columns });
};

/** 山札から各列に 1 枚ずつ配る */
export const dealFromStock = (state: SpiderState): SpiderState | null => {
  if (state.stock.length === 0) return null;
  const stock = [...state.stock];
  const columns = state.columns.map((col) => {
    const card = stock.shift();
    if (!card) return col;
    return [...col, { ...card, faceUp: true }];
  });
  return autoComplete({ ...state, columns, stock });
};

/**
 * 表向きの連なりが目標の長さ以上になった列を完成として取り除く。
 * 取り除いたら下の裏向きカードを表にする。連鎖完成も処理する。
 */
export const autoComplete = (state: SpiderState): SpiderState => {
  let columns = state.columns.map((c) => [...c]);
  const foundations = [...state.foundations];
  let changed = true;

  while (changed) {
    changed = false;
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const start = faceUpStart(col);
      const run = col.slice(start);
      if (
        run.length >= TARGET_RUN_LENGTH &&
        isValidChain(run.map((c) => c.element))
      ) {
        foundations.push(run);
        const remaining = col.slice(0, start);
        if (
          remaining.length > 0 &&
          !remaining[remaining.length - 1].faceUp
        ) {
          remaining[remaining.length - 1] = {
            ...remaining[remaining.length - 1],
            faceUp: true,
          };
        }
        columns[i] = remaining;
        changed = true;
      }
    }
  }

  return { ...state, columns, foundations };
};

/** 全カードを片付けたら勝ち */
export const isWon = (state: SpiderState): boolean =>
  state.stock.length === 0 && state.columns.every((c) => c.length === 0);
