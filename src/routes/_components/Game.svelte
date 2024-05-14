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

<section class="   rounded-lg bg-gray-50 bg-opacity-50 p-8">
  <p>相手の手札</p>
  <ul class=" mt-8 grid auto-cols-auto grid-flow-col">
    <!-- for -->
    {#each match.players[1] as el, index}
      <li class=" w-24">
        <CardBack />
      </li>
    {/each}
  </ul>
</section>

<!-- 場 -->
<div
  class="
"
>
  {#if fieldMode === "card"}
    <ul class=" mt-8 grid auto-cols-auto grid-flow-col">
      {#each match.field as el, index}
        {@const ok = browser ? checkNext(match.field, el) : false}
        <li class=" w-12">
          <Card
            title={formatHtml([el])}
            description={el === "a" ? " (hrefなし)" : ""}
          />
        </li>
      {/each}
    </ul>
  {:else}
    <pre><code>{formatHtml(match.field, 2)}</code></pre>
  {/if}
  <p>
    <button
      type="button"
      on:click={() => {
        fieldMode = fieldMode === "card" ? "tree" : "card";
      }}
      class="mt-8 rounded-lg bg-blue-500 px-4 py-2 text-white">表示切替</button
    >
  </p>
</div>

<!-- 捨札 -->
<ul class=" mt-8 grid hidden auto-cols-auto grid-flow-col">
  {#each match.trash as el}
    <li class=" w-4">
      <Card
        title={formatHtml([el])}
        description={el === "a" ? " (hrefなし)" : ""}
      />
    </li>
  {/each}
</ul>

<section
  class="   mt-8 w-full rounded-lg bg-black bg-opacity-10 p-8 text-center"
>
  {#if wonPlayer !== null}
    <p>{wonPlayer === 0 ? "あなた" : "相手"}の勝ちです</p>
    <button
      class="mt-8 rounded-lg bg-blue-500 px-4 py-2 text-white"
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
      class="mt-8 rounded-lg bg-blue-500 px-4 py-2 text-white
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
</section>

<ul class=" mt-8 grid auto-cols-auto grid-flow-col">
  {#each match.players[0] as el, index}
    {@const ok = browser ? checkNext(match.field, el) : false}
    <li class=" w-24 transition-transform hover:z-10 hover:-translate-y-4">
      <Card
        title={formatHtml([el])}
        description={el === "a" ? " (hrefなし)" : ""}
        onClick={() => {
          play(0, index);
          turnPlayer = 1;
        }}
        disabled={!ok || turnPlayer === 1}
      />
    </li>
  {/each}
</ul>
