"use client";

import React, { useEffect, useState } from "react";
import Card from "@/app/_components/Card";
import CardBack from "@/app/_components/CardBack";
import Button from "@/app/_components/Button";
import { formatHtml } from "@/service/content-model";
import {
  canComplete,
  canPlaceRun,
  completeColumn,
  faceUpStart,
  dealFromStock,
  dealSpider,
  isWon,
  moveRun,
  TARGET_RUN_LENGTH,
  type SpiderState,
} from "@/service/spider";

type Selection = { column: number; index: number } | null;

export default function SolitairePage() {
  // 山札の生成は crypto.randomUUID を使うためクライアントでのみ行う
  const [state, setState] = useState<SpiderState | null>(null);
  const [selection, setSelection] = useState<Selection>(null);

  useEffect(() => {
    setState(dealSpider());
  }, []);

  if (!state) {
    return <div className="p-8">読み込み中...</div>;
  }

  const won = isWon(state);

  // 選択中の連なり
  const selectedRun =
    selection !== null
      ? state.columns[selection.column].slice(selection.index)
      : null;

  const restart = () => {
    setState(dealSpider());
    setSelection(null);
  };

  const handleCardClick = (column: number, index: number) => {
    const card = state.columns[column][index];
    if (!card.faceUp) return;

    // 同じカードをもう一度クリックしたら選択解除
    if (
      selection &&
      selection.column === column &&
      selection.index === index
    ) {
      setSelection(null);
      return;
    }
    setSelection({ column, index });
  };

  const handlePlace = (toColumn: number) => {
    if (selection === null) return;
    const next = moveRun(state, selection.column, selection.index, toColumn);
    if (next) {
      setState(next);
      setSelection(null);
    }
  };

  const handleDeal = () => {
    const next = dealFromStock(state);
    if (next) {
      setState(next);
      setSelection(null);
    }
  };

  const handleComplete = (column: number) => {
    const next = completeColumn(state, column);
    if (next) {
      setState(next);
      setSelection(null);
    }
  };

  return (
    <div className="min-h-screen bg-green-900 p-4 text-white">
      {/* ヘッダー */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <h1 className="text-xl font-bold">HTML スパイダーソリティア</h1>
        <span className="rounded bg-black/30 px-2 py-1 text-sm">
          完成: {state.foundations.length}
        </span>
        <button
          type="button"
          onClick={handleDeal}
          disabled={state.stock.length === 0}
          className="rounded bg-black/30 px-3 py-1 text-sm disabled:opacity-40"
        >
          山札から配る（残り {state.stock.length}）
        </button>
        <Button type="button" size="small" variant="secondary" onClick={restart}>
          最初から
        </Button>
        <a href="/" className="text-sm underline">
          ← 大富豪へ
        </a>
      </div>

      {/* 遊び方 */}
      <p className="mb-4 max-w-3xl text-xs text-white/80">
        表向きのカードをクリックして選ぶと、そのカード以下が連なりとして選択され、
        置ける列に「ここに置く」ボタンが出ます。並びの判定は「親のコンテンツモデルに
        内包できるか」で決まります（例: ul は li を内包できる ＝ ul→li は OK）。表向きの
        連なりが有効なまま {TARGET_RUN_LENGTH} 枚以上になると、列の下に出る「完成」
        ボタンで好きなときに取り除けます（自動では取り除かれないので、納得いくまで深く
        入れ子にできます）。
      </p>

      {won && (
        <div className="mb-4 rounded bg-yellow-400 p-4 text-center text-black">
          <p className="text-lg font-bold">クリア！全部片付きました 🎉</p>
        </div>
      )}

      {/* 場（列） */}
      <div className="flex gap-3 overflow-x-auto pb-8">
        {state.columns.map((column, colIndex) => {
          const canPlaceHere =
            selectedRun !== null &&
            selection !== null &&
            selection.column !== colIndex &&
            canPlaceRun(selectedRun, column);

          return (
            <div key={colIndex} className="flex w-28 shrink-0 flex-col gap-1">
              {/* 置き先ボタン / 列ラベル */}
              <div className="h-8">
                {canPlaceHere ? (
                  <button
                    type="button"
                    onClick={() => handlePlace(colIndex)}
                    className="w-full rounded bg-yellow-400 px-2 py-1 text-xs font-bold text-black"
                  >
                    ここに置く
                  </button>
                ) : (
                  <div className="text-center text-xs text-white/40">
                    列 {colIndex + 1}
                  </div>
                )}
              </div>

              {/* カード */}
              <div className="flex flex-col">
                {column.length === 0 && (
                  <div className="aspect-58/89 w-full rounded-lg border-2 border-dashed border-white/30" />
                )}
                {column.map((card, cardIndex) => {
                  const isSelected =
                    selection !== null &&
                    selection.column === colIndex &&
                    cardIndex >= selection.index;

                  return (
                    <div
                      key={card.id}
                      className={cardIndex === 0 ? "" : "-mt-20"}
                      style={{ zIndex: cardIndex }}
                    >
                      {card.faceUp ? (
                        <Card
                          element={card.element}
                          description={card.element === "a" ? " (href無)" : ""}
                          onClick={() => handleCardClick(colIndex, cardIndex)}
                          selected={isSelected}
                        />
                      ) : (
                        <CardBack />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 完成ボタン（有効な連なりが目標枚数以上のとき） */}
              {canComplete(column) && (
                <button
                  type="button"
                  onClick={() => handleComplete(colIndex)}
                  className="mt-1 w-full rounded bg-emerald-400 px-2 py-1 text-xs font-bold text-black"
                >
                  完成（{column.length - faceUpStart(column)} 枚）
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 完成した連なり */}
      {state.foundations.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-2 text-sm font-bold">完成した連なり</h2>
          <div className="flex flex-wrap gap-3">
            {state.foundations.map((run, i) => (
              <pre
                key={i}
                className="rounded bg-black/30 p-2 text-xs whitespace-pre-wrap"
              >
                <code>{safeFormat(run.map((c) => c.element))}</code>
              </pre>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const safeFormat = (elements: Parameters<typeof formatHtml>[0]): string => {
  try {
    return formatHtml(elements, 2);
  } catch {
    return elements.join(" > ");
  }
};
