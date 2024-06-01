<script lang="ts">
  import { checkNext, formatHtml } from "./content-model";
  import { browser } from "$app/environment";
  import type { ElementName } from "./constants";
  import Card from "./Card.svelte";
  import { startMatch } from "./match";
  import CardBack from "./CardBack.svelte";
  import DeckRecipeDialog from "./DeckRecipeDialog.svelte";

  /** このゲームで使えることにする要素 */
  const ALLOWED_ELEMENTS = [
    "html",
    "body",
    "head",
    "div",
    "span",
    "a",
    "p",
    "button",
    "ul",
    "li",
    "hr",
    "br",
  ] as const;

  const DEFAULT_DECK_RECIPE = {
    body: 1,
    div: 2,
    span: 2,
    a: 2,
    hr: 2,
    p: 2,
    button: 2,
    ul: 2,
    li: 2,
    br: 2,
  } as const satisfies Partial<
    Record<(typeof ALLOWED_ELEMENTS)[number], number>
  >;
  let deckRecipe: Partial<Record<ElementName, number>> = DEFAULT_DECK_RECIPE;

  let deckRecipeDialogRef: DeckRecipeDialog;

  const recipeToDeck = (
    recipe: Partial<Record<ElementName, number>>,
  ): ElementName[] => {
    return (Object.entries(recipe) as [ElementName, number][]).flatMap(
      ([element, count]) => Array.from({ length: count }, () => element),
    );
  };

  let match = startMatch(recipeToDeck(deckRecipe), 2);
  let turnPlayer: 0 | 1 = 0;
  let passedPlayers = { 0: false, 1: false };
  let wonPlayer: 0 | 1 | null = null;
  let selectedCardIndex: number | null = null;
  let infoChecked = false;

  $: {
    if (match.players[0].length === 0) {
      wonPlayer = 0;
    } else if (match.players[1].length === 0) {
      wonPlayer = 1;
    }
  }

  $: {
    if (wonPlayer !== null || turnPlayer === 0 || turnPlayer === 1) {
      infoChecked = false;
    }
  }

  const play = (playerIndex: number, cardIndex: number): void => {
    const newPlayers = [...match.players];
    newPlayers[playerIndex] = newPlayers[playerIndex].filter(
      (_, index) => index !== cardIndex,
    );
    const card = match.players[playerIndex][cardIndex];
    match = {
      ...match,
      field: [...match.field, card],
      players: newPlayers,
    };
  };

  const pass = (): void => {
    passedPlayers[turnPlayer] = true;
    turnPlayer = 1 - turnPlayer;
  };

  const playCpu = (): void => {
    // 相手の番
    const nextCardIndex = match.players[1].findIndex((card) =>
      checkNext(
        match.field.map((card) => card.element),
        card.element,
      ),
    );
    if (nextCardIndex !== -1) {
      document.startViewTransition(() => {
        play(1, nextCardIndex);
      });
      turnPlayer = 0;
    } else {
      pass();
    }
  };

  // 場を流す
  const nextRound = (): void => {
    match = {
      ...match,
      field: [],
      trash: [...match.trash, ...match.field],
    };
    passedPlayers = { 0: false, 1: false };
  };

  $: {
    // 手番のプレイヤー以外が全員パスしたら次のラウンド
    if (
      (turnPlayer === 0 && passedPlayers[1]) ||
      (turnPlayer === 1 && passedPlayers[0])
    ) {
      nextRound();
    }
  }
</script>

<DeckRecipeDialog
  bind:this={deckRecipeDialogRef}
  allowedElements={ALLOWED_ELEMENTS}
  defaultDeckRecipe={deckRecipe}
  onSubmit={(value) => {
    deckRecipe = value;
    match = startMatch(recipeToDeck(value), 2);
    turnPlayer = 0;
    passedPlayers = { 0: false, 1: false };
    wonPlayer = null;
  }}
/>

