"use client";

import React, { useState, useEffect, useRef } from "react";
import { checkNext, formatHtml } from "../../service/content-model";
import Card from "./Card";
import {
  clearField,
  findWinner,
  nextTurn,
  playCard,
  startMatch,
  type Match,
  type PlayerIndex,
} from "../../service/match";
import {
  ALLOWED_ELEMENTS,
  DEFAULT_DECK_RECIPE,
  recipeToDeck,
  type DeckRecipe,
} from "../../service/deck";
import CardBack from "./CardBack";
import DeckRecipeDialog, { type DeckRecipeDialogRef } from "./DeckRecipeDialog";
import { isSoundEnabledStore, playSound } from "../../lib/_modules/snd";
import Snd from "snd-lib";
import { flushSync } from "react-dom";
import commonStyles from "./Common.module.css";
import Button from "./Button";

const PLAYER_COUNT = 2;
const CPU_THINKING_TIME_MS = 1000;

export default function Game({ onBackToTop }: { onBackToTop?: () => void }) {
  const [deckRecipe, setDeckRecipe] = useState<DeckRecipe>(DEFAULT_DECK_RECIPE);
  const [match, setMatch] = useState<Match | null>(null);

  useEffect(() => {
    const result = startMatch(recipeToDeck(deckRecipe), PLAYER_COUNT);
    setMatch(result.ok ? result.value : null);
  }, [deckRecipe]);

  if (!match) {
    return <div>Loading...</div>;
  }

  return (
    <GameInner
      initialMatch={match}
      deckRecipe={deckRecipe}
      setDeckRecipe={setDeckRecipe}
      onBackToTop={onBackToTop}
    />
  );
}

