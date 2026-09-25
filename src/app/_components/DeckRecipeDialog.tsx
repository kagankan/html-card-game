"use client";

import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import type { ElementName } from "../../service/constants";
import {
  MAX_COUNT_PER_ELEMENT,
  clampCount,
  countCards,
  validateDeckRecipe,
  type DeckRecipe,
} from "../../service/deck";
import Button from "./Button";

interface DeckRecipeDialogProps {
  allowedElements: readonly ElementName[];
  defaultDeckRecipe: DeckRecipe;
  /** 対戦するプレイヤーの人数。カード枚数の検証に使う */
  playerCount?: number;
  /** 1 種類あたりの枚数の上限 */
  maxPerElement?: number;
  title?: string;
  onSubmit?: (deckRecipe: DeckRecipe) => void;
  onCancel?: () => void;
}

export interface DeckRecipeDialogRef {
  onOpen: () => void;
}

const VALIDATION_MESSAGES = {
  "too-few": "カードの枚数が少なすぎます",
  "too-many": "カードの枚数が多すぎます",
} as const;

const DeckRecipeDialog = forwardRef<DeckRecipeDialogRef, DeckRecipeDialogProps>(
  (
    {
      allowedElements,
      defaultDeckRecipe,
      playerCount = 2,
      maxPerElement = MAX_COUNT_PER_ELEMENT,
      title = "ゲームに使用する要素の枚数を選択",
      onSubmit,
      onCancel,
    },
    ref,
  ) => {
    const [deckRecipe, setDeckRecipe] = useState<DeckRecipe>({
      ...defaultDeckRecipe,
    });
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      setDeckRecipe({ ...defaultDeckRecipe });
    }, [defaultDeckRecipe]);

    useImperativeHandle(ref, () => ({
      onOpen: () => {
        setDeckRecipe({ ...defaultDeckRecipe });
        setIsOpen(true);
      },
    }));

    const onClose = () => {
      setIsOpen(false);
    };

    const handleCancel = () => {
      onCancel?.();
      onClose();
    };

    const validation = validateDeckRecipe(deckRecipe, playerCount);

    const handleSubmit = () => {
      if (!validation.ok) return;
      onSubmit?.(deckRecipe);
      onClose();
    };

    const changeCount = (element: ElementName, delta: number) => {
      const current = deckRecipe[element] ?? 0;
      setDeckRecipe({
        ...deckRecipe,
        [element]:
          delta < 0
            ? Math.max(1, current + delta)
            : clampCount(current + delta, maxPerElement),
      });
    };

    useEffect(() => {
      if (!isOpen) return;
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          handleCancel();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
        <dialog
          open
          aria-labelledby="deck-recipe-dialog-title"
          className="relative z-50 max-h-[80vh] w-96 overflow-auto rounded-lg bg-white p-4 shadow-xl"
        >
          <div>
            <h2
              id="deck-recipe-dialog-title"
              className="border-b-2 border-gray-300 pb-2 text-center text-lg font-bold"
            >
              {title}
            </h2>
            <ul>
              {allowedElements.map((el) => {
                const current = deckRecipe[el] ?? 0;
                return (
                  <li
                    key={el}
                    className="flex items-center justify-between py-1"
                  >
                    <span>{el}</span>
                    <span className="flex items-center justify-between overflow-clip rounded-lg bg-gray-100">
                      <button
                        type="button"
                        onClick={() => changeCount(el, -1)}
                        aria-label={`${el} を 1 枚減らす`}
                        className="flex h-8 w-8 items-center justify-center text-lg"
                      >
                        -
                      </button>
                      <span
                        className="bg-white px-2 py-1 text-center"
                        aria-live="polite"
                      >
                        {current}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeCount(el, 1)}
                        aria-label={`${el} を 1 枚増やす`}
                        className="flex h-8 w-8 items-center justify-center text-lg"
                      >
                        +
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-center text-sm text-gray-600">
              合計 {countCards(deckRecipe)} 枚
            </p>
            {!validation.ok && (
              <p role="alert" className="text-center text-sm text-red-600">
                {VALIDATION_MESSAGES[validation.reason]}
              </p>
            )}
            <div className="mt-4 flex justify-center space-x-2">
              <Button
                size="small"
                variant="primary"
                disabled={!validation.ok}
                onClick={handleSubmit}
              >
                開始
              </Button>
              <Button size="small" variant="secondary" onClick={handleCancel}>
                キャンセル
              </Button>
            </div>
          </div>
        </dialog>
      </div>
    );
  },
);

DeckRecipeDialog.displayName = "DeckRecipeDialog";

export default DeckRecipeDialog;