<div class=" Game">
  <button
    type="button"
    class="absolute right-2 top-2 rounded-lg bg-blue-500 px-4 py-2 text-white"
    on:click={() => {
      deckRecipeDialogRef.onOpen();
    }}
  >
    使用するカードを選択
  </button>
  <section class="Game__Opponents">
    <section
      class=" relative isolate max-w-sm rounded-lg bg-gray-50 bg-opacity-50 p-8"
    >
      <div
        class=" absolute inset-0 z-10 m-auto size-fit rounded-sm bg-slate-100 p-2"
      >
        <p>CPU 1</p>
        <p>残り {match.players[1].length}枚</p>
      </div>
      <ul class=" flex justify-center">
        {#each match.players[1] as card, index}
          {@const deg = (index - (match.players[1].length - 1) / 2) * 5}
          <li class="min-w-0 last:flex-shrink-0">
            <div
              class="w-20"
              style="transform: rotate({deg}deg) translateY(calc(cos({deg}deg) * -10rem + 9rem));"
            >
              <CardBack
                style={`view-transition-name:card-${card.id}; contain: paint;`}
              />
            </div>
          </li>
        {/each}
      </ul>
    </section>
  </section>

  <!-- 場 -->
  <div class="Game__Field relative grid grid-rows-[1fr_auto] p-2">
    <ul class=" flex justify-center">
      {#each match.field as card, index}
        <li class="min-w-0 max-w-6 last:max-w-none last:shrink-0">
          <div class="w-24">
            <Card
              element={card.element}
              description={card.element === "a" ? " (hrefなし)" : ""}
              style="view-transition-name:card-{card.id}; contain: paint;"
            />
          </div>
        </li>
      {/each}
    </ul>
    <pre
      id="tree"
      popover="auto"
      class=" m-auto w-11/12 rounded bg-slate-50 p-2 shadow-md backdrop:bg-black backdrop:bg-opacity-40
    "><code
        >{match.field.length
          ? formatHtml(
              match.field.map((card) => card.element),
              2,
            )
          : "場にカードがありません"}</code
      ></pre>
    <p class="text-center">
      <button
        popovertarget="tree"
        type="button"
        class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white"
        >ツリーを表示</button
      >
    </p>
  </div>

  <div class="Game__Hands">
    <ul class="mx-auto flex max-w-4xl justify-center">
      {#each match.players[0] as card, index}
        {@const el = card.element}
        {@const ok = browser
          ? checkNext(
              match.field.map((card) => card.element),
              el,
            )
          : false}
        <li
          class="  min-w-0 transition-transform last:flex-shrink-0 hover:z-10 hover:-translate-y-4 {selectedCardIndex ===
          index
            ? 'z-10 -translate-y-4'
            : ''}"
        >
          <div class="w-[min(10rem,30vw)]">
            <Card
              element={el}
              description={el === "a" ? " (hrefなし)" : ""}
              onClick={() => {
                selectedCardIndex = index;
              }}
              disabled={!ok || turnPlayer === 1}
              selected={selectedCardIndex === index}
              style={`view-transition-name:card-${card.id}; contain: paint;`}
            />
          </div>
        </li>
      {/each}
    </ul>

    <p class="text-center">
      <button
        type="button"
        on:click={() => {
          document.startViewTransition(() => {
            if (selectedCardIndex !== null) {
              play(0, selectedCardIndex);
              selectedCardIndex = null;
              turnPlayer = 1;
            }
          });
        }}
        class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white
disabled:bg-gray-300 disabled:text-gray-500"
        disabled={selectedCardIndex === null || turnPlayer === 1}
      >
        カードを出す
      </button>
      <button
        type="button"
        on:click={() => {
          selectedCardIndex = null;
        }}
        class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white
disabled:bg-gray-300 disabled:text-gray-500"
        disabled={selectedCardIndex === null}
      >
        選択解除
      </button>
      <button
        type="button"
        on:click={pass}
        class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white
disabled:bg-gray-300 disabled:text-gray-500"
        disabled={turnPlayer === 1}>パス</button
      >
    </p>
  </div>

  <section class="Game__Info z-10 w-full place-self-center p-2">
    {#if !infoChecked}
      <div class="rounded-lg bg-white p-4 text-center shadow-lg">
        {#if wonPlayer !== null}
          <p>{wonPlayer === 0 ? "あなた" : "相手"}の勝ちです</p>
          <button
            type="button"
            class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white"
            on:click={() => {
              match = startMatch(recipeToDeck(deckRecipe), 2);
              turnPlayer = 0;
              passedPlayers = { 0: false, 1: false };
              wonPlayer = null;
            }}
          >
            最初から
          </button>
        {:else if turnPlayer === 0}
          <p>あなたのターンです</p>
          <button
            type="button"
            on:click={() => {
              infoChecked = true;
            }}
            class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white
          disabled:bg-gray-300 disabled:text-gray-500"
          >
            OK
          </button>
        {:else}
          <p>相手のターンです</p>
          <button
            type="button"
            on:click={() => {
              playCpu();
            }}
            class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white
        disabled:bg-gray-300 disabled:text-gray-500"
          >
            OK
          </button>
        {/if}
      </div>
    {/if}
  </section>
</div>

<style>
  .Game {
    position: fixed;
    inset: 0;

    display: grid;
    grid-template:
      "Opponents" minmax(0, 1fr)
      "Field" minmax(0, 2fr)
      "Hands" minmax(0, 2fr)
      /
      minmax(0, 1fr);
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

  * {
    min-width: 0;
  }

  :root::view-transition-group(*) {
    animation-duration: 1s;
  }
</style>
