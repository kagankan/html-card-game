<script lang="ts">
  import { checkNext, formatHtml } from "./content-model";
  import { browser } from "$app/environment";
  import type { ElementName } from "./constants";
  import Card from "./Card.svelte";
  import { startMatch } from "./match";

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
  let match = startMatch(DEFAULT_DECK, 1);
</script>

<pre><code>{formatHtml(match.field, 2)}</code></pre>

<p>
  <button
    class="mt-8 rounded-lg bg-blue-500 px-4 py-2 text-white"
    on:click={() => {
      match = startMatch(DEFAULT_DECK, 1);
    }}
  >
    最初から
  </button>

  <button
    class="mt-8 rounded-lg bg-blue-500 px-4 py-2 text-white"
    on:click={() => {
      match = {
        ...match,
        field: [],
      };
    }}
  >
    場をリセット
  </button>
</p>

<ul class=" mt-8 grid auto-cols-auto grid-flow-col">
  <!-- for -->
  {#each match.players[0] as el}
    {@const ok = browser ? checkNext(match.field, el) : false}
    <li class=" w-24 transition-transform hover:z-10 hover:-translate-y-4">
      <Card
        title={el}
        description={el === "a" ? " (hrefなし)" : ""}
        onClick={() => {
          match = {
            field: [...match.field, el],
            players: [match.players[0].filter((n) => n !== el)],
          };
        }}
        disabled={!ok}
      />
    </li>
  {/each}
</ul>
