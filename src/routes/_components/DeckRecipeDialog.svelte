<script lang="ts">
  import type { ElementName } from "./constants";

  type DeckRecipe = Partial<Readonly<Record<ElementName, number>>>;
  export let allowedElements: readonly ElementName[] = [];
  export let defaultDeckRecipe: DeckRecipe = {};
  let deckRecipe: DeckRecipe = {};
  export let onSubmit: ((deckRecipe: DeckRecipe) => void) | undefined =
    undefined;

  $: deckRecipe = { ...defaultDeckRecipe };

  let dialogRef: HTMLDialogElement;
  export const onOpen = () => {
    deckRecipe = { ...defaultDeckRecipe };
    dialogRef.showModal();
  };
  const onClose = () => {
    dialogRef.close();
  };
</script>

<dialog
  bind:this={dialogRef}
  class="fixed inset-0 z-50 rounded-lg bg-white p-4 shadow-xl"
>
  <div>
    <h2 class="border-b-2 border-gray-300 pb-2 text-center text-lg font-bold">
      ゲームに使用する要素の枚数を選択
    </h2>
    <ul>
      {#each allowedElements as el}
        {@const current = deckRecipe[el] ?? 0}
        <li class="flex items-center justify-between py-1">
          <span>
            {el}
          </span>
          <span
            class="flex items-center justify-between
          overflow-clip rounded-lg bg-gray-100
          "
          >
            <button
              type="button"
              on:click={() => {
                deckRecipe = {
                  ...deckRecipe,
                  [el]: Math.max(0, current - 1),
                };
              }}
              class="px-2"
              disabled={current === 0}
            >
              -
            </button>
            <span class="min-w-8 px-2 text-end">
              {current}
            </span>
            <button
              type="button"
              on:click={() => {
                deckRecipe = {
                  ...deckRecipe,
                  [el]: current + 1,
                };
              }}
              class="px-2"
            >
              +
            </button>
          </span>
        </li>
      {/each}
    </ul>
    <p>
      <span class="font-bold">合計:</span>
      {Object.values(deckRecipe).reduce((acc, cur) => acc + cur, 0)}
    </p>
    <p class="mt-4 text-center">
      <button
        type="button"
        on:click={() => {
          onSubmit?.(deckRecipe);
          onClose();
        }}
        class="rounded-lg bg-blue-500 px-4 py-1 text-white"
      >
        確定してゲームを開始
      </button>
      <button
        type="button"
        on:click={onClose}
        class="rounded-lg bg-blue-500 px-4 py-1 text-white"
      >
        キャンセル
      </button>
    </p>
  </div>
</dialog>
