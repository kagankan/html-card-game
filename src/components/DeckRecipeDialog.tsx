'use client';

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import type { ElementName } from './constants';

type DeckRecipe = Partial<Readonly<Record<ElementName, number>>>;

interface DeckRecipeDialogProps {
  allowedElements: readonly ElementName[];
  defaultDeckRecipe: DeckRecipe;
  onSubmit?: (deckRecipe: DeckRecipe) => void;
}

export interface DeckRecipeDialogRef {
  onOpen: () => void;
}

const DeckRecipeDialog = forwardRef<DeckRecipeDialogRef, DeckRecipeDialogProps>(
  ({ allowedElements, defaultDeckRecipe, onSubmit }, ref) => {
    const [deckRecipe, setDeckRecipe] = useState<DeckRecipe>({ ...defaultDeckRecipe });
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

    const handleSubmit = () => {
      onSubmit?.(deckRecipe);
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <dialog
          open
          className="relative z-50 max-h-[80vh] w-96 overflow-auto rounded-lg bg-white p-4 shadow-xl"
        >
          <div>
            <h2 className="border-b-2 border-gray-300 pb-2 text-center text-lg font-bold">
              ゲームに使用する要素の枚数を選択
            </h2>
            <ul>
              {allowedElements.map((el) => {
                const current = deckRecipe[el] ?? 0;
                return (
                  <li key={el} className="flex items-center justify-between py-1">
                    <span>{el}</span>
                    <span className="flex items-center justify-between overflow-clip rounded-lg bg-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          setDeckRecipe({
                            ...deckRecipe,
                            [el]: Math.max(0, current - 1),
                          });
                        }}
                        className="flex h-8 w-8 items-center justify-center text-lg"
                      >
                        -
                      </button>
                      <span className="bg-white px-2 py-1 text-center">{current}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setDeckRecipe({
                            ...deckRecipe,
                            [el]: current + 1,
                          });
                        }}
                        className="flex h-8 w-8 items-center justify-center text-lg"
                      >
                        +
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex justify-center space-x-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                開始
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                キャンセル
              </button>
            </div>
          </div>
        </dialog>
      </div>
    );
  }
);

DeckRecipeDialog.displayName = 'DeckRecipeDialog';

export default DeckRecipeDialog;