"use client";

import React, { useState, useEffect, useRef } from "react";
import { checkNext, formatHtml } from "../../service/content-model";
import type { ElementName } from "../../service/constants";
import Card from "./Card";
import { startMatch } from "../../service/match";
import CardBack from "./CardBack";
import DeckRecipeDialog, { type DeckRecipeDialogRef } from "./DeckRecipeDialog";
import { isSoundEnabledStore, playSound } from "../../lib/_modules/snd";
import Snd from "snd-lib";
import { flushSync } from "react-dom";

const DEFAULT_DECK_RECIPE = {
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
} as const satisfies Partial<Record<ElementName, number>>;

const ALLOWED_ELEMENTS = Object.keys(DEFAULT_DECK_RECIPE) as ElementName[];

const recipeToDeck = (
  recipe: Partial<Record<ElementName, number>>,
): ElementName[] => {
  return (Object.entries(recipe) as [ElementName, number][]).flatMap(
    ([element, count]) => Array.from({ length: count }, () => element),
  );
};

export default function Game() {
  const [deckRecipe, setDeckRecipe] =
    useState<Partial<Record<ElementName, number>>>(DEFAULT_DECK_RECIPE);
  const [match, setMatch] = useState<ReturnType<typeof startMatch> | null>(
    null,
  );

  useEffect(() => {
    setMatch(startMatch(recipeToDeck(deckRecipe), 2));
  }, [deckRecipe]);

  if (!match) {
    return <div>Loading...</div>;
  }

  return (
    <GameInner
      initialMatch={match}
      deckRecipe={deckRecipe}
      setDeckRecipe={setDeckRecipe}
    />
  );
}

function GameInner({
  initialMatch,
  deckRecipe,
  setDeckRecipe,
}: {
  initialMatch: ReturnType<typeof startMatch>;
  deckRecipe: Partial<Record<ElementName, number>>;
  setDeckRecipe: React.Dispatch<
    React.SetStateAction<Partial<Record<ElementName, number>>>
  >;
}) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const [match, setMatch] =
    useState<ReturnType<typeof startMatch>>(initialMatch);
  const [turnPlayer, setTurnPlayer] = useState<0 | 1>(0);
  const [passedPlayers, setPassedPlayers] = useState({ 0: false, 1: false });
  const [wonPlayer, setWonPlayer] = useState<0 | 1 | null>(null);
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
    if (match.players[0].length === 0) {
      setWonPlayer(0);
    } else if (match.players[1].length === 0) {
      setWonPlayer(1);
    }
  }, [match.players]);

  // CPU turn logic
  useEffect(() => {
    if (turnPlayer === 1) {
      const timer = setTimeout(() => {
        playCpu();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [turnPlayer, match]);

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
    const newPlayers = [...match.players];
    newPlayers[playerIndex] = newPlayers[playerIndex].filter(
      (_, index) => index !== cardIndex,
    );
    const card = match.players[playerIndex][cardIndex];
    setMatch({
      ...match,
      field: [...match.field, card],
      players: newPlayers,
    });
  };

  const pass = (): void => {
    setPassedPlayers((prev) => ({ ...prev, [turnPlayer]: true }));
    setTurnPlayer((prev) => (1 - prev) as 0 | 1);
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
    setMatch((prev) => ({
      ...prev,
      field: [],
      trash: [...prev.trash, ...prev.field],
    }));
    setPassedPlayers({ 0: false, 1: false });
  };

  const handleDeckRecipeSubmit = (
    value: Partial<Record<ElementName, number>>,
  ) => {
    setDeckRecipe(value);
    setMatch(startMatch(recipeToDeck(value), 2));
    setTurnPlayer(0);
    setPassedPlayers({ 0: false, 1: false });
    setWonPlayer(null);
    setSelectedCardIndex(null);
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
    setMatch(startMatch(recipeToDeck(deckRecipe), 2));
    setTurnPlayer(0);
    setPassedPlayers({ 0: false, 1: false });
    setWonPlayer(null);
    setSelectedCardIndex(null);
  };

  return (
    <>
      <DeckRecipeDialog
        ref={deckRecipeDialogRef}
        allowedElements={ALLOWED_ELEMENTS}
        defaultDeckRecipe={deckRecipe}
        onSubmit={handleDeckRecipeSubmit}
      />

      <div className="Game">
        <button
          type="button"
          className="absolute top-2 right-2 z-10 rounded-lg bg-blue-500 px-4 py-2 text-white"
          onClick={() => {
            deckRecipeDialogRef.current?.onOpen();
          }}
        >
          使用するカードを選択
        </button>

        <button
          type="button"
          className="absolute top-16 right-2 z-10 rounded-lg bg-blue-500 px-4 py-2 text-white"
          onClick={() => {
            isSoundEnabledStore.update((prev) => !prev);
          }}
        >
          {isSoundEnabled ? "音を無効にする" : "音を有効にする"}
        </button>

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
                  <li key={card.id} className="min-w-0 last:flex-shrink-0">
                    <div
                      className="w-20"
                      style={{
                        transform: `rotate(${deg}deg) translateY(calc(cos(${deg}deg) * -10rem + 9rem))`,
                      }}
                    >
                      <CardBack
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
                <button
                  type="button"
                  onClick={() => setIsTreeVisible(false)}
                  className="mt-4 rounded-lg bg-gray-500 px-4 py-2 text-white"
                >
                  閉じる
                </button>
              </div>
            </div>
          )}
          <p className="text-center">
            <button
              type="button"
              onClick={() => setIsTreeVisible(true)}
              className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white"
            >
              ツリーを表示
            </button>
          </p>
        </section>

        {/* 捨て札 */}
        <section className="Game__Trash -z-10">
          <section className="flex h-full items-center justify-center p-2">
            <ul className="flex w-16 justify-center">
              {match.trash.map((card, index) => (
                <li
                  key={`trash-${card.id}-${index}`}
                  className="min-w-0 last:flex-shrink-0"
                >
                  <div className="w-16">
                    <CardBack
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

        <div className="Game__Hands">
          <ul className="mx-auto flex max-w-4xl justify-center">
            {match.players[0].map((card, index) => {
              const el = card.element;
              const ok = checkNext(
                match.field.map((card) => card.element),
                el,
              );
              return (
                <li
                  key={card.id}
                  className={`min-w-0 transition-transform last:flex-shrink-0 hover:z-10 hover:-translate-y-4 ${
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

          <p className="text-center">
            <button
              type="button"
              onClick={handlePlayCard}
              className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300 disabled:text-gray-500"
              disabled={selectedCardIndex === null || turnPlayer === 1}
            >
              カードを出す
            </button>
            <button
              type="button"
              onClick={handleClearSelection}
              className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300 disabled:text-gray-500"
              disabled={selectedCardIndex === null}
            >
              選択解除
            </button>
            <button
              type="button"
              onClick={pass}
              className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300 disabled:text-gray-500"
              disabled={turnPlayer === 1}
            >
              パス
            </button>
          </p>
        </div>

        <section className="Game__Info z-10 w-full place-self-center p-2">
          {wonPlayer !== null && (
            <div className="rounded-lg bg-white p-4 text-center shadow-lg">
              <p>{wonPlayer === 0 ? "あなた" : "相手"}の勝ちです</p>
              <button
                type="button"
                className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white"
                onClick={restartGame}
              >
                最初から
              </button>
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
