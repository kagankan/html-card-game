import type { ElementName } from "./constants";
import { uuid } from "./id";

export type Card = Readonly<{ element: ElementName; id: string }>;

/** 手札 */
type Hand = readonly Card[];

export type PlayerIndex = 0 | 1;

export type Match = Readonly<{
  /** 場に出されたカード */
  field: readonly Card[];
  /** プレイヤーの手札 */
  players: readonly Hand[];
  /** 捨て札 */
  trash: readonly Card[];
}>;

export type MatchError =
  | { type: "not-enough-cards"; cardCount: number; playerCount: number }
  | { type: "invalid-player-count"; playerCount: number }
  | { type: "card-not-found"; playerIndex: number; cardIndex: number };

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export const startMatch = (
  elements: readonly ElementName[],
  playerCount: number,
): Result<Match, MatchError> => {
  if (!Number.isInteger(playerCount) || playerCount < 2) {
    return err({ type: "invalid-player-count", playerCount });
  }
  const shuffled = shuffle(elements);
  const hands = deal(shuffled, playerCount);
  if (!hands.ok) return hands;
  return ok({
    field: [],
    trash: [],
    players: hands.value.map((hand) =>
      hand.map((element) => ({ element, id: uuid() })),
    ),
  });
};

/** Fisher-Yates でシャッフルする */
export const shuffle = <T>(
  array: readonly T[],
  random: () => number = Math.random,
): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 1; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// カードを人数分に配る
export const deal = <T>(
  cards: readonly T[],
  playerCount: number,
): Result<T[][], MatchError> => {
  if (cards.length <= playerCount) {
    return err({
      type: "not-enough-cards",
      cardCount: cards.length,
      playerCount,
    });
  }
  const hands: T[][] = Array.from({ length: playerCount }, () => []);
  cards.forEach((card, index) => {
    hands[index % playerCount].push(card);
  });
  return ok(hands);
};

/** 手札から 1 枚を場に出す */
export const playCard = (
  match: Match,
  playerIndex: number,
  cardIndex: number,
): Result<Match, MatchError> => {
  const card = match.players[playerIndex]?.[cardIndex];
  if (!card) {
    return err({ type: "card-not-found", playerIndex, cardIndex });
  }
  return ok({
    ...match,
    field: [...match.field, card],
    players: match.players.map((hand, index) =>
      index === playerIndex ? hand.filter((_, i) => i !== cardIndex) : hand,
    ),
  });
};

/** 場のカードを捨て札に移して、次のラウンドに進める */
export const clearField = (match: Match): Match => ({
  ...match,
  field: [],
  trash: [...match.trash, ...match.field],
});

/** 手札がなくなったプレイヤーを勝者として返す */
export const findWinner = (match: Match): PlayerIndex | null => {
  if (match.players[1].length === 0) return 0;
  if (match.players[0].length === 0) return 1;
  return null;
};

/** 手番を相手に渡す */
export const nextTurn = (current: PlayerIndex): PlayerIndex =>
  (1 - current) as PlayerIndex;
