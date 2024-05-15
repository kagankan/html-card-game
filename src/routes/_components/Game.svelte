<script lang="ts">
  import { checkNext, formatHtml } from "./content-model";
  import { browser } from "$app/environment";
  import type { ElementName } from "./constants";
  import Card from "./Card.svelte";
  import { startMatch } from "./match";
  import CardBack from "./CardBack.svelte";

  const DEFAULT_DECK: ElementName[] = [
    "body",
    "div",
    "span",
    "a",
    "hr",
    "p",
    "button",
    "ul",
    "li",
    "br",
    "ul",
    "li",
    "br",
    "ul",
    "li",
    "br",
    "ul",
    "li",
    "br",
  ];
  let fieldMode: "card" | "tree" = "card";
  let match = startMatch(DEFAULT_DECK, 2);
  let turnPlayer: 0 | 1 = 0;
  let passedPlayers = { 0: false, 1: false };
  let wonPlayer: 0 | 1 | null = null;

  $: {
    if (match.players[0].length === 0) {
      wonPlayer = 0;
    } else if (match.players[1].length === 0) {
      wonPlayer = 1;
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
      checkNext(match.field, card),
    );
    if (nextCardIndex !== -1) {
      play(1, nextCardIndex);
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

<div class=" Game">
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
        {#each match.players[1] as el, index}
          {@const deg = (index - (match.players[1].length - 1) / 2) * 5}
          <li class="min-w-0 last:flex-shrink-0">
            <div
              class="w-20"
              style="transform: rotate({deg}deg) translateY(calc(sin({90 +
                deg}deg) * -10rem + 9rem));"
            >
              <CardBack />
            </div>
          </li>
        {/each}
      </ul>
    </section>
  </section>

  <!-- 場 -->
  <div class="Game__Field grid grid-rows-[1fr_auto] p-2">
    {#if fieldMode === "card"}
      <ul class=" flex justify-center">
        {#each match.field as el, index}
          <li class="min-w-0 max-w-6 last:max-w-none last:shrink-0">
            <div class="w-24">
              <Card
                element={el}
                description={el === "a" ? " (hrefなし)" : ""}
              />
            </div>
          </li>
        {/each}
      </ul>
    {:else}
      <pre><code>{formatHtml(match.field, 2)}</code></pre>
    {/if}
    <p class="text-center">
      <button
        type="button"
        on:click={() => {
          fieldMode = fieldMode === "card" ? "tree" : "card";
        }}
        class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white"
        >表示切替</button
      >
    </p>
  </div>

  <div class="Game__Hands">
    <ul class="mx-auto flex max-w-4xl justify-center">
      {#each match.players[0] as el, index}
        {@const ok = browser ? checkNext(match.field, el) : false}
        <li
          class="  min-w-0 transition-transform last:flex-shrink-0 hover:z-10 hover:-translate-y-4"
        >
          <div class="w-[min(10rem,30vw)]">
            <Card
              element={el}
              description={el === "a" ? " (hrefなし)" : ""}
              onClick={() => {
                play(0, index);
                turnPlayer = 1;
              }}
              disabled={!ok || turnPlayer === 1}
            />
          </div>
        </li>
      {/each}
    </ul>
  </div>

  <section class="Game__Info w-full p-2">
    <div class="rounded-lg bg-black bg-opacity-10 p-4 text-center">
      {#if wonPlayer !== null}
        <p>{wonPlayer === 0 ? "あなた" : "相手"}の勝ちです</p>
        <button
          class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white"
          on:click={() => {
            match = startMatch(DEFAULT_DECK, 2);
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
          on:click={pass}
          class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white
    disabled:bg-gray-300 disabled:text-gray-500">パス</button
        >
      {:else}
        <p>相手のターンです</p>
        <p>相手が行動を選択します</p>
        <button
          type="button"
          on:click={() => {
            playCpu();
          }}
          class="mt-8 rounded-lg bg-blue-500 px-4 py-2 text-white
        disabled:bg-gray-300 disabled:text-gray-500"
        >
          OK
        </button>
      {/if}
    </div>
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
      "Info" minmax(0, 1fr)
      /
      minmax(0, 1fr);
  }
  .Game__Info {
    grid-area: Info;
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
</style>
