import type { ElementName } from "./constants";

/** 手札 */
type Hand = readonly ElementName[];

type Match = Readonly<{
  /** 場に出されたカード */
  field: readonly ElementName[];
  /** プレイヤーの手札 */
  players: readonly Hand[];
}>;

export const startMatch = (
  deck: readonly ElementName[],
  playerCount: number,
): Match => {
  const shuffled = shuffle(deck);
  const players = deal(shuffled, playerCount);
  return {
    field: [],
    players,
  };
};

const shuffle = <T>(array: readonly T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

// カードを人数分に配る
export const deal = <T>(cards: readonly T[], playerCount: number): T[][] => {
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