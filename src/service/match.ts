import type { ElementName } from "./constants";
import { uuid } from "./id";

type Card = Readonly<{ element: ElementName; id: string }>;

/** 手札 */
type Hand = readonly Card[];

type Match = Readonly<{
  /** 場に出されたカード */
  field: readonly Card[];
  /** プレイヤーの手札 */
  players: readonly Hand[];
  /** 捨て札 */
  trash: readonly Card[];
}>;

export const startMatch = (
  elements: readonly ElementName[],
  playerCount: number,
  seed?: number,
): Match => {
  const shuffled = shuffle(elements, seed);
  const hands = deal(shuffled, playerCount);
  return {
    field: [],
    trash: [],
    players: hands.map((hand) =>
      hand.map((element) => ({ element, id: uuid() })),
    ),
  };
};

/** Mulberry32 アルゴリズムによるシード付き擬似乱数生成器 */
const createSeededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const shuffle = <T>(array: readonly T[], seed?: number): T[] => {
  const random = seed !== undefined ? createSeededRandom(seed) : Math.random;
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// カードを人数分に配る
export const deal = <T>(cards: readonly T[], playerCount: number): T[][] => {
  if (cards.length < playerCount) {
    console.log(cards.length, playerCount);
    throw new Error("カードが足りません");
  }
  const hands: T[][] = cards.reduce<T[][]>((acc, card, index) => {
    const playerIndex = index % playerCount;
    if (!acc[playerIndex]) {
      acc[playerIndex] = [];
    }
    acc[playerIndex].push(card);
    return acc;
  }, []);

  return hands;
};