function GameInner({
  initialMatch,
  deckRecipe,
  setDeckRecipe,
  onBackToTop,
}: {
  initialMatch: Match;
  deckRecipe: DeckRecipe;
  setDeckRecipe: React.Dispatch<React.SetStateAction<DeckRecipe>>;
  onBackToTop?: () => void;
}) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const [match, setMatch] = useState<Match>(initialMatch);
  const [turnPlayer, setTurnPlayer] = useState<PlayerIndex>(0);
  const [passedPlayers, setPassedPlayers] = useState({ 0: false, 1: false });
  const [wonPlayer, setWonPlayer] = useState<PlayerIndex | null>(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null,
  );
  const [isTreeVisible, setIsTreeVisible] = useState(false);

  const deckRecipeDialogRef = useRef<DeckRecipeDialogRef>(null);

  // Subscribe to sound enabled store
  useEffect(() => {
    const unsubscribe = isSoundEnabledStore.subscribe(setIsSoundEnabled);
    return unsubscribe;
  }, []);

  // Check for winner
  useEffect(() => {
    setWonPlayer(findWinner(match));
  }, [match]);

  // CPU turn logic
  useEffect(() => {
    if (turnPlayer === 1) {
      const timer = setTimeout(() => {
        playCpu();
      }, CPU_THINKING_TIME_MS);
      return () => clearTimeout(timer);
    }
  }, [turnPlayer]);

  // Auto next round logic
  useEffect(() => {
    if (
      (turnPlayer === 0 && passedPlayers[1]) ||
      (turnPlayer === 1 && passedPlayers[0])
    ) {
      nextRound();
    }
  }, [turnPlayer, passedPlayers]);

  const play = (playerIndex: number, cardIndex: number): void => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          performPlay(playerIndex, cardIndex);
        });
      });
    } else {
      performPlay(playerIndex, cardIndex);
    }
  };

  const performPlay = (playerIndex: number, cardIndex: number): void => {
    const result = playCard(match, playerIndex, cardIndex);
    if (result.ok) {
      setMatch(result.value);
    }
  };

  const pass = (): void => {
    setPassedPlayers((prev) => ({ ...prev, [turnPlayer]: true }));
    setTurnPlayer((prev) => nextTurn(prev));
  };

  const playCpu = (): void => {
    const nextCardIndex = match.players[1].findIndex((card) =>
      checkNext(
        match.field.map((card) => card.element),
        card.element,
      ),
    );
    if (nextCardIndex !== -1) {
      play(1, nextCardIndex);
      setTurnPlayer(0);
    } else {
      pass();
    }
  };

  const nextRound = (): void => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          performNextRound();
        });
      });
    } else {
      performNextRound();
    }
  };

  const performNextRound = (): void => {
    setMatch((prev) => clearField(prev));
    setPassedPlayers({ 0: false, 1: false });
  };

  const resetGame = (recipe: DeckRecipe) => {
    const result = startMatch(recipeToDeck(recipe), PLAYER_COUNT);
    if (!result.ok) return;
    setMatch(result.value);
    setTurnPlayer(0);
    setPassedPlayers({ 0: false, 1: false });
    setWonPlayer(null);
    setSelectedCardIndex(null);
  };

  const handleDeckRecipeSubmit = (value: DeckRecipe) => {
    setDeckRecipe(value);
    resetGame(value);
  };

  const handleCardClick = (index: number) => {
    setSelectedCardIndex(index);
    playSound(Snd.SOUNDS.SELECT);
  };

  const handlePlayCard = () => {
    if (selectedCardIndex !== null) {
      const cardIndexToPlay = selectedCardIndex;
      setSelectedCardIndex(null);
      play(0, cardIndexToPlay);
      playSound(Snd.SOUNDS.SWIPE);
      setTurnPlayer(1);
    }
  };

  const handleClearSelection = () => {
    setSelectedCardIndex(null);
  };

  const restartGame = () => {
    resetGame(deckRecipe);
  };

  return (
    <>
      <DeckRecipeDialog
        ref={deckRecipeDialogRef}
        allowedElements={ALLOWED_ELEMENTS}
        defaultDeckRecipe={deckRecipe}
        playerCount={PLAYER_COUNT}
        onSubmit={handleDeckRecipeSubmit}
      />

      <div className={`Game ${commonStyles.Background}`}>
        {onBackToTop && (
          <div className="fixed top-2 left-2 z-50">
            <Button
              type="button"
              size="small"
              variant="secondary"
              onClick={onBackToTop}
            >
              ← トップページに戻る
            </Button>
          </div>
        )}

        {/* 各種操作ボタン */}
        <div className="fixed top-2 right-2 z-50 flex flex-col items-end gap-2">
          <Button
            type="button"
            size="small"
            variant="secondary"
            onClick={() => {
              deckRecipeDialogRef.current?.onOpen();
            }}
          >
            使用するカードを選択
          </Button>

          <Button
            type="button"
            size="small"
            variant="secondary"
            onClick={() => {
              isSoundEnabledStore.update((prev) => !prev);
            }}
          >
            {isSoundEnabled ? "音を無効にする" : "音を有効にする"}
          </Button>
        </div>

        {/* 相手 */}
        <section className="Game__Opponents">
          <section className="bg-opacity-50 relative isolate z-20 max-w-sm rounded-lg bg-gray-50 p-8">
            <div className="absolute inset-0 z-10 m-auto size-fit rounded-sm bg-slate-100 p-2">
              <p>CPU 1</p>
              <p>残り {match.players[1].length}枚</p>
            </div>
            <ul className="flex justify-center">
              {match.players[1].map((card, index) => {
                const deg = (index - (match.players[1].length - 1) / 2) * 5;
                return (
                  <li key={card.id} className="min-w-0 last:shrink-0">
                    <div
                      className="w-20"
                      style={{
                        transform: `rotate(${deg}deg) translateY(calc(cos(${deg}deg) * -10rem + 9rem))`,
                      }}
                    >
                      <CardBack
                        color="red"
                        style={{
                          viewTransitionName: `card-${card.id}`,
                          contain: "paint",
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </section>

        {/* 場 */}
        <section className="Game__Field relative grid grid-rows-[1fr_auto] p-2">
          <div />
          <ul className="flex justify-center">
            {match.field.map((card, index) => (
              <li
                key={`${card.id}-${index}`}
                className="max-w-6 min-w-0 last:max-w-none last:shrink-0"
              >
                <div className="w-24">
                  <Card
                    element={card.element}
                    size="small"
                    description={card.element === "a" ? " (hrefなし)" : ""}
                    style={{
                      viewTransitionName: `card-${card.id}`,
                      contain: "paint",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
          {isTreeVisible && (
            <div className="bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center bg-black">
              <div className="m-auto w-11/12 max-w-2xl rounded bg-slate-50 p-4 shadow-md">
                <pre className="whitespace-pre-wrap">
                  <code>
                    {match.field.length
                      ? formatHtml(
                          match.field.map((card) => card.element),
                          2,
                        )
                      : "場にカードがありません"}
                  </code>
                </pre>
                <Button
                  type="button"
                  onClick={() => setIsTreeVisible(false)}
                  className="mt-4"
                  size="medium"
                  variant="secondary"
                >
                  閉じる
                </Button>
              </div>
            </div>
          )}
          <p className="text-center">
            <Button
              type="button"
              onClick={() => setIsTreeVisible(true)}
              className="mt-4"
              size="small"
              variant="secondary"
            >
              ツリーを表示
            </Button>
          </p>
        </section>

        {/* 捨て札 */}
        <section className="Game__Trash -z-10">
          <section className="flex h-full items-center justify-center p-2">
            <ul className="flex w-16 justify-center">
              {match.trash.map((card, index) => (
                <li
                  key={`trash-${card.id}-${index}`}
                  className="min-w-0 last:shrink-0"
                >
                  <div className="w-16">
                    <CardBack
                      color="blue"
                      style={{
                        viewTransitionName: `card-${card.id}`,
                        contain: "paint",
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </section>

        <div className="Game__Hands grid grid-rows-[1fr_auto]">
          <div className="min-h-0">
            <ul className="mx-auto flex max-w-4xl justify-center">
              {match.players[0].map((card, index) => {
                const el = card.element;
                const ok = checkNext(
                  match.field.map((card) => card.element),
                  el,
                );
                return (
                  <li
                    key={index}
                    className={`min-w-0 transition-transform last:shrink-0 hover:z-10 hover:-translate-y-4 ${
                      selectedCardIndex === index ? "z-10 -translate-y-4" : ""
                    }`}
                  >
                    <div className="w-[min(10rem,24vw)]">
                      <Card
                        element={el}
                        description={el === "a" ? " (hrefなし)" : ""}
                        onClick={() => handleCardClick(index)}
                        disabled={!ok || turnPlayer === 1}
                        selected={selectedCardIndex === index}
                        style={{
                          viewTransitionName: `card-${card.id}`,
                          contain: "paint",
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="text-center">
            <Button
              type="button"
              onClick={handlePlayCard}
              className="mt-4"
              size="medium"
              variant="secondary"
              disabled={selectedCardIndex === null || turnPlayer === 1}
            >
              カードを出す
            </Button>
            <Button
              type="button"
              onClick={handleClearSelection}
              className="mt-4"
              size="medium"
              variant="secondary"
              disabled={selectedCardIndex === null}
            >
              選択解除
            </Button>
            <Button
              type="button"
              onClick={pass}
              className="mt-4"
              size="medium"
              variant="secondary"
              disabled={turnPlayer === 1}
            >
              パス
            </Button>
          </p>
        </div>

        <section className="Game__Info z-10 w-full place-self-center p-2">
          {wonPlayer !== null && (
            <div className="rounded-lg bg-white p-4 text-center shadow-lg">
              <p>{wonPlayer === 0 ? "あなた" : "相手"}の勝ちです</p>
              <Button
                type="button"
                className="mt-4"
                size="medium"
                variant="danger"
                onClick={restartGame}
              >
                最初から
              </Button>
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .Game {
          position: fixed;
          inset: 0;
          display: grid;
          grid-template:
            "Opponents Opponents Opponents" minmax(0, 1fr)
            ". Field Trash" minmax(0, 2fr)
            "Hands Hands Hands" minmax(0, 2fr) / 1fr minmax(0, 2fr) 1fr;
        }
        .Game__Info {
          grid-area: 1 / 1 / -1 / -1;
        }
        .Game__Opponents {
          grid-area: Opponents;
        }
        .Game__Field {
          grid-area: Field;
        }
        .Game__Hands {
          grid-area: Hands;
        }
        .Game__Trash {
          grid-area: Trash;
        }
        * {
          min-width: 0;
        }
      `}</style>
      <style jsx global>{`
        :root::view-transition-group(*) {
          animation-duration: 1s;
        }
        /* トランジション中のみ前後を指定したい場合はこうする */
        /* :global(::view-transition-group(player-label-1)) {
          z-index: -1;
        } */
        /* 移動のトランジションはgroupに対してかかっている */
        /* :global(::view-transition-group(*)) {
          animation: none;
        } */
        /* クロスフェードはold,newに対してかかっている */
        ::view-transition-old(*) {
          animation: none;
        }
        ::view-transition-new(*) {
          animation: none;
        }
      `}</style>
    </>
  );
}
